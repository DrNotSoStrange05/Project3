# LMS Learn

LMS Learn is a complete, full-featured Learning Management System (LMS) with separate portals/dashboards for Students and Instructors (Admins).

## Tech Stack
- **Frontend**: React, Tailwind CSS v4, Lucide Icons, Axios, React Router
- **Backend**: Node.js, Express, JWT, bcryptjs, Mongoose (MongoDB)
- **Database**: MongoDB (Local or Atlas)

## Getting Started

### Prerequisites
- **Node.js**: installed on your system.
- **MongoDB**: a local running MongoDB server instance (port `27017`) or an Atlas connection URI.

### Installation
1. Install dependencies across the root, frontend, and backend packages:
   ```bash
   npm run install-all
   ```

### Running Locally
1. Start both the backend API server and the frontend Vite development server concurrently:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`).
