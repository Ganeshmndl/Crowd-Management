<div align="center">

# Yatra Saarthi

### Keeping crowds connected and families reunited.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Yatra%20Saarthi-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white)](https://crowd-management-tawny.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)

**Frontend**

![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0.5-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06b6d4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![face-api.js](https://img.shields.io/badge/face--api.js-0.22.2-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=for-the-badge&logo=leaflet&logoColor=white)

**Backend & Services**

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.24.0-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Images-3448c5?style=for-the-badge&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46e3b7?style=for-the-badge&logo=render&logoColor=111111)

</div>

## Contents

- [About](#about)
- [Architecture](#architecture)
- [Features](#features)
- [Status](#status)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [API Summary](#api-summary)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributors](#contributors)

## About

Yatra Saarthi is an event safety and missing-person coordination platform for
families, volunteers, committees, and administrators. It brings reporting,
verified response, maps, notifications, and reunification into one event-based
workflow.

## Architecture

```mermaid
flowchart LR
    U[User] --> SPA[React SPA]
    C[Committee] --> SPA
    A[Admin] --> SPA
    SPA --> API[Express REST API]
    API --> DB[(MongoDB Atlas)]
    API --> IMG[(Cloudinary)]
```

## Features

### User

- 🔐 Register, sign in, recover accounts, and select an event.
- 📝 Create and track missing-person and found-person reports.
- 🆘 Submit SOS requests, manage family members, and receive notifications.
- 🗺️ View event safety locations and reunification progress.

### Committee

- 📊 Monitor reports, matches, SOS requests, and event activity.
- 🔎 Review candidates, approve matches, and prepare reunification tickets.
- 🗺️ Coordinate responders through event maps and verified updates.

### Admin

- 👥 Manage users, committees, events, and event assignments.
- 📍 Maintain safety locations and review platform analytics.

### AI Face Matching

- 🤖 Generate client-side face descriptors and calculate similarity scores.
- ✅ Surface top candidate pairs in the Match Center.

## Status

- ✅ Authentication and role-based access
- ✅ Missing and found reports
- ✅ Match Center and candidate matching
- ✅ Reunification workflow
- ✅ Event maps and safety locations
- ✅ Notifications
- ✅ AI face matching

## Tech Stack

| Layer     | Technology                                             |
| --------- | ------------------------------------------------------ |
| Frontend  | React, Vite, Tailwind CSS, React Router, React Leaflet |
| AI and UI | face-api.js, Lucide React, Recharts                    |
| Backend   | Node.js, Express, Mongoose                             |
| Services  | MongoDB Atlas, Cloudinary, JWT                         |

## Quick Start

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# In another terminal

cd frontend
npm install
cp .env.example .env
npm run dev
```

Set credentials in `backend/.env.example` copied to `backend/.env`. The key
values are `MONGODB_URI`, `JWT_SECRET`, and the Cloudinary credentials; set
`VITE_API_URL` in `frontend/.env` when the API is not using its local default.

Build the frontend with `cd frontend` followed by `npm run build`.

## API Summary

| Group           | Methods | Purpose                                         |
| --------------- | ------: | ----------------------------------------------- |
| Auth            |       4 | Registration, login, and password recovery      |
| Events          |       4 | Event listing and administration                |
| Missing Reports |       4 | Missing-person report lifecycle                 |
| Found Reports   |       4 | Found-person report lifecycle                   |
| Family Members  |       4 | Manage a user's event family members            |
| SOS             |       3 | Submit and update emergency requests            |
| Committee       |       7 | Review reports, matches, SOS, and reunification |
| Admin           |       9 | Manage users, committees, and map locations     |
| Map             |       1 | Retrieve event map locations                    |
| Reunification   |       1 | Retrieve reunification tickets                  |
| Notifications   |       2 | List and mark notifications read                |
| Health          |       1 | Service health check                            |

See the [complete API reference](docs/API.md) for every method, path, and description.

## Screenshots

<p align="center"><img src="docs/screenshots/user-dashboard.png" width="800" alt="User dashboard"></p>

<p align="center"><img src="docs/screenshots/match-center.png" width="800" alt="Match center"></p>

<p align="center"><img src="docs/screenshots/admin-dashboard.png" width="800" alt="Admin dashboard"></p>

Drop your screenshots in `docs/screenshots/`.

## Deployment

- Deploy `frontend/` to Vercel with the Vite framework preset.
- Set `VITE_API_URL` in Vercel to the deployed backend API URL.
- Deploy `backend/` to Render as a Node service.
- Use `npm start` as the Render start command and configure the backend environment variables.

## Roadmap

- Expand multilingual support for event communities.
- Extend location-aware coordination and reporting workflows.
- Add more operational analytics and response insights.

## Contributors

**Group CSE-B 03**

Member names: _to be added_.
