# Chinese Folk Orchestra Hub Project Plan

## Project Title

Chinese Folk Orchestra Hub  
民乐团宣传与团内成员管理系统

## Project Category / Type

Dynamic web programming final project: public promotional website plus internal role-based management system.

## Brief Project Description

Chinese Folk Orchestra Hub is a full-stack website for a Chinese Folk Orchestra club. Public visitors can learn about the orchestra, browse demo member showcase profiles, view events, and submit an online application/interview request. Logged-in members can view internal announcements, events, and their own linked profile. Admin users can manage member profiles, applications, announcements, events, and external resource declarations.

## Selected Technologies

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Material UI / MUI, MUI X DataGrid |
| Backend | Node.js, Express |
| Database | SQLite |
| Authentication | JWT |
| Password Security | bcryptjs password hashing |
| API Style | REST API |
| Development OS | Windows local development |

## Main Features

| Feature | Description |
| --- | --- |
| Public homepage | Introduces the orchestra with hero content, cultural visual style, and calls to action. |
| About page | Explains background, mission, instrument sections, and rehearsal/performance culture. |
| Member showcase | Displays demo member cards with search, filters, tags, and member detail pages. |
| Online application | Saves applicant information to SQLite with `Pending` status. |
| Events page | Shows performances, rehearsals, recruitment interviews, and activities. |
| Login system | Supports admin/member role-based access with JWT authentication. |
| Admin dashboard | Shows overview cards and management pages for members, applications, announcements, events, and resources. |
| Member dashboard | Shows internal announcements, events, and linked profile information. |
| Resource declaration | Lists templates, libraries, AI assistance, generated assets, and demo data notes. |

## Role Distribution

| Nominal Role | Responsibility |
| --- | --- |
| Student 1: Project Manager / Requirement Designer | Defines scope, user groups, feature list, page requirements, and project acceptance criteria. |
| Student 2: Frontend Designer | Designs the MUI-based public site, member showcase, forms, responsive layout, and dashboard interface. |
| Student 3: Backend Developer | Builds Express API routes, JWT authentication, role protection, validation, and server error handling. |
| Student 4: Database Designer / Tester / Documentation | Designs SQLite schema, seed data, QA workflow, README, resource declaration, and project plan. |

## Week-by-Week Development Plan

| Week | Planned Work |
| --- | --- |
| Week 1 | Confirm requirements, user groups, pages, entities, and project structure. Inspect the local MUI template and select reusable layout patterns. |
| Week 2 | Create SQLite schema, Express server, authentication middleware, seed data, and REST endpoints. |
| Week 3 | Build public React/MUI pages: home, about, member showcase, detail page, events, join form, login, and resources. |
| Week 4 | Build role-based dashboard pages for admin and member users, including CRUD tables and dialogs. |
| Week 5 | Connect frontend to backend APIs, add validation, loading states, error states, and empty states. |
| Week 6 | Run QA flows, fix runtime/build issues, write README and project plan, and prepare final submission. |

## Expected Deliverables

| Deliverable | Description |
| --- | --- |
| Runnable full-stack app | React frontend and Express backend started with `npm run dev`. |
| SQLite database | Local database with users, members, applications, announcements, events, and resources. |
| Seed data | Admin/member accounts, demo member profiles, announcements, events, and resources. |
| Documentation | README with install/run/test instructions and PROJECT_PLAN for school submission. |
| QA evidence | Main flows tested: public browsing, application submission, admin login, admin management, member login. |

## External Resources Table

| Resource | Source | Use | Modification |
| --- | --- | --- | --- |
| AI coding assistant | Codex Desktop | Coding, QA support, documentation drafting | Reviewed and integrated into a local runnable project. |
| Frontend template | Local Material UI templates in `D:\cps3500project\mui` | Theme, marketing page, sign-in, dashboard, CRUD table patterns | Adapted into the orchestra website and dashboard. |
| UI framework | MUI / Material UI | Components, icons, cards, tables, forms, dialogs, responsive layout | Customized with deep red, gold, cream, and ink palette. |
| Backend libraries | Express, better-sqlite3, bcryptjs, jsonwebtoken, cors, helmet | REST API, database, auth, password hashing, local security headers | Configured for local development and role-based access. |
| Demo data/images | Local generated placeholders | Member demo profiles and hero image | Clearly marked as demo placeholder data only. |

## Academic Integrity Declaration

This project uses AI coding assistance, a local Material UI template, open-source libraries, and generated placeholder assets. All demo member profiles are marked as placeholder data only and do not represent real orchestra members. The project does not claim that any public performer, celebrity, or unrelated person belongs to the orchestra. External resources and assistance are documented in the README and the Resources page of the application.
