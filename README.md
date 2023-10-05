# My Personal Website Backend

## Project Description

This is the backend service for my personal website. The project is designed to manage and deliver data for various sections of the website like testimonials, contact forms, certificates, degrees, employment history, and projects. The backend is built using Node.js and utilizes MongoDB as its database. It is set up for different environments (development and production) and is easily deployable via a Procfile for platforms like Heroku.

This backend is essential for the full functionality of the frontend part of the website, which can be found [here](https://github.com/MinhMaxx/personal_website_frontend).

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

   - Fill out the required configuration fields in `develop.json` or `production.json` inside the `config` folder like MongoDB URI, JWT Secret, etc.

5. **Run the Project:**

   To run in development mode:

   ```bash
   npm run dev
   ```

6. **Verify:**

   The server should be running and accessible at `http://localhost:PORT/` where `PORT` is the port you've specified in your configuration file.
