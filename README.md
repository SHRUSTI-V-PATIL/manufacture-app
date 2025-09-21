# Manufacturing Management Application

A comprehensive modular manufacturing management application that enables businesses to create, track, and manage end-to-end production digitally, replacing fragmented spreadsheets with a centralized platform.

## 🚀 Features

### Core Modules
- **Authentication & User Management** - Login with OTP for password reset
- **Dashboard & Analytics** - Real-time manufacturing overview with KPIs
- **Manufacturing Orders (MO)** - Create, edit, delete, track with BOM, work centers, deadlines, dependencies
- **Work Orders (WO)** - Assign to operators, track status (started, paused, completed, issues)
- **Work Centers** - Manage capacity, cost per hour, downtime tracking
- **Stock Ledger** - Real-time raw material/finished goods movement, auto-updates after WO
- **Bills of Material (BOM)** - Define material requirements per finished good, link BOM to orders
- **Reports & Analytics** - Order delays, resource utilization, throughput, exportable reports (Excel/PDF)

### Key Capabilities
- **Real-time Updates** - WebSocket integration for live data
- **Dynamic Filtering** - Filter by order state (planned, in-progress, done, canceled)
- **Scalable Architecture** - Modular design for future extensions (QC, maintenance)
- **Export Features** - Excel/PDF report generation
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **Vite** for fast development and building
- **React Router** for navigation
- **React Query** for data fetching and caching
- **Socket.io Client** for real-time updates
- **React Hook Form** for form management

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Winston** for logging
- **Express Rate Limiting** for API protection

### Development Tools
- **Concurrently** for running both servers
- **ESLint** for code quality
- **Jest/Vitest** for testing

## 📁 Project Structure

```
manufacturing-management-app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── store/           # State management
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/          # Database and app configuration
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic services
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── shared/                  # Shared types and utilities
│   └── types.ts
├── .github/
│   └── copilot-instructions.md
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd manufacturing-management-app
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/manufacturing-management
   JWT_SECRET=your_jwt_secret_here
   CLIENT_URL=http://localhost:3000
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development servers:**
   ```bash
   npm run dev
   ```
   This will start both frontend (port 3000) and backend (port 5000) concurrently.

### Available Scripts

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend

# Building
npm run build            # Build both applications
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Testing
npm run test             # Run all tests
npm run test:frontend    # Run frontend tests
npm run test:backend     # Run backend tests

# Linting
npm run lint             # Lint all code
npm run lint:frontend    # Lint frontend code
npm run lint:backend     # Lint backend code

# Production
npm start                # Start production server
```

## 🎯 Target Users

- **Manufacturing Managers** - Overall production oversight and planning
- **Operators** - Day-to-day work order execution and status updates
- **Inventory Managers** - Stock management and material tracking
- **Business Owners** - High-level analytics and reporting

## 📋 Use Case Scenarios

### 1. Authentication & Access
- Secure login with email/password
- OTP-based password reset functionality
- Role-based access control

### 2. Dashboard Overview
- Real-time manufacturing orders status
- KPIs: orders completed, in-progress, delayed
- Component availability tracking
- Dynamic filtering by order state

### 3. Manufacturing Order Management
- Create new manufacturing orders with product, quantity, dates
- Auto-fetch BOM when product is selected
- Assign work centers and set deadlines
- Track dependencies between orders

### 4. Work Order Execution
- Break down MO into specific work steps
- Assign operators to work orders
- Track status: started, paused, completed, issues
- Record start/pause times per work center

### 5. Stock Management
- Real-time stock ledger with material movements
- Negative entries for raw material consumption
- Positive entries for finished goods production
- Auto-updates after work order completion

### 6. Reporting & Analytics
- Generate reports on production efficiency
- Export data to Excel/PDF formats
- Track resource utilization and throughput
- Identify bottlenecks and delays

## 🔧 Development Guidelines

### Code Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Implement proper error handling
- Write comprehensive tests
- Document complex logic

### Database Design
- Normalized schema for efficiency
- Proper indexing for performance
- Soft deletes for data integrity
- Audit trails for changes

### Security
- JWT-based authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- HTTPS in production

## 🚀 Deployment

### Development
The application is configured to run locally with hot-reload enabled for both frontend and backend.

### Production
1. Build the applications: `npm run build`
2. Set up production environment variables
3. Deploy backend to your server
4. Deploy frontend to a CDN or static hosting
5. Set up MongoDB in production
6. Configure reverse proxy (nginx/Apache)

## 📈 Future Enhancements

- **Quality Control (QC) Module** - Quality checks and approvals
- **Maintenance Management** - Equipment maintenance scheduling
- **Advanced Analytics** - Machine learning for predictive insights
- **Mobile Application** - Native mobile apps for operators
- **IoT Integration** - Connect with manufacturing equipment
- **Advanced Reporting** - Custom report builder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@manufacturing-app.com or create an issue in the repository.

---

**Note:** This is a comprehensive manufacturing management system designed to replace fragmented spreadsheet workflows with a centralized, digital platform. The modular architecture allows for easy customization and scaling based on specific business needs.
