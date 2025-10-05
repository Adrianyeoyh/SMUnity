# SMUnity - Community Service Platform

SMUnity is a centralized web platform designed to streamline how SMU students discover and apply for community service projects (CSPs) and volunteer opportunities. The platform consolidates all CSP listings into one accessible hub, allowing students to browse available projects, filter them by skills, interests, or location, and apply directly through the site.

## Features

### For Students
- **CSP Discovery**: Search and filter CSPs by type, location, and project dates
- **Visual Map**: View CSPs on an interactive map to find opportunities nearby
- **Application Management**: Apply for CSPs directly on the platform with status tracking
- **Timesheet**: Log and track volunteer hours for approved applications
- **Profile Management**: Manage personal information, skills, and preferences

### For CSP Leaders
- **Project Management**: Create, modify, or remove CSP listings
- **Application Review**: Review, accept, or reject applicants
- **Communication**: Notify students of outcomes through platform messages
- **Data Export**: Export applicant data to CSV for offline tracking

### For Administrators
- **User Management**: Create, edit, or delete user and CSP organization profiles
- **System Oversight**: Monitor platform usage and manage system settings
- **Email Blasts**: Send notifications to all students for newly posted CSPs

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Bootstrap 5.3.0, Custom CSS
- **Icons**: Font Awesome 6.0.0
- **Maps**: Leaflet 1.9.4
- **HTTP Client**: Axios
- **Storage**: LocalStorage (for demo purposes)

## Project Structure

```
SMUnity/
├── index.html              # Homepage
├── login.html              # Login page
├── register.html           # Registration page
├── forgot-password.html    # Password reset page
├── csp-discovery.html      # CSP discovery and search
├── csp-details.html        # Individual CSP details
├── my-applications.html    # User's applications
├── timesheet.html          # Hours logging
├── profile.html            # User profile
├── csp-management.html     # CSP leader dashboard
├── admin-panel.html        # Admin dashboard
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── api.js             # API and mock data
│   ├── auth.js            # Authentication management
│   ├── main.js            # Main application logic
│   ├── login.js           # Login functionality
│   ├── register.js        # Registration functionality
│   ├── forgot-password.js # Password reset
│   ├── csp-discovery.js   # CSP discovery and search
│   ├── csp-details.js     # CSP details page
│   ├── my-applications.js # Applications management
│   ├── timesheet.js       # Timesheet functionality
│   ├── profile.js         # Profile management
│   ├── csp-management.js  # CSP leader dashboard
│   └── admin-panel.js     # Admin panel
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. The application will load with mock data pre-populated

### Demo Accounts
The platform includes demo accounts for testing:

**Student Account:**
- Email: `student@smu.edu.sg`
- Password: `password123`

**CSP Leader Account:**
- Email: `leader@csp.org`
- Password: `password123`

**Admin Account:**
- Email: `admin@smunity.com`
- Password: `admin123`

## Usage

### For Students
1. **Register/Login**: Create an account or use demo credentials
2. **Discover CSPs**: Browse available community service projects
3. **Apply**: Submit applications for projects of interest
4. **Track Progress**: Monitor application status and log hours
5. **Manage Profile**: Update personal information and preferences

### For CSP Leaders
1. **Login**: Use CSP leader credentials
2. **Create CSPs**: Add new community service projects
3. **Manage Applications**: Review and respond to student applications
4. **Track Progress**: Monitor project participation and hours

### For Administrators
1. **Login**: Use admin credentials
2. **User Management**: Oversee user accounts and organizations
3. **System Monitoring**: Track platform usage and performance
4. **Communication**: Send system-wide notifications

## Key Features

### Responsive Design
- Mobile-first approach with Bootstrap grid system
- Optimized for desktop, tablet, and mobile devices
- Touch-friendly interface elements

### Interactive Maps
- Leaflet.js integration for location-based CSP discovery
- Marker clustering and popup information
- Responsive map containers

### Real-time Updates
- Live search and filtering
- Dynamic content updates
- Status change notifications

### Data Management
- LocalStorage for persistent data (demo purposes)
- Mock API with realistic data structures
- Export functionality for reports

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

### Mock Data
The application uses LocalStorage to simulate a backend database. Data persists between sessions and includes:
- User accounts and profiles
- Community service projects
- Applications and timesheets
- Organizations and settings

### API Structure
The `api.js` file provides a complete mock API with endpoints for:
- Authentication (login, register, logout)
- CSP management (CRUD operations)
- Application handling
- User management
- Statistics and reporting

### Customization
The platform is designed to be easily customizable:
- CSS variables for theming
- Modular JavaScript architecture
- Bootstrap components for consistent UI
- Configurable settings and preferences

## Future Enhancements

### Planned Features
- Real backend integration
- Email notification system
- Advanced reporting and analytics
- Mobile app development
- Integration with SMU systems (OnTrac)
- Payment processing for paid CSPs
- Social features and community building

### Technical Improvements
- Progressive Web App (PWA) capabilities
- Offline functionality
- Advanced search and recommendation engine
- Real-time chat and messaging
- File upload and document management
- Advanced security features

## Contributing

This is a demonstration project showcasing modern web development practices. For production use, consider:
- Implementing proper backend infrastructure
- Adding comprehensive testing
- Enhancing security measures
- Optimizing performance
- Adding accessibility features

## License

This project is created for educational and demonstration purposes. Please ensure compliance with SMU policies and local regulations when implementing similar systems.

## Support

For questions or issues related to this demonstration project, please refer to the code documentation and comments within the source files.

---

**Note**: This is a demonstration project using mock data and LocalStorage. For production deployment, implement proper backend infrastructure, database systems, and security measures.
