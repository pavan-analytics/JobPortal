# Job Portal

A full-stack Job Portal application built with React, Django REST Framework, MySQL, and JWT authentication.

## Features

### Candidate
- Register and login
- Browse and search jobs
- View job details
- Apply for jobs
- Track applications
- Manage profile

### Recruiter
- Register and login
- Post jobs
- Edit and delete jobs
- Manage job postings
- View applicants
- Update application status

## Tech Stack

- React
- JavaScript
- Django
- Django REST Framework
- MySQL 8.4
- JWT
- Axios
- Postman
- Git
- GitHub

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
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://127.0.0.1:8000`

## Production

Run the Django backend with Gunicorn:

```bash
gunicorn config.wsgi:application
```

## Database

MySQL 8.4

Create `backend/.env`:

```env
MYSQL_DATABASE=jobportal_db
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3307
```

Never commit `.env` to GitHub.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register/` | Register user |
| POST | `/api/token/` | Login |
| POST | `/api/token/refresh/` | Refresh JWT |
| GET | `/api/me/` | Current user |
| GET | `/api/jobs/` | List jobs |
| POST | `/api/jobs/` | Create job |
| GET | `/api/jobs/<id>/` | Job details |
| PUT | `/api/jobs/<id>/` | Update job |
| DELETE | `/api/jobs/<id>/` | Delete job |
| GET | `/api/my-jobs/` | Recruiter's jobs |
| GET | `/api/profile/` | Candidate profile |
| PUT | `/api/profile/` | Update profile |
| GET | `/api/applications/` | Candidate applications |
| POST | `/api/applications/` | Apply for job |
| GET | `/api/recruiter-applications/` | Recruiter applicants |
| PUT | `/api/applications/<id>/` | Update application status |

## Authentication

The application uses JWT authentication with:

- Access tokens
- Refresh tokens
- Automatic token refresh
- Protected routes
- Role-based permissions

## Application Status

- Applied
- Under Review
- Shortlisted
- Rejected
- Selected

## Author

**Pavan Kalyan Musham**

Python | SQL | React | Django | MySQL | Data Analytics
