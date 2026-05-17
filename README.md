# Chinese Folk Orchestra Hub

**Chinese display name:** 民乐团宣传与团内成员管理系统

Chinese Folk Orchestra Hub is a full-stack dynamic web programming final project. It works as both a public promotional website for a Chinese Folk Orchestra club and an internal role-based dashboard for members and administrators.

## Tech Stack

- Frontend: React, Vite, Material UI / MUI, MUI X DataGrid
- Backend: Node.js, Express
- Database: SQLite with `better-sqlite3`
- Authentication: JWT
- Password hashing: bcryptjs
- Development environment: Windows local development

## Features

- Public home page with generated Chinese folk orchestra hero image and calls to action
- About page describing mission, instruments, rehearsal culture, and public announcements
- Member showcase with search, instrument/section filtering, profile cards, and detail pages
- Join Us application form saved to SQLite with default `Pending` status
- Public and member-visible event listing
- JWT login for admin/member users
- Admin dashboard overview cards
- Admin CRUD management for members, applications, announcements, events, and resource declarations
- Member dashboard with announcements, events, and linked profile view
- External resources page for academic integrity and demo data disclosure

## Folder Structure

```text
D:\cps3500project
  package.json
  README.md
  PROJECT_PLAN.md
  .env.example
  server\
    package.json
    .env.example
    src\
      index.js
      db\
      middleware\
      routes\
    scripts\
      seed.js
    data\
      orchestra.sqlite
  mui\
    package.json
    .env.example
    vite.config.js
    src\
      api\
      auth\
      components\
      pages\
      theme\
      utils\
    public\
      assets\
        orchestra-hero.png
    existing Material UI template folders...
```

## Install

From the project root:

```powershell
npm run install:all
```

## Database Setup and Seed

The server automatically creates and seeds the SQLite database if it is missing. To reset and reseed:

```powershell
npm run seed
```

The database file is created at:

```text
D:\cps3500project\server\data\orchestra.sqlite
```

## Run the App

Start frontend and backend together:

```powershell
npm run dev
```

Or run them separately:

```powershell
npm run dev --prefix server
npm run dev --prefix mui
```

Local URLs:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api
- Health check: http://localhost:4000/api/health

## Build

```powershell
npm run build
```

The current build passes. Vite may show a bundle-size warning because MUI and DataGrid are bundled together; this does not stop the build.

## Test Login Credentials

Admin:

```text
username: admin
password: admin123
```

Member:

```text
username: member
password: member123
```

Passwords are stored as bcrypt hashes in SQLite, not plaintext.

## API Overview

Auth:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Members:

- `GET /api/members`
- `GET /api/members/:id`
- `POST /api/members` admin only
- `PUT /api/members/:id` admin only
- `DELETE /api/members/:id` admin only

Applications:

- `POST /api/applications`
- `GET /api/applications` admin only
- `GET /api/applications/:id` admin only
- `PUT /api/applications/:id/status` admin only
- `DELETE /api/applications/:id` admin only

Announcements:

- `GET /api/announcements`
- `POST /api/announcements` admin only
- `PUT /api/announcements/:id` admin only
- `DELETE /api/announcements/:id` admin only

Events:

- `GET /api/events`
- `POST /api/events` admin only
- `PUT /api/events/:id` admin only
- `DELETE /api/events/:id` admin only

Resources:

- `GET /api/resources`
- `POST /api/resources` admin only

## Demo Placeholder Data

Real orchestra member information is not available. The seeded member profiles are local demo placeholders only and are clearly marked in the UI as:

```text
Demo placeholder data only, not actual orchestra members.
```

The project does not claim that any public celebrity or real performer belongs to the orchestra. Member avatars use local generated initials/gradient placeholders unless an admin adds a real image URL.

The seed also includes one sample join application so the admin dashboard has a pending application immediately after setup.

## AI, Template, and External Resource Notes

- AI coding assistant: Codex Desktop
- Frontend template: local Material UI templates from `D:\cps3500project\mui`
- Template parts adapted: shared theme approach, marketing app bar, dashboard shell, CRUD/DataGrid management style, sign-in layout
- UI framework: MUI / Material UI
- Backend libraries: Express, SQLite, bcryptjs, jsonwebtoken, cors, helmet
- Demo image: locally generated hero image saved as `mui\public\assets\orchestra-hero.png`
- Demo data: local placeholder data created for layout and workflow testing

## Troubleshooting

- If port `4000` is already in use, set `PORT` in `server\.env`.
- If port `5173` is already in use, Vite will show another available port.
- If login fails after changing the database, run `npm run seed`.
- If the frontend cannot reach the API, check `VITE_API_URL` in `mui\.env` and `CLIENT_ORIGIN` in `server\.env`.
- If SQLite install fails on a new machine, confirm Node.js is installed and rerun `npm install --prefix server`.
