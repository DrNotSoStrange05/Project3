# LMS Learn

A complete, full-featured Learning Management System (LMS) with separate portals for Students and Instructors (Admins).

## Tech Stack
- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, Axios, React Router
- **Backend**: Node.js, Express, JWT Auth, bcryptjs, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (Frontend), Render (Backend)

## Features

### Student Module
- User Registration & Login (JWT)
- Browse & Search Courses (by title/category)
- Enroll in Courses
- Watch Video Lessons (HTML5 player)
- Track Course Progress (per-lesson checkmarks)
- View Enrolled Courses with progress bars
- Profile Management (name, email, avatar, password)

### Instructor / Admin Module
- Instructor/Admin Login
- Create, Edit, Delete Courses
- Add Modules & Lessons (title, video URL, duration, order)
- View Student Enrollments (table with progress)
- Dashboard with Analytics (total courses, students, revenue)

### Bonus
- Dark/Light Theme (AMOLED midnight black dark mode)

## Getting Started (Local Development)

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local instance or Atlas URI)

### Installation
```bash
npm run install-all
```

### Environment Variables

#### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/lms-learn
JWT_SECRET=your_jwt_secret
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Running Locally
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Deployment

### Backend (Render)
1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect the GitHub repo
3. **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. **Environment Variables**: `MONGODB_URI`, `JWT_SECRET`, `PORT`

### Frontend (Vercel)
1. Import the GitHub repo on [vercel.com](https://vercel.com)
2. **Root Directory**: `frontend`
3. **Framework Preset**: Vite
4. **Environment Variable**: `VITE_API_URL` = your Render backend URL + `/api`

## API Endpoints

| Method | Endpoint | Description | Access |
|:---|:---|:---|:---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| GET | `/api/courses` | Get all courses | Public |
| GET | `/api/courses/:id` | Get course details | Public |
| POST | `/api/courses` | Create course | Instructor |
| PUT | `/api/courses/:id` | Update course | Instructor |
| DELETE | `/api/courses/:id` | Delete course | Instructor |
| POST | `/api/lessons` | Add lesson | Instructor |
| PUT | `/api/lessons/:id` | Update lesson | Instructor |
| DELETE | `/api/lessons/:id` | Delete lesson | Instructor |
| POST | `/api/enrollments/enroll` | Enroll in course | Student |
| GET | `/api/enrollments/my-courses` | Get enrolled courses | Student |
| GET | `/api/enrollments/course/:id` | Get enrollment details | Student |
| PUT | `/api/progress` | Update lesson progress | Student |
| GET | `/api/enrollments/instructor/stats` | Instructor analytics | Instructor |

## Project Structure
```
project-3/
├── package.json                # Root monorepo scripts
├── README.md
├── backend/
│   ├── server.js               # Express entry point
│   ├── db.js                   # MongoDB connection
│   ├── middleware/auth.js      # JWT & admin middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Lesson.js
│   │   ├── Enrollment.js
│   │   └── Progress.js
│   └── routes/                 # API route handlers
│       ├── auth.js
│       ├── courses.js
│       ├── lessons.js
│       ├── enrollments.js
│       └── progress.js
└── frontend/
    ├── vercel.json             # SPA routing config
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── index.css           # Tailwind v4 + theme tokens
        ├── App.jsx             # Routing & auth guards
        ├── utils/api.js        # Axios client
        ├── context/AuthContext.jsx
        ├── components/Navbar.jsx
        └── pages/
            ├── Home.jsx
            ├── Auth.jsx
            ├── CourseDetails.jsx
            ├── StudentDashboard.jsx
            ├── InstructorDashboard.jsx
            ├── MyLearning.jsx
            └── Profile.jsx
```
