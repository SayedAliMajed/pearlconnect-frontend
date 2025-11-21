# PearlConnect - Premium Service Marketplace Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.19.3-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue.svg)](https://www.mongodb.com/atlas)
[![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF.svg)](https://vitejs.dev/)

![PearlConnect Screenshot](https://via.placeholder.com/1200x600/4f46e5/ffffff?text=PearlConnect+-+Service+Marketplace+Dashboard)


## 🎯 Project Overview

PearlConnect was developed to solve the growing need for a centralized platform where customers can easily discover, book, and review professional services, while service providers can efficiently manage their business operations.

### 🚀 Key Features
- **Seamless Booking System**: 12-hour format time slot booking with provider-based availability
- **Comprehensive Review System**: 5-star ratings and feedback for service quality tracking
- **Provider Management Dashboard**: Complete service CRUD, availability scheduling, and analytics
- **Secure Authentication**: JWT-based multi-role authentication (Customer, Provider, Admin)
- **Responsive Design**: Mobile-first approach with professional UI/UX standards

## 🌟 Features

### 👥 **User Management**
- **Multi-role Authentication**: Customer, Provider, and Admin roles
- **Secure JWT Authentication**: Industry-standard security practices
- **Profile Management**: Comprehensive user profiles with service-specific data
- **Role-based Access Control**: Different dashboards and permissions per user type

### 🛠️ **Service Provider Features**
- **Complete Service Management**: CRUD operations for services with image uploads
- **Availability Scheduling**: Flexible time slot management with 12-hour format
- **Dashboard Analytics**: Service performance, booking stats, and review metrics
- **Provider Verification**: Professional account management

### 🛍️ **Customer Experience**
- **Service Discovery**: Browse services by category with advanced filtering
- **Review System**: Comprehensive rating and feedback mechanism
- **Booking History**: Complete transaction and booking management

- **Live Availability Updates**: Instant booking confirmation

### 📊 **Advanced Analytics**
- **Service Performance Metrics**: Provider dashboard with booking stats
- **Customer Feedback Analysis**: Review aggregation and insights
- **Availability Optimization**: Smart scheduling recommendations

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and **npm** 8+
- **MongoDB Atlas** account (or local MongoDB setup)
- **Git** for version control

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SayedAliMajed/pearlconnect-frontend.git
   cd pearlconnect-frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Setup backend**
   ```bash
   cd ../pearlconnect-back-end
   npm install
   ```

4. **Environment Configuration**
   ```bash
   # Create .env file in backend root
   cp .env.example .env
   ```

   Configure your MongoDB connection and JWT secret in `.env`:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   PORT=3000
   ```

5. **Start Development Servers**

   **Terminal 1 - Backend:**
   ```bash
   cd pearlconnect-back-end
   npm start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd pearlconnect-frontend
   npm run dev
   ```

6. **Access the Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000

## 🎯 Getting Started

### 🚀 **Live Application**
- **Production Site**: [PearlConnect Live](https://pearlconnect.netlify.app) *(When deployed)*
- **Backend API**: [PearlConnect API](https://api.pearlconnect.com) *(When deployed)*
- **Planning Materials**: [Trello Board](https://trello.com/b/your-project-board) *(If available)*
- **Backend Repository**: [PearlConnect Backend](https://github.com/SayedAliMajed/pearlconnect-back-end)

### Test User Accounts

Use these accounts for testing the application:

**Customer Account:**
- Username: `hussain`
- Password: `123456`

**Provider Account:**
- Username: `Ali`
- Password: `123456`

### Quick Feature Overview
1. **Sign Up/In** → Create account or login
2. **Browse Services** → Discover providers and their offerings
3. **Book Services** → Select time slots from provider availability
4. **Provider Dashboard** → Manage services, availability, and bookings
5. **Leave Reviews** → Rate and review completed services



## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18.2.0, Vite, React Router, Axios
- **Backend**: Node.js 20.19.3, Express.js
- **Database**: MongoDB Atlas (with Mongoose ODM)
- **Authentication**: JWT tokens with bcrypt hashing

### Project Structure
```
pearlconnect/
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── contexts/    # React Context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Main application pages
│   │   ├── services/    # API service layer
│   │   └── utils/       # Utility functions
│   └── package.json
├── backend/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & validation middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API route definitions
│   └── package.json
└── README.md
```

## 📋 API Documentation

### Authentication Endpoints
- `POST /auth/sign-in` - User login
- `POST /auth/sign-up` - User registration
- `GET /auth/refresh-token` - Token refresh

### Service Endpoints
- `GET /services` - Get all services with filtering
- `POST /services` - Create new service (provider only)
- `GET /services/:id` - Get specific service
- `PUT /services/:id` - Update service (owner only)
- `DELETE /services/:id` - Delete service (owner only)

### Booking System
- `GET /bookings` - Get user bookings
- `POST /bookings` - Create new booking
- `GET /availability/provider/:providerId` - Get provider availability
- `POST /availability` - Set provider availability slots

### Review System
- `GET /reviews` - Get filtered reviews (serviceId/providerId)
- `POST /reviews` - Create new review (customer only)
- `GET /reviews/provider-reviews` - Provider review dashboard

## 🔧 Development Features

### Frontend Development
- **Hot Module Replacement**: Instant updates during development
- **TypeScript Support**: Optional type checking
- **CSS Modules**: Scoped styling
- **Responsive Design**: Mobile-first approach

### Backend Development
- **Nodemon**: Automatic server restarts
- **Environment-Specific Config**: Development, staging, production
- **Error Handling**: Comprehensive logging and error management
- **API Rate Limiting**: Protection against abuse

## 🧪 Testing

### Manual Testing Checklists

#### Authentication Testing
- [ ] User registration with all required fields
- [ ] Login with valid credentials
- [ ] Role-based access control
- [ ] Password hashing security
- [ ] JWT token validation

#### Service Provider Testing
- [ ] Service creation with image upload
- [ ] Availability slot configuration
- [ ] Booking management dashboard
- [ ] Review monitoring

#### Customer Testing
- [ ] Service browsing and filtering
- [ ] Booking creation and payment
- [ ] Review submission and rating
- [ ] Booking history tracking

### Automated Testing
```bash
# Run frontend tests
npm test

# Run backend tests
cd ../backend && npm test
```

## 🚀 Deployment

### Production Deployment Checklist
- [ ] Environment variables configured (MongoDB, JWT)
- [ ] SSL certificates installed
- [ ] Nginx configuration for reverse proxy
- [ ] Domain name and DNS setup
- [ ] CDN configuration for static assets
- [ ] Backup strategies implemented
- [ ] Monitoring and logging setup

### Docker Deployment (Optional)
```bash
docker build -t pearlconnect .
docker run -p 3000:3000 pearlconnect
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- **Code Style**: Follow ESLint and Prettier configurations
- **Commits**: Use conventional commit messages
- **Testing**: Write tests for new features
- **Documentation**: Update README and code comments
- **Security**: Follow security best practices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Lead**: Sayed Ali Majed
- **Fullstack Development**: Sayed Ali Majed
- **UI/UX Design**: Sayed Ali Majed
- **Testing & QA**: Sayed Ali Majed

## 🙏 Acknowledgments

- **React**: For the excellent frontend framework
- **Express.js**: For the robust backend framework
- **MongoDB**: For the flexible NoSQL database
- **Vite**: For the lightning-fast build tool

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/SayedAliMajed/pearlconnect-frontend/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SayedAliMajed/pearlconnect-frontend/discussions)
- **Email**: contact@pearlconnect.com

## 🔄 Release History

### Version 1.0.0 (Current)
- Complete MVP with all core features
- Service booking system
- Review and rating system
- Provider dashboard
- Customer management

### Future Roadmap
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Payment system integration
- [ ] Multi-language support
- [ ] Advanced search and filtering
- [ ] Service categories expansion

---

**PearlConnect** - Connecting customers with exceptional service providers, one booking at a time.

*Built with ❤️ for the service industry*
