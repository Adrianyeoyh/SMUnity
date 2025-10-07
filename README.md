# SMUnity - Community Service Platform for SMU Students

SMUnity is a centralized web platform designed to streamline how Singapore Management University (SMU) students discover and apply for community service projects (CSPs) and volunteer opportunities. The platform addresses the current challenges of scattered information across various channels by providing a unified hub for CSP discovery, application, and management.

## 🎯 Key Features

### For Students
- **CSP Discovery & Matching**: Search and filter CSPs by type, location, and project dates
- **Visual Map Integration**: View CSPs on a map to find opportunities nearby
- **Direct Application**: Apply for CSPs directly on the platform with status tracking
- **CSU Module Integration**: Important notices to complete the CSU module on eLearn before applying
- **Progress Tracking**: Monitor service hours and graduation requirements
- **Profile Management**: Showcase skills and interests to match with relevant projects

### For CSP Leaders
- **Project Management**: Create, modify, and remove CSP listings
- **Application Review**: Review, accept, or reject applicants with notification system
- **Analytics Dashboard**: Track application statistics and volunteer engagement

### For Administrators
- **User Management**: Create, edit, or delete user and CSP organization profiles
- **Platform Analytics**: Track total service hours, popular causes, and volunteer trends
- **Content Moderation**: Approve CSP listings and monitor platform activity

## 🛠 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom SMU brand colors
- **UI Components**: shadcn/ui for consistent, accessible components
- **Routing**: React Router DOM for navigation
- **HTTP Client**: Axios for API requests
- **Build Tool**: Vite for fast development and building
- **Icons**: Lucide React for consistent iconography

## 🎨 Design System

### SMU Brand Colors
- **Primary Red**: #E31E24
- **Primary Blue**: #1B365D
- **Accent Gold**: #D4AF37
- **Light Background**: #F8F9FA
- **Dark Text**: #2C3E50

### Typography
- **Display Font**: Poppins (headings and branding)
- **Body Font**: Inter (content and UI text)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   └── layout/             # Layout components (Navbar, Footer)
├── contexts/               # React contexts (Auth)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions
├── pages/                  # Page components
├── services/               # API service functions
└── types/                  # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smunity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication

The platform supports three user roles:

1. **Student**: Browse and apply for CSPs
2. **CSP Leader**: Manage community service projects
3. **Administrator**: Platform management and analytics

### Demo Accounts
- **Student**: `student@smu.edu.sg` / `password`
- **CSP Leader**: `leader@smu.edu.sg` / `password`
- **Admin**: `admin@smu.edu.sg` / `password`

## 📱 Responsive Design

SMUnity is built with mobile-first responsive design principles:
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Touch-friendly interface elements
- Optimized navigation for mobile devices
- Adaptive layouts for different screen sizes

## 🔗 API Integration

The platform integrates with various APIs for:
- User authentication and management
- CSP CRUD operations
- Application management
- Analytics and reporting
- File uploads and media handling

API endpoints are configured in `src/services/api.ts` with Axios interceptors for:
- Automatic token management
- Error handling
- Request/response logging

## 🎯 Key User Flows

### Student Journey
1. **Registration/Login** → Complete profile with skills and interests
2. **CSU Module Warning** → Complete required module on eLearn
3. **Discovery** → Browse and filter available CSPs
4. **Application** → Apply for preferred projects
5. **Tracking** → Monitor application status and service hours

### CSP Leader Journey
1. **Registration** → Set up organization profile
2. **Project Creation** → Submit CSP for admin approval
3. **Management** → Review applications and manage volunteers
4. **Analytics** → Track project performance and impact

### Admin Journey
1. **Dashboard** → Monitor platform activity and metrics
2. **Content Moderation** → Approve/reject CSP submissions
3. **User Management** → Manage user accounts and roles
4. **Analytics** → Generate reports and insights

## 🎨 UI Components

Built with shadcn/ui components including:
- **Buttons**: Multiple variants with SMU branding
- **Cards**: Consistent content containers
- **Forms**: Accessible form components with validation
- **Navigation**: Responsive navigation with mobile support
- **Modals**: Dialog and sheet components
- **Badges**: Status indicators and tags
- **Tables**: Data display with sorting and filtering

## 📊 Analytics & Reporting

The platform provides comprehensive analytics for:
- User engagement metrics
- CSP performance statistics
- Popular causes and trends
- Service hour tracking
- Application success rates

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Protected routes and API endpoints
- Secure password handling

## 🌟 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **Advanced Matching**: AI-powered CSP recommendations
- **Gamification**: Badges and achievements system
- **Social Features**: Community discussions and networking
- **Integration**: Direct OnTrac synchronization
- **Multi-language**: Support for multiple languages

## 📄 License

This project is developed for Singapore Management University and is intended for educational and community service purposes.

## 🤝 Contributing

For development guidelines and contribution instructions, please refer to the project documentation.

---

**SMUnity** - Connecting SMU students with meaningful community service opportunities. Making a difference, one project at a time. ❤️
