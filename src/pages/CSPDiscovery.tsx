import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Filter,
  Grid,
  List,
  Heart,
  Clock,
  Globe,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { demoProjects, type DemoProject } from '@/data/demoProjects';
import Map from '@/components/Map';

const CSPDiscovery = () => {
  const [searchParams] = useSearchParams();
  const [csps, setCsps] = useState<DemoProject[]>([]);
  const [filteredCsps, setFilteredCsps] = useState<DemoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<string[]>([]);
  const [showMap, setShowMap] = useState(() => {
    // Check if user has previously set map visibility preference
    const savedMapState = localStorage.getItem('mapVisibility');
    return savedMapState ? JSON.parse(savedMapState) : false; // Default to hidden on first visit
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    // Load favorites from localStorage on initialization
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
  });

  const categories = [
    'all',
    'Education',
    'Environment',
    'Healthcare',
    'Community',
    'Children',
    'Elderly',
    'Animals',
    'Arts & Culture'
  ];

  const locations = [
    'all',
    'Central',
    'North',
    'South',
    'East',
    'West',
    'Online'
  ];

  const durationOptions = [
    '1 hour',
    '2 hours',
    '3 hours',
    '4 hours',
    'Full day',
    'Multiple days'
  ];

  useEffect(() => {
    fetchCSPs();
    // Check for search parameter from home page
    const searchQuery = searchParams.get('search');
    const categoryQuery = searchParams.get('category');
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
    if (categoryQuery) {
      setSelectedCategory(categoryQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    filterAndSortCSPs();
  }, [csps, searchTerm, selectedCategory, selectedLocation, sortBy, startDate, endDate, selectedDuration]);

  const fetchCSPs = async () => {
    try {
      setLoading(true);
      // Use demo data instead of API call
      setCsps(demoProjects);
    } catch (error) {
      console.error('Failed to fetch CSPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCSPs = () => {
    let filtered = csps.filter(csp => {
      const matchesSearch = csp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           csp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           csp.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || selectedCategory === 'All Categories' || csp.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || csp.location === selectedLocation;
      
      // Date range filter
      const matchesDateRange = !startDate || !endDate || 
        (csp.startDate >= startDate && csp.startDate <= endDate);
      
      // Duration filter
      const matchesDuration = selectedDuration.length === 0 || 
        selectedDuration.includes(csp.duration);

      return matchesSearch && matchesCategory && matchesLocation && matchesDateRange && matchesDuration;
    });

    // Sort CSPs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'favorites':
          // For demo purposes, we'll sort by a combination of spots and organization name
          // In a real app, this would be based on actual favorite counts
          return b.spots - a.spots || a.organization.localeCompare(b.organization);
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'spots':
          return a.spots - b.spots;
        default:
          return 0;
      }
    });

    setFilteredCsps(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredCsps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCsps = filteredCsps.slice(startIndex, endIndex);

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    );
  };

  const toggleFavorite = (projectId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(projectId)) {
        newFavorites.delete(projectId);
      } else {
        newFavorites.add(projectId);
      }
      
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      
      return newFavorites;
    });
  };

  const toggleMap = () => {
    setShowMap(prev => {
      const newState = !prev;
      localStorage.setItem('mapVisibility', JSON.stringify(newState));
      return newState;
    });
  };

  const CSPCard = ({ csp }: { csp: DemoProject }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant={csp.spots > 0 ? "success" : "destructive"} className="mb-2">
            {csp.spots > 0 ? `${csp.spots} spots left` : 'Full'}
          </Badge>
          <button
            onClick={() => toggleFavorite(csp.id)}
            className="flex items-center space-x-1 hover:scale-105 transition-transform"
          >
            <Heart 
              className={`h-4 w-4 ${favorites.has(csp.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} 
            />
          </button>
        </div>
        <CardTitle className="text-lg line-clamp-2">{csp.title}</CardTitle>
        <CardDescription className="text-smu-primary font-medium">
          {csp.organization}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">{csp.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{csp.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{csp.startDate} - {csp.endDate}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{csp.duration} ({csp.frequency})</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{csp.applicants} applicants</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 py-3">
          {csp.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {csp.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{csp.skills.length - 3} more
            </Badge>
          )}
        </div>

        <Button className="w-full mt-4" variant="smu" asChild>
          <Link to={`/csp/${csp.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  const CSPListItem = ({ csp }: { csp: DemoProject }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg">{csp.title}</h3>
              <Badge variant={csp.spots > 0 ? "success" : "destructive"}>
                {csp.spots > 0 ? `${csp.spots} spots` : 'Full'}
              </Badge>
            </div>
            <p className="text-smu-primary font-medium">{csp.organization}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{csp.description}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{csp.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{csp.startDate} - {csp.endDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{csp.duration} ({csp.frequency})</span>
              </div>
              <button
                onClick={() => toggleFavorite(csp.id)}
                className="flex items-center space-x-1 hover:scale-105 transition-transform"
              >
                <Heart 
                  className={`h-4 w-4 ${favorites.has(csp.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} 
                />
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Button variant="smu" asChild>
              <Link to={`/csp/${csp.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-smu-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-smu-primary mb-4">
            Discover Community Service Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Find meaningful opportunities that match your interests, skills, and schedule. 
            Make a difference in the community while fulfilling your SMU graduation requirements.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for projects, organizations, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location === 'all' ? 'All Locations' : location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="favorites">Most Favorited</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="spots">Available Spots</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                    <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={toggleMap}
                    className="flex-1"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {showMap ? 'Hide Map' : 'Show Map'}
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date Range */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          placeholder="Start Date"
                        />
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          placeholder="End Date"
                        />
                      </div>
                    </div>

                    {/* Time Commitment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <div className="flex flex-wrap gap-2">
                        {durationOptions.map((duration) => (
                          <Button
                            key={duration}
                            variant={selectedDuration.includes(duration) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleDurationChange(duration)}
                          >
                            {duration}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Map Section */}
        {showMap && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Project Locations
              </CardTitle>
              <CardDescription>
                View available projects on the map. Click on markers to see project details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Map 
                projects={filteredCsps} 
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
               
               {/* Map Legend */}
               <div className="mt-4 flex flex-wrap gap-4 justify-center">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                   <span className="text-xs text-gray-600">Education</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                   <span className="text-xs text-gray-600">Environment</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   <span className="text-xs text-gray-600">Healthcare</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                   <span className="text-xs text-gray-600">Community</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                   <span className="text-xs text-gray-600">Children</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                   <span className="text-xs text-gray-600">Elderly</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-lime-500"></div>
                   <span className="text-xs text-gray-600">Animals</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                   <span className="text-xs text-gray-600">Arts & Culture</span>
                 </div>
               </div>
             </CardContent>
          </Card>
        )}

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">
            {filteredCsps.length} {filteredCsps.length === 1 ? 'project' : 'projects'} found
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-smu-primary"></div>
          </div>
        ) : filteredCsps.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-gray-600 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or check back later for new opportunities.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLocation('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {currentCsps.map((csp) => (
                viewMode === 'grid' ? (
                  <CSPCard key={csp.id} csp={csp} />
                ) : (
                  <CSPListItem key={csp.id} csp={csp} />
                )
              ))}
            </div>

            {/* Results Counter and Pagination */}
            <div className="mt-8">
              {/* Results Counter */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredCsps.length)} of {filteredCsps.length} results
                  {filteredCsps.length !== csps.length && (
                    <span className="text-gray-500 ml-1">
                      (filtered from {csps.length} total projects)
                    </span>
                  )}
                </p>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNumber > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-10"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CSPDiscovery;
