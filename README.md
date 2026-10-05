# Job Portal — Full-Stack Application

A full-stack Job Portal built with **Python, Django REST Framework, React, MySQL, and JWT authentication**. Supports Candidate and Recruiter roles with job management, applications, profiles, and application status tracking.

## Live Demo

- **Frontend:** https://job-portal-ochre-zeta.vercel.app/
- **Backend API:** https://jobportal-production-32f0.up.railway.app/api/

## Features

- Candidate and Recruiter registration/login
- JWT authentication and role-based authorization
- Browse and view jobs
- Recruiter job CRUD operations
- Candidate job applications
- Duplicate application prevention
- Candidate profile management
- Recruiter applicant management
- Application status updates
- Protected frontend routes
- REST API integration with Axios

## Tech Stack

- **Frontend:** React, JavaScript, React Router, Axios, Vite
- **Backend:** Python, Django, Django REST Framework, SimpleJWT
- **Database:** MySQL
- **Testing:** Postman
- **Version Control:** Git, GitHub
- **Deployment:** Railway, Gunicorn, Vercel

## Project Structure

```text
JobPortal/
├── backend/
│   ├── config/
│   ├── jobportal/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/pavan-analytics/JobPortal.git
cd JobPortal
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
MYSQL_DATABASE=jobportal_db
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3307
```

Create the MySQL database:

```sql
CREATE DATABASE jobportal_db;
```

Run migrations and start Django:

```bash
python manage.py migrate
python manage.py runserver
```

Backend runs at:

`http://127.0.0.1:8000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd JobPortal/frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Start React:

```bash
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## Authentication

JWT authentication is implemented using Django REST Framework SimpleJWT with:

- Access tokens
- Refresh tokens
- Protected routes
- Role-based authorization

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/register/` | POST | Register user |
| `/api/token/` | POST | Login |
| `/api/token/refresh/` | POST | Refresh JWT |
| `/api/me/` | GET | Current user |
| `/api/jobs/` | GET, POST | List/create jobs |
| `/api/jobs/<id>/` | GET, PUT, DELETE | Job management |
| `/api/my-jobs/` | GET | Recruiter's jobs |
| `/api/profile/` | GET, PUT | Candidate profile |
| `/api/applications/` | GET, POST | Candidate applications |
| `/api/recruiter-applications/` | GET | Recruiter applicants |
| `/api/applications/<id>/` | PUT | Update application status |

## Production Deployment

- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Railway MySQL
- **Server:** Gunicorn
- **API:** Django REST Framework

Production backend command:

```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

Production frontend API URL:

```env
VITE_API_URL=https://jobportal-production-32f0.up.railway.app/api
```

## Testing

The application was tested using **Postman** and the live production environment.

Tested workflows:

- Candidate registration and login
- Recruiter registration and login
- JWT authentication
- Role-based authorization
- Job CRUD operations
- Job applications
- Duplicate application prevention
- Candidate profile management
- Recruiter applicant management
- Application status updates
- End-to-end production workflow

## Author

**Pavan Kalyan Musham**

- LinkedIn: https://www.linkedin.com/in/pavanmusham/
