# CrowdCare – AI Assisted Crowd Safety & Missing Person Management Platform

## Project Overview

CrowdCare is a comprehensive platform designed to improve event safety and streamline missing person management during large community gatherings. It connects event attendees, volunteers, committees, and administrators in one unified workflow.

### Problem Being Solved

During crowded events like festivals, fairs, and religious gatherings, locating missing individuals and coordinating response teams can be chaotic and inefficient. CrowdCare addresses this by:

- Centralizing missing and found report management
- Streamlining SOS emergency alerts
- Providing verified committee oversight
- Organizing volunteer coordination
- Facilitating safe reunification workflows
- Offering event-based safety tracking

## Features

### User Module

- **Authentication**: Login, Register, and password recovery
- **Dashboard**: Event selection and quick access to core features
- **Missing Reports**: Create, view, and manage missing person reports with photos and details
- **Found Reports**: Create, view, and manage found person reports
- **Family Members**: Track and manage family members attending the same event
- **SOS Requests**: Submit urgent emergency requests with location context
- **Notifications**: In-app notifications for updates on reports, matches, and reunification
- **Reunification Tracking**: View status of ongoing cases and reunification processes
- **Event Map**: Interactive map showing event zones, safety points, and SOS alerts

### Committee Module

- **Dashboard**: Overview of reports, matches, and SOS requests for the assigned event
- **Match Center**: Compare verified missing and found reports, generate match scores
- **Candidate Matching**: Compare reports and evaluate potential matches
- **Match Approval**: Review and approve/reject candidate matches
- **Reunification Preparation**: Prepare reunification tickets and details
- **Notifications**: In-app notifications for new reports and SOS requests
- **Event Map**: Interactive map for coordinating responses

### Admin Module

- **User Management**: View, manage, and verify platform users
- **Committee Management**: Create, verify, and assign committees to events
- **Event Management**: Create and manage events with committee assignments
- **Event Assignment**: Link users and committees to specific events
- **Map Location Management**: Create, edit, and delete event safety points (help desks, SOS, medical)
- **Analytics**: View platform usage metrics and statistics

### AI Features

- **AI Face Matching (Phase 10 Implemented)**:
  - Face descriptor generation from uploaded report photos
  - Face similarity calculation using Euclidean distance
  - Auto-match suggestions for top candidate pairs
  - Face similarity display in Match Center

## Technology Stack

### Frontend

- React 18.3.1
- Vite 6.0.5
- React Router DOM 7.1.1
- Tailwind CSS 3.4.17
- React Leaflet 4.2.1 / Leaflet 1.9.4
- face-api.js 0.22.2
- Lucide React (icons)
- Recharts (analytics)
- Class Variance Authority
- Clsx & Tailwind Merge (styling utilities)

### Backend

- Node.js
- Express 5.2.1
- Mongoose 8.24.0
- MongoDB Atlas
- Cloudinary (file storage)
- JWT (Authentication)
- Bcrypt (password hashing)
- Multer / multer-storage-cloudinary (upload handling)
- CORS

### Database Models

- User
- Event
- FamilyMember
- MissingReport
- FoundReport
- SOSRequest
- Match
- Notification
- EventLocation

## Project Structure

```
crowdcare/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── committeeController.js
│   │   ├── eventController.js
│   │   ├── eventLocationController.js
│   │   ├── familyMemberController.js
│   │   ├── foundReportController.js
│   │   ├── healthController.js
│   │   ├── missingReportController.js
│   │   ├── notificationController.js
│   │   ├── reunificationController.js
│   │   └── sosRequestController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── eventValidationMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── Event.js
│   │   ├── EventLocation.js
│   │   ├── FamilyMember.js
│   │   ├── FoundReport.js
│   │   ├── Match.js
│   │   ├── MissingReport.js
│   │   ├── Notification.js
│   │   ├── SOSRequest.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── committeeRoutes.js
│   │   ├── eventLocationRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── familyMemberRoutes.js
│   │   ├── foundReportRoutes.js
│   │   ├── healthRoutes.js
│   │   ├── missingReportRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── reunificationRoutes.js
│   │   └── sosRequestRoutes.js
│   ├── tests/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── select.jsx
│   │   │   │   └── textarea.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── CommitteeLayout.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── EventCard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   ├── faceUtils.js
│   │   │   └── utils.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── CommitteeDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)

### Missing Reports

- `GET /api/missing-reports` - Get missing reports
- `POST /api/missing-reports` - Create missing report
- `PUT /api/missing-reports/:id` - Update missing report
- `GET /api/missing-reports/:id` - Get missing report details

### Found Reports

- `GET /api/found-reports` - Get found reports
- `POST /api/found-reports` - Create found report
- `PUT /api/found-reports/:id` - Update found report
- `GET /api/found-reports/:id` - Get found report details

### Family Members

- `GET /api/family-members` - Get user's family members
- `POST /api/family-members` - Add family member
- `PUT /api/family-members/:id` - Update family member
- `DELETE /api/family-members/:id` - Delete family member

### SOS Requests

- `GET /api/sos-requests` - Get SOS requests
- `POST /api/sos-requests` - Create SOS request
- `PUT /api/sos-requests/:id` - Update SOS request

### Committee

- `GET /api/committee/missing-reports` - Get missing reports for committee
- `GET /api/committee/found-reports` - Get found reports for committee
- `POST /api/committee/matches` - Create a candidate match
- `GET /api/committee/matches` - Get matches for committee
- `PUT /api/committee/matches/:id` - Update match (approve/reject)
- `PATCH /api/committee/matches/:id/prepare-reunification` - Prepare reunification
- `PUT /api/committee/sos-requests/:id` - Update SOS status

### Admin

- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/committees` - Get all committees
- `POST /api/admin/committees` - Create committee
- `PUT /api/admin/committees/:id` - Update committee
- `GET /api/admin/map-locations` - Get all map locations
- `POST /api/admin/map-locations` - Create map location
- `PATCH /api/admin/map-locations/:id` - Update map location
- `DELETE /api/admin/map-locations/:id` - Delete map location

### Map

- `GET /api/map/locations/:eventId` - Get map locations for an event

### Reunification

- `GET /api/reunification/:eventId` - Get reunification tickets

### Notifications

- `GET /api/notifications` - Get user's notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read

### Health

- `GET /api/health` - Health check endpoint

## Environment Variables

### Backend (backend/.env)

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (frontend/.env)

```
VITE_API_URL=http://localhost:5000/api
```

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd crowdcare
   ```

2. Set up backend:

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env file with your credentials
   ```

3. Set up frontend:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env file if needed
   ```

## Running Locally

- **Backend**:
  ```bash
  cd backend
  npm run dev
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm run dev
  ```
- **Build Frontend**:
  ```bash
  cd frontend
  npm run build
  ```

## Deployment

### Deploying to Vercel (Frontend)

- Root Directory: `frontend`
- Framework Preset: Vite
- Environment Variables in Vercel Dashboard: `VITE_API_URL` pointing to your backend API

### Deploying to Render (Backend)

- Root Directory: `backend`
- Environment: Node
- Build Command: (Not needed for Node.js)
- Start Command: `npm start`
- Environment Variables in Render Dashboard: All from backend/.env.example

## Current Project Status

Completed phases:

1. User/Admin/Committee Authentication
2. Missing & Found Report Management
3. Match Center & Candidate Matching
4. Reunification Workflow
5. Event-Based Maps & Safety Locations
6. In-App Notifications
7. AI Face Matching (Phase 10)

## Future Roadmap

- Advanced Committee Map Features
- Real-time Location Updates
- Enhanced Mobile Optimization
- Additional Analytics & Reporting
- Video Verification for Reports

## Contributors

- Project Team (Placeholder)
