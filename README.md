# Hill Country International School - Complete Web Application

A modern, full-stack school showcase website with Angular frontend and Spring Boot backend, featuring an admin panel for content management.

## 🏗️ Project Structure

This is a monorepo containing both frontend and backend:

```
angular-project/
├── HIS/                    # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/     # Admin panel components
│   │   │   ├── features/  # Public website features
│   │   │   ├── layouts/   # Layout components
│   │   │   ├── core/      # Services, guards, interceptors
│   │   │   └── shared/    # Shared components
│   │   ├── assets/        # Images, fonts
│   │   └── environments/   # Environment configs
│   ├── package.json
│   ├── angular.json
│   └── tailwind.config.js
│
└── HIS-backend/            # Spring Boot Backend
    ├── src/main/java/com/his/hisbackend/
    │   ├── config/        # Security configuration
    │   ├── controller/    # REST API controllers
    │   ├── model/         # JPA entities
    │   ├── repository/    # Data repositories
    │   ├── security/      # JWT authentication
    │   └── service/       # Business logic
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

## 🚀 Tech Stack

### Frontend
- **Angular 21.2.0** - Modern Angular with standalone components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **RxJS** - Reactive programming
- **Angular Forms** - Reactive forms with validation

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database ORM
- **JWT** - Token-based authentication
- **PostgreSQL** - Neon cloud database
- **Maven** - Build management

## 📋 Features

### Public Website
- **Home Page** - Hero section with school overview
- **About Us** - School history, mission, and vision
- **Academics** - Programs and teaching approach
- **Admissions** - Online application form with requirements
- **News & Events** - Latest news and upcoming events
- **Gallery** - Photo gallery with categories
- **Downloads** - Downloadable resources and forms
- **FAQ** - Frequently asked questions
- **Contact** - Contact form and information

### Admin Panel
- **Dashboard** - Overview with statistics
- **News Management** - Create, edit, delete news articles
- **Announcements** - Manage school announcements
- **Gallery** - Upload and manage gallery images
- **School Info** - Update general school information
- **Facilities** - Manage school facilities
- **Downloads** - Manage downloadable files
- **Achievements** - Showcase school achievements
- **Contact Messages** - View and manage contact form submissions

### Backend API
- RESTful API endpoints for all features
- JWT-based authentication
- Role-based access control
- File upload support
- CORS configuration for frontend integration

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.6+
- PostgreSQL database (Neon recommended)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd HIS
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1'
};
```

4. Start development server:
```bash
ng serve
```

The frontend will be available at `http://localhost:4200`

### Backend Setup

1. Navigate to backend directory:
```bash
cd HIS-backend
```

2. Configure database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://your-neon-host/neondb?sslmode=require
spring.datasource.username=your_username
spring.datasource.password=your_password
jwt.secret=your-secret-key-here
```

3. Build and run:
```bash
mvn spring-boot:run
```

The backend API will be available at `http://localhost:8080`

### Initial Setup

1. Start the backend server
2. Register an admin user via the API or create directly in database
3. Login to admin panel at `http://localhost:4200/admin/login`
4. Start adding content through the admin panel

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional interface
- **Fully Responsive** - Works on all device sizes
- **Smooth Animations** - Enhanced user experience
- **Accessibility** - WCAG compliant
- **Fast Loading** - Optimized performance
- **SEO Friendly** - Meta tags and structured data

## 🔐 Security

- JWT token-based authentication
- Password encryption with BCrypt
- CORS configuration
- Role-based access control
- SQL injection prevention
- XSS protection

## 📦 Building for Production

### Frontend
```bash
cd HIS
ng build --configuration production
```
Build artifacts will be in `dist/HIS/`

### Backend
```bash
cd HIS-backend
mvn clean package -Pprod
```
JAR file will be in `target/`

## 🧪 Testing

### Frontend Tests
```bash
cd HIS
ng test
```

### Backend Tests
```bash
cd HIS-backend
mvn test
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register

### Public Endpoints
- `GET /api/v1/public/news` - Get published news
- `GET /api/v1/public/announcements` - Get announcements
- `GET /api/v1/public/gallery` - Get gallery
- `GET /api/v1/public/facilities` - Get facilities
- `GET /api/v1/public/downloads` - Get downloads
- `GET /api/v1/public/achievements` - Get achievements
- `POST /api/v1/public/contact` - Submit contact form

### Admin Endpoints (Requires Auth)
- `GET/POST/PUT/DELETE /api/v1/admin/news` - Manage news
- `GET/POST/PUT/DELETE /api/v1/admin/announcements` - Manage announcements
- `GET/POST/PUT/DELETE /api/v1/admin/gallery` - Manage gallery
- `GET/POST/PUT/DELETE /api/v1/admin/school-info` - Manage school info
- `GET/POST/PUT/DELETE /api/v1/admin/facilities` - Manage facilities
- `GET/POST/PUT/DELETE /api/v1/admin/downloads` - Manage downloads
- `GET/POST/PUT/DELETE /api/v1/admin/achievements` - Manage achievements
- `GET/PUT/DELETE /api/v1/admin/contact` - Manage contact messages

## 🌐 Deployment

### Frontend Deployment
1. Build the Angular app
2. Deploy `dist/HIS/` to any static hosting (Netlify, Vercel, AWS S3, etc.)
3. Update environment variables for production API URL

### Backend Deployment
1. Build the Spring Boot JAR
2. Deploy to any Java hosting (AWS, Heroku, DigitalOcean, etc.)
3. Configure environment variables for database and JWT secret

## 🤝 Contributing

This is a proprietary project for Hill Country International School. Contact the development team for access and contribution guidelines.

## 📄 License

Proprietary - Hill Country International School

## 👥 Development Team

- Frontend: Angular 21 with modern UI patterns
- Backend: Spring Boot 3 with RESTful architecture
- Database: PostgreSQL with JPA/Hibernate
- Design: Tailwind CSS with custom theming

## 📞 Support

For technical support, contact the development team or create an issue in the project repository.
