# My Personal Website Backend

## Project Description

This is the backend service for my personal website. The project is designed to manage and deliver data for various sections of the website like testimonials, contact forms, certificates, degrees, employment history, and projects. The backend is built using Node.js and utilizes MongoDB as its database. It is set up for different environments (development and production) and is easily deployable via a Procfile for platforms like Heroku.

This backend is essential for the full functionality of the frontend part of the website, which can be found [here](https://github.com/MinhMaxx/personal_website_frontend).

## Directory Structure

.
├── Procfile # Heroku Procfile
├── README.md # Documentation
├── config # Configuration files
│ ├── develop.json # Development configuration
│ └── production.json # Production configuration
├── package-lock.json # Package lock file
├── package.json # Package information and dependencies
└── src # Source code
├── databaseMongo.js # MongoDB database connection
├── helpers # Helper modules
│ ├── authMiddleware.js # Authentication middleware
│ └── configHelper.js # Configuration helper
├── models # Database models
│ ├── blackListedToken.js # Blacklisted token model for admin logout control
│ ├── certificate.js # Certificate model
│ ├── degree.js # Degree model
│ ├── employmentHistory.js # Employment history model
│ ├── project.js # Project model
│ ├── testimonial.js # Testimonial model
│ └── testimonialToken.js # Testimonial verify token model
├── routes # API routes
│ ├── adminRoutes.js # Admin routes
│ ├── certificateRoutes.js # Certificate routes
│ ├── contactRoutes.js # Contact routes
│ ├── degreeRoutes.js # Degree routes
│ ├── employmentHistoryRoutes.js # Employment history routes
│ ├── projectRoutes.js # Project routes
│ └── testimonialRoutes.js # Testimonial routes
└── server.js # Server configuration

## How To Run The Project

### Prerequisites

- Node.js and npm installed
- MongoDB instance accessible

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MinhMaxx/personal_website_backend.git
   ```

2. **Navigate into the project directory:**

   ```bash
   cd personal_website_backend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up Configuration Files:**

   - Rename `develop.json.example` and `production.json.example` to `develop.json` and `production.json`, respectively, in the `config` folder.
   - Fill out the required configuration fields like MongoDB URI, JWT Secret, etc.

5. **Run the Project:**

   To run in development mode:

   ```bash
   npm run dev
   ```

6. **Verify:**

   The server should be running and accessible at `http://localhost:PORT/` where `PORT` is the port you've specified in your configuration file.
