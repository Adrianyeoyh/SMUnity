import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Search, 
  Users, 
  MapPin, 
  Calendar, 
  Star,
  ArrowRight,
  Target,
  TrendingUp,
  Globe,
  Clock,
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const categories = [
    'All Categories',
    'Education',
    'Environment',
    'Healthcare',
    'Community',
    'Children',
    'Elderly',
    'Animals',
    'Arts & Culture'
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory && selectedCategory !== 'All Categories') params.set('category', selectedCategory);
    
    const queryString = params.toString();
    navigate(`/discover${queryString ? `?${queryString}` : ''}`);
  };

  const features = [
    {
      icon: Search,
      title: "Discover Opportunities",
      description: "Find CSPs that match your interests, skills, and schedule with our advanced filtering system."
    },
    {
      icon: Users,
      title: "Connect with Community",
      description: "Join fellow SMU students in making a meaningful impact in the community."
    },
    {
      icon: Target,
      title: "Track Progress",
      description: "Monitor your community service hours and ensure you meet SMU graduation requirements."
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Get insights into popular causes and volunteer trends across the SMU community."
    }
  ];

  const stats = [
    { label: "Active CSPs", value: "150+", icon: Heart },
    { label: "Student Volunteers", value: "2,500+", icon: Users },
    { label: "Community Partners", value: "80+", icon: Globe },
    { label: "Hours Contributed", value: "15,000+", icon: Clock }
  ];

  const popularCSPs = [
    {
      title: "Tutoring Underprivileged Children",
      organization: "Children's Society Singapore",
      location: "Toa Payoh",
      date: "Every Saturday",
      spots: 5,
      applicants: 12,
      rating: 4.8
    },
    {
      title: "Beach Cleanup at East Coast",
      organization: "Green Earth Society",
      location: "East Coast Park",
      date: "Monthly",
      spots: 20,
      applicants: 45,
      rating: 4.6
    },
    {
      title: "Senior Care Home Visits",
      organization: "Singapore Red Cross",
      location: "Various Locations",
      date: "Weekly",
      spots: 8,
      applicants: 18,
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-smu-primary via-smu-secondary to-smu-accent text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Make a Difference with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                SMUnity
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              Connect with meaningful community service projects that align with your passion, 
              schedule, and SMU graduation requirements.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search for community service projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-3 text-base bg-white border-gray-200 text-gray-900 focus:outline-none focus:ring-0 focus:border-gray-200 focus:shadow-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="w-full md:w-48">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white border-gray-200 text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 focus:shadow-none">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    className="w-full md:w-auto smu-gradient px-8"
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Button size="lg" variant="secondary" className="bg-white text-smu-primary hover:bg-gray-100" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-smu-primary" asChild>
                    <Link to="/discover">Explore CSPs</Link>
                  </Button>
                </>
              ) : (
                <Button size="lg" variant="secondary" className="bg-white text-smu-primary hover:bg-gray-100" asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-smu-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-smu-primary text-white mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="font-display font-bold text-3xl text-smu-primary mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-smu-primary mb-4">
              Why Choose SMUnity?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've designed SMUnity to address the challenges students face in finding 
              and managing community service opportunities at SMU.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-smu-gradient text-white mb-4 mx-auto">
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular CSPs Section */}
      <section className="py-20 bg-smu-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-smu-primary mb-4">
              Popular Community Service Projects
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of SMU students in these impactful initiatives across Singapore.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCSPs.map((csp, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="success" className="mb-2">
                      {csp.spots} spots left
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{csp.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{csp.title}</CardTitle>
                    <CardDescription className="text-smu-primary font-medium">
                      {csp.organization}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{csp.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{csp.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{csp.applicants} applicants</span>
                  </div>
                  <Button className="w-full mt-4" variant="smu">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="smu" asChild>
              <Link to="/discover">
                Explore All CSPs
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-6 text-smu-primary">
            Ready to Make an Impact?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-600">
            Join the SMU community in creating positive change. Start your community service 
            journey today and fulfill your graduation requirements while making a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Button size="lg" className="bg-smu-primary text-white hover:bg-smu-secondary">
                  Sign Up Now
                </Button>
                <Button size="lg" variant="outline" className="border-smu-primary text-smu-primary hover:bg-smu-primary hover:text-white">
                  Learn More
                </Button>
              </>
            ) : (
              <Button size="lg" className="bg-smu-primary text-white hover:bg-smu-secondary" asChild>
                <Link to="/discover">Start Volunteering</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
