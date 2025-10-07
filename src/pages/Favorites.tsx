import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Users, 
  Clock,
  Bookmark
} from 'lucide-react';
import { demoProjects, type DemoProject } from '@/data/demoProjects';

const Favorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteProjects, setFavoriteProjects] = useState<DemoProject[]>([]);

  useEffect(() => {
    // Load favorites from localStorage (in a real app, this would come from the backend)
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const favoritesArray = JSON.parse(savedFavorites);
      setFavorites(new Set(favoritesArray));
      
      // Filter demo projects to only show favorited ones
      const filtered = demoProjects.filter(project => favoritesArray.includes(project.id));
      setFavoriteProjects(filtered);
    }
  }, []);

  const toggleFavorite = (projectId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(projectId)) {
      newFavorites.delete(projectId);
    } else {
      newFavorites.add(projectId);
    }
    
    setFavorites(newFavorites);
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
    
    // Update favorite projects list
    const filtered = demoProjects.filter(project => newFavorites.has(project.id));
    setFavoriteProjects(filtered);
  };

  if (favorites.size === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-600 mb-2">No Favorites Yet</h1>
            <p className="text-gray-500 mb-6">
              Start exploring projects and add them to your favorites by clicking the heart icon.
            </p>
            <Button asChild>
              <Link to="/discover">Discover Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            {favorites.size} {favorites.size === 1 ? 'project' : 'projects'} saved to your favorites
          </p>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={project.spots > 0 ? "success" : "destructive"} className="mb-2">
                    {project.spots > 0 ? `${project.spots} spots left` : 'Full'}
                  </Badge>
                  <button
                    onClick={() => toggleFavorite(project.id)}
                    className="flex items-center space-x-1 hover:scale-105 transition-transform"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current" />
                  </button>
                </div>
                <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                <CardDescription className="text-smu-primary font-medium">
                  {project.organization}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {project.description}
                </p>
                
                {/* Project Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{project.startDate} - {project.endDate}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{project.duration} ({project.frequency})</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{project.applicants} applicants</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {project.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {project.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: getCategoryColor(project.category) + '20',
                      borderColor: getCategoryColor(project.category),
                      color: getCategoryColor(project.category)
                    }}
                  >
                    {project.category}
                  </Badge>
                </div>

                {/* Action Button */}
                <Button variant="smu" asChild className="w-full mt-4">
                  <Link to={`/csp/${project.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Discover */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/discover">
              Discover More Projects
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get category colors (same as in Map component)
const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Education': '#3b82f6',
    'Environment': '#059669',
    'Healthcare': '#dc2626',
    'Community': '#9333ea',
    'Children': '#ea580c',
    'Elderly': '#ec4899',
    'Animals': '#84cc16',
    'Arts & Culture': '#6366f1',
  };
  return colors[category] || '#6b7280';
};

export default Favorites;
