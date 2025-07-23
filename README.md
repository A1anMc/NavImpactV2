# NavImpact Dashboard

> **NavImpactV2** - Intelligent Grant Matching Platform with Personalized Recommendations

<!-- Deployment trigger: Enhanced branding system with goose logo and modern design -->

## 🎨 Brand Overview

NavImpact is a modern, tech-forward platform that combines innovation with trust. Our branding system emphasizes sophistication, warmth, and clarity through a carefully crafted design system.

### Brand Colors
- **Deep Teal** (`#0f766e`) - Innovation & trust
- **Soft Coral** (`#fb6f5f`) - Energy & warmth  
- **Cool Slate** (`#334155`) - Sophistication & clarity
- **Off-White** (`#f8fafc`) - Clean, modern backdrop

### Typography
- **Carrotflower Regular** - Headlines, titles, warm brand moments
- **Neue Haas Grotesk Display Pro 45 Light** - Body text, UI, precise information

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Python 3.8+
- PostgreSQL 16+
- npm or yarn

### Development Setup

```bash
# Clone the repository
git clone https://github.com/A1anMc/NavImpactV2.git
cd NavImpactV2

# Backend Setup
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend Setup  
cd frontend
npm install
npm run dev
```

### Production Deployment

The application is deployed on Render with the following services:

- **Backend API**: `https://navimpact-api.onrender.com`
- **Frontend**: `https://navimpact-web.onrender.com`

## 📁 Project Structure

```
NavImpactV2/
├── app/                    # FastAPI backend
│   ├── api/               # API endpoints
│   ├── core/              # Core configuration
│   ├── models/            # Database models
│   ├── services/          # Business logic
│   └── main.py            # FastAPI app
├── frontend/              # Next.js frontend
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   ├── types/        # TypeScript types
│   │   ├── lib/          # Configuration & utilities
│   │   └── utils/        # Utility functions
│   └── package.json
├── alembic/               # Database migrations
├── tests/                 # Backend tests
├── scripts/               # Utility scripts
├── docs/                  # Documentation
└── ARCHIVE/               # Archived old versions
```

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL 16
- **ORM**: SQLAlchemy
- **Authentication**: JWT
- **Deployment**: Render
- **Migrations**: Alembic

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom NavImpact design system
- **State Management**: TanStack Query
- **UI Components**: Radix UI, Headless UI
- **Deployment**: Render

## 🎯 Features

### Core Functionality
- **Grant Management**: Track and manage grant opportunities with full CRUD operations
- **Task Management**: Organize tasks and workflows with comments and tags
- **Impact Metrics**: Monitor success rates and outcomes
- **Media Investments**: Track media campaigns
- **Real-time Updates**: Live data synchronization

### Phase 2 Features (New)
- **Personalized Recommendations**: AI-powered grant matching based on user profiles
- **Eligibility Matching**: Smart filtering based on organization type, industry, and location
- **User Profiles**: Comprehensive profile system with preferences and settings
- **Grant Comparison Tool**: Side-by-side comparison of grant opportunities
- **Advanced Analytics**: Detailed insights and reporting
- **Team Collaboration**: Multi-user support with role-based access

### Design System
- **Modern UI**: Card-based layouts with smooth animations
- **Responsive Design**: Works seamlessly on all devices
- **Accessibility**: WCAG compliant with focus states and reduced motion support
- **Brand Consistency**: Unified design language across all components

## 📚 Documentation

- [Branding Guide](./NAVIMPACT_BRANDING_GUIDE.md)
- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api/README.md)
- [Development Guide](./docs/development/README.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Task Management](./docs/task_management.md)
- [Strategic Handoff](./docs/strategic_handoff.md)

## 🔧 Environment Variables

### Backend
```env
DATABASE_URL=postgresql://user:password@localhost:5432/navimpact
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
FRONTEND_URL=https://navimpact-web.onrender.com
ENV=production
DEBUG=false
```

### Frontend
```env
NEXT_PUBLIC_API_URL=https://navimpact-api.onrender.com
NEXT_PUBLIC_APP_NAME=NavImpact
NODE_ENV=production
```

## 🔄 Current Status

### ✅ Completed
- **Backend**: Fully functional FastAPI with all endpoints restored
- **Database**: PostgreSQL 16 configured with Alembic migrations
- **Frontend**: Next.js 15 app with direct backend integration
- **API Communication**: Frontend connects directly to backend API
- **Branding System**: Complete NavImpact design system implemented
- **Personalized Recommendations**: AI-powered grant matching
- **User Profiles**: Comprehensive profile management
- **Modern UI**: Card-based design with animations

### 🚧 In Progress
- **Production Testing**: End-to-end testing of complete system
- **Performance Optimization**: Continuous improvement of load times

### 📋 Next Steps
1. Add authentication system
2. Implement advanced analytics
3. Add team collaboration features
4. Performance optimization

## 🎨 Branding System

Our design system includes:

### Components
- **Buttons**: Primary, secondary, gradient variants with hover effects
- **Cards**: Clean white cards with subtle borders and lift animations
- **Navigation**: Professional header with goose logo
- **Typography**: Carrotflower for headlines, Neue Haas for body text

### Logo System
- **Icon Version**: Goose with compass elements for sidebar and favicon
- **Full Logo**: Icon + "NavImpact" wordmark for headers
- **Colors**: Deep Teal body with Soft Coral accents

### Responsive Design
- **Mobile**: Single column layouts with stacked navigation
- **Tablet**: Two-column grids with horizontal navigation
- **Desktop**: Multi-column layouts with full navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@navimpact.com or create an issue in this repository.

## 🔗 Quick Links

- **Live Backend**: https://navimpact-api.onrender.com/health
- **API Documentation**: https://navimpact-api.onrender.com/api/docs
- **GitHub Repository**: https://github.com/A1anMc/NavImpactV2
- **Branding Guide**: [NAVIMPACT_BRANDING_GUIDE.md](./NAVIMPACT_BRANDING_GUIDE.md)
