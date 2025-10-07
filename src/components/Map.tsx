import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { MapPin, Calendar, Clock, Users, Star, Heart } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { type DemoProject } from '@/data/demoProjects';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  projects: DemoProject[];
  favorites?: Set<string>;
  onToggleFavorite?: (projectId: string) => void;
}

const Map: React.FC<MapProps> = ({ projects, favorites = new Set(), onToggleFavorite }) => {
  // Singapore center coordinates
  const singaporeCenter: [number, number] = [1.3521, 103.8198];

  // Category colors for markers
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'Education':
        return '#3b82f6'; // Blue
      case 'Environment':
        return '#10b981'; // Green
      case 'Healthcare':
        return '#ef4444'; // Red
      case 'Community':
        return '#8b5cf6'; // Purple
      case 'Children':
        return '#f59e0b'; // Orange
      case 'Elderly':
        return '#ec4899'; // Pink
      case 'Animals':
        return '#84cc16'; // Lime
      case 'Arts & Culture':
        return '#6366f1'; // Indigo
      default:
        return '#6b7280'; // Gray
    }
  };

  // Custom marker icon
  const createCustomIcon = (color: string) => {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path fill="${color}" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
          <circle fill="#fff" cx="12.5" cy="12.5" r="6"/>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <MapContainer
        center={singaporeCenter}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {projects.map((project) => {
          if (!project.coordinates) return null;
          
          return (
            <Marker
              key={project.id}
              position={[project.coordinates.lat, project.coordinates.lng]}
              icon={createCustomIcon(getCategoryColor(project.category))}
            >
              <Popup className="custom-popup" maxWidth={280} minWidth={200}>
                <div 
                  className="p-2 w-full max-w-[280px] sm:max-w-[300px] font-inter"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    padding: "8px"
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2 leading-tight">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: getCategoryColor(project.category) }}></div>
                        <p className="text-xs font-medium text-gray-700 truncate">{project.organization}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleFavorite?.(project.id)}
                      className="flex items-center gap-1 ml-1 flex-shrink-0 hover:scale-105 transition-transform"
                    >
                      <Heart 
                        className={`h-3 w-3 ${favorites.has(project.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} 
                      />
                    </button>
                  </div>
                  
                  {/* Description */}
                  <p 
                    className="text-xs text-gray-600 mb-2 line-clamp-2 leading-relaxed mt-1"
                    style={{ 
                      marginTop: "4px",
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {project.description}
                  </p>
                  
                  {/* Compact Details */}
                  <div className="space-y-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <span className="text-xs text-gray-900 truncate">{project.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-green-600 flex-shrink-0" />
                      <span className="text-xs text-gray-900 truncate">{project.startDate} - {project.endDate}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-purple-600 flex-shrink-0" />
                      <span className="text-xs text-gray-900 truncate">{project.duration} ({project.frequency})</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-orange-600 flex-shrink-0" />
                      <span className="text-xs text-gray-900">{project.spots} spots available</span>
                    </div>
                  </div>
                  
                  {/* Category and Skills */}
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span 
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(project.category) }}
                    >
                      {project.category}
                    </span>
                    <div className="flex items-center gap-1 min-w-0">
                      {project.skills.slice(0, 1).map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700 truncate">
                          {skill}
                        </span>
                      ))}
                      {project.skills.length > 1 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                          +{project.skills.length - 1}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <a
                    href={`/csp/${project.id}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-medium px-2 py-1.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-center shadow-sm hover:shadow-md mt-2 view-details-btn"
                    style={{ 
                      color: 'white !important',
                      marginTop: '16px',
                      fontFamily: "'Inter', sans-serif",
                      backgroundColor: 'rgb(37, 99, 235)',
                      background: 'linear-gradient(to right, rgb(37, 99, 235), rgb(29, 78, 216))'
                    }}
                  >
                    <span style={{ color: 'white !important' }}>View Details</span>
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;
