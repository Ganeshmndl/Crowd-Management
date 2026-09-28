# Yatra Saarthi API Reference

All routes are served under the backend API base URL. Protected routes require authentication; role restrictions are enforced by the API.

## Authentication

| Method | Path                        | Description            |
| ------ | --------------------------- | ---------------------- |
| `POST` | `/api/auth/register`        | Register new user      |
| `POST` | `/api/auth/login`           | Login user             |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password`  | Reset password         |

## Events

| Method | Path              | Description               |
| ------ | ----------------- | ------------------------- |
| `GET`  | `/api/events`     | Get all events            |
| `GET`  | `/api/events/:id` | Get event details         |
| `POST` | `/api/events`     | Create event (Admin only) |
| `PUT`  | `/api/events/:id` | Update event (Admin only) |

## Missing Reports

| Method | Path                       | Description                |
| ------ | -------------------------- | -------------------------- |
| `GET`  | `/api/missing-reports`     | Get missing reports        |
| `POST` | `/api/missing-reports`     | Create missing report      |
| `PUT`  | `/api/missing-reports/:id` | Update missing report      |
| `GET`  | `/api/missing-reports/:id` | Get missing report details |

## Found Reports

| Method | Path                     | Description              |
| ------ | ------------------------ | ------------------------ |
| `GET`  | `/api/found-reports`     | Get found reports        |
| `POST` | `/api/found-reports`     | Create found report      |
| `PUT`  | `/api/found-reports/:id` | Update found report      |
| `GET`  | `/api/found-reports/:id` | Get found report details |

## Family Members

| Method   | Path                      | Description               |
| -------- | ------------------------- | ------------------------- |
| `GET`    | `/api/family-members`     | Get user's family members |
| `POST`   | `/api/family-members`     | Add family member         |
| `PUT`    | `/api/family-members/:id` | Update family member      |
| `DELETE` | `/api/family-members/:id` | Delete family member      |

## SOS Requests

| Method | Path                    | Description        |
| ------ | ----------------------- | ------------------ |
| `GET`  | `/api/sos-requests`     | Get SOS requests   |
| `POST` | `/api/sos-requests`     | Create SOS request |
| `PUT`  | `/api/sos-requests/:id` | Update SOS request |

## Committee

| Method  | Path                                               | Description                       |
| ------- | -------------------------------------------------- | --------------------------------- |
| `GET`   | `/api/committee/missing-reports`                   | Get missing reports for committee |
| `GET`   | `/api/committee/found-reports`                     | Get found reports for committee   |
| `POST`  | `/api/committee/matches`                           | Create a candidate match          |
| `GET`   | `/api/committee/matches`                           | Get matches for committee         |
| `PUT`   | `/api/committee/matches/:id`                       | Update match (approve/reject)     |
| `PATCH` | `/api/committee/matches/:id/prepare-reunification` | Prepare reunification             |
| `PUT`   | `/api/committee/sos-requests/:id`                  | Update SOS status                 |

## Admin

| Method   | Path                           | Description           |
| -------- | ------------------------------ | --------------------- |
| `GET`    | `/api/admin/users`             | Get all users         |
| `PUT`    | `/api/admin/users/:id`         | Update user           |
| `GET`    | `/api/admin/committees`        | Get all committees    |
| `POST`   | `/api/admin/committees`        | Create committee      |
| `PUT`    | `/api/admin/committees/:id`    | Update committee      |
| `GET`    | `/api/admin/map-locations`     | Get all map locations |
| `POST`   | `/api/admin/map-locations`     | Create map location   |
| `PATCH`  | `/api/admin/map-locations/:id` | Update map location   |
| `DELETE` | `/api/admin/map-locations/:id` | Delete map location   |

## Map

| Method | Path                          | Description                    |
| ------ | ----------------------------- | ------------------------------ |
| `GET`  | `/api/map/locations/:eventId` | Get map locations for an event |

## Reunification

| Method | Path                          | Description               |
| ------ | ----------------------------- | ------------------------- |
| `GET`  | `/api/reunification/:eventId` | Get reunification tickets |

## Notifications

| Method  | Path                          | Description               |
| ------- | ----------------------------- | ------------------------- |
| `GET`   | `/api/notifications`          | Get user's notifications  |
| `PATCH` | `/api/notifications/:id/read` | Mark notification as read |

## Health

| Method | Path          | Description           |
| ------ | ------------- | --------------------- |
| `GET`  | `/api/health` | Health check endpoint |
