# My Personal Website Backend

## Project Description

This is the backend service for my personal website. The project is designed to manage and deliver data for various sections of the website like testimonials, contact forms, certificates, degrees, employment history, and projects. The backend is built using Node.js and utilizes MongoDB as its database. It is set up for different environments (development and production) and is easily deployable via a Procfile for platforms like Heroku.

This backend is essential for the full functionality of the frontend part of the website, which can be found [here](https://github.com/MinhMaxx/personal-website-frontend).

## To-do
- Implement Winston for logging.
- Redesign .env - environment variables

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

## API Endpoints

### Admin Routes

- **`POST /admin/login`**

  - **Description:** Endpoint for admin login.
  - **Parameters:**
    - `username`: Admin's username.
    - `password`: Admin's password.
  - **Response:** Returns a JWT token for successful login or an error message if the credentials are incorrect.

- **`GET /admin`**

  - **Description:** Retrieve all admin settings.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Response:** Returns a list of all admin settings or an error message if unauthorized.

- **`POST /admin/logout`**
  - **Description:** Endpoint for admin logout.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Response:** Returns a success message for successful logout or an error in case of failure.

### Employment History Routes

- **`GET /employment`**

  - **Description:** Retrieve all employment histories.
  - **Response:** Returns an array of employment histories sorted by start date in descending order or an error message.

- **`GET /employment/:id`**

  - **Description:** Retrieve a specific employment history by its ID.
  - **Parameters:**
    - `id`: The ID of the employment history to retrieve.
  - **Response:** Returns the specific employment history or an error message if not found.

- **`POST /employment`**

  - **Description:** Add a new employment history entry.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `position`: The position held (String, required).
    - `company`: The company worked for (String, required).
    - `startDate`: The starting date of employment (Date, required).
    - `endDate`: The ending date of employment (Date, optional).
    - `description`: A description of the job role (String, required).
  - **Response:** Returns a success message for the addition or an error message if validation fails or server error occurs.

- **`PUT /employment/:id`**

  - **Description:** Update an existing employment history entry by ID.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the employment history to update.
    - `position`: Updated position held (String, required).
    - `company`: Updated company worked for (String, required).
    - `startDate`: Updated starting date of employment (Date, required).
    - `endDate`: Updated ending date of employment (Date, optional).
    - `description`: Updated job role description (String, required).
  - **Response:** Returns a success message for the update or an error message if not found, validation fails, or server error occurs.

- **`DELETE /employment/:id`**
  - **Description:** Delete a specific employment history entry by ID.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the employment history to delete.
  - **Response:** Returns a success message for the deletion or an error message if not found or server error occurs.

### Degree Routes

- **`GET /degree`**

  - **Description:** Retrieve all degrees.
  - **Response:** Returns an array of degrees sorted by start date in ascending order or an error message.

- **`GET /degree/:id`**

  - **Description:** Retrieve a specific degree by its ID.
  - **Parameters:**
    - `id`: The ID of the degree to retrieve.
  - **Response:** Returns the specific degree or an error message if not found.

- **`POST /degree`**

  - **Description:** Add a new degree.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `institution`: Name of the institution (String, required).
    - `degree`: Type of degree (String, required).
    - `fieldOfStudy`: Field of study (String, required).
    - `startDate`: The starting date (Date, required).
    - `endDate`: The ending date (Date, optional).
  - **Response:** Returns the created degree object or an error message if validation fails or a server error occurs.

- **`PUT /degree/:id`**

  - **Description:** Update an existing degree by ID.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the degree to update.
    - `institution`: Updated name of the institution (String, required).
    - `degree`: Updated type of degree (String, required).
    - `fieldOfStudy`: Updated field of study (String, required).
    - `startDate`: Updated starting date (Date, required).
    - `endDate`: Updated ending date (Date, optional).
  - **Response:** Returns the updated degree object or an error message if not found, validation fails, or a server error occurs.

- **`DELETE /degree/:id`**
  - **Description:** Delete a specific degree by ID.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the degree to delete.
  - **Response:** Returns a success message for the deletion or an error message if not found or server error occurs.

### Certificate Routes

- **`GET /certificate`**

  - **Description:** Retrieve all certificates.
  - **Response:** Returns an array of certificates sorted by date received in descending order or an error message.

- **`GET /certificate/:id`**

  - **Description:** Retrieve a specific certificate by its ID.
  - **Parameters:**
    - `id`: The ID of the certificate to retrieve.
  - **Response:** Returns the specific certificate or an error message if not found.

- **`POST /certificate`**

  - **Description:** Add a new certificate.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `organization`: Name of the organization that issued the certificate (String, required).
    - `certificateName`: Name of the certificate (String, required).
    - `dateReceived`: The date when the certificate was received (Date, required).
    - `link`: Link to the certificate (URL, optional).
  - **Response:** Returns a message confirming the addition of the certificate or an error message if validation fails or a server error occurs.

- **`PUT /certificate/:id`**

  - **Description:** Update an existing certificate by ID.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the certificate to update.
    - `organization`: Updated name of the issuing organization (String, required).
    - `certificateName`: Updated name of the certificate (String, required).
    - `dateReceived`: Updated date of receipt (Date, required).
    - `link`: Updated link to the certificate (URL, optional).
  - **Response:** Returns a message confirming the update or an error message if not found, validation fails, or a server error occurs.

- **`DELETE /certificate/:id`**
  - **Description:** Delete a specific certificate by ID.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the certificate to delete.
  - **Response:** Returns a success message for the deletion or an error message if not found or server error occurs.

### Project Routes

- **`GET /project`**

  - **Description:** Retrieve all projects.
  - **Response:** Returns an array of projects sorted by start date in descending order or an error message.

- **`GET /project/:id`**

  - **Description:** Retrieve a specific project by its ID.
  - **Parameters:**
    - `id`: The ID of the project to retrieve.
  - **Response:** Returns the specific project or an error message if not found.

- **`POST /project`**

  - **Description:** Add a new project.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `name`: Name of the project (String, required).
    - `description`: Description of the project (String, required).
    - `startDate`: The start date of the project (Date, required).
    - `endDate`: The end date of the project (Date, optional).
    - `technologiesUsed`: Technologies used in the project (Array of Strings, required).
    - `link`: Link to the project (URL, optional).
  - **Response:** Returns a message confirming the addition of the project or an error message if a server error occurs.

- **`PUT /project/:id`**

  - **Description:** Update an existing project by ID.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the project to update.
    - `name`: Updated name of the project (String, required).
    - `description`: Updated description of the project (String, required).
    - `startDate`: Updated start date of the project (Date, required).
    - `endDate`: Updated end date of the project (Date, optional).
    - `technologiesUsed`: Updated technologies used in the project (Array of Strings, required).
    - `link`: Updated link to the project (URL, optional).
  - **Response:** Returns a message confirming the update or an error message if not found, validation fails, or a server error occurs.

- **`DELETE /project/:id`**
  - **Description:** Delete a specific project by ID.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the project to delete.
  - **Response:** Returns a success message for the deletion or an error message if not found or a server error occurs.

### Testimonial Routes

- **`GET /testimonials`**

  - **Description:** Retrieve all testimonials that have been verified and approved by the admin.
  - **Response:** Returns an array of approved testimonials or an error message.

- **`POST /testimonials/submit`**

  - **Description:** Submit a new testimonial. A verification email will be sent to the provided email address.
  - **Parameters:**
    - `name`: Name of the person giving the testimonial.
    - `email`: Email address of the person giving the testimonial.
    - `testimonial`: The content of the testimonial.
    - `company`, `position`, `link`: Optional parameters.
  - **Response:** Returns a success message instructing the user to verify their email or an error message.

- **`GET /testimonials/verify/:token`**

  - **Description:** Verify a testimonial using the token sent to the email address.
  - **Parameters:**
    - `token`: The token received in the verification email.
  - **Response:** Returns a success message confirming the verification of the testimonial or an error message if the token is invalid or expired.

- **`GET /testimonials/pending`**

  - **Description:** Retrieve all pending testimonials that have not yet been approved by the admin. Requires admin authentication.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Response:** Returns an array of pending testimonials or an error message.

- **`PUT /testimonials/approve/:id`**

  - **Description:** Approve a testimonial by its ID. Requires admin authentication.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the testimonial to approve.
  - **Response:** Returns a success message confirming the approval of the testimonial or an error message if not found or a server error occurs.

- **`DELETE /testimonials/:id`**
  - **Description:** Delete a specific testimonial by its ID. Requires admin authentication.
  - **Headers:**
    - `Authorization`: Bearer token for admin authentication.
  - **Parameters:**
    - `id`: The ID of the testimonial to delete.
  - **Response:** Returns a success message for the deletion or an error message if not found or a server error occurs.

### Contact Routes

- **`GET /contact`**

  - **Description:** Retrieve the contact form page.
  - **Response:** Returns a placeholder text indicating the contact form page, or a rendered contact form template in a future implementation.

- **`POST /contact/submit`**
  - **Description:** Submit a message through the contact form. This route is rate-limited to prevent abuse.
  - **Parameters:**
    - `name`: The name of the person sending the message.
    - `email`: The email address of the person sending the message.
    - `message`: The content of the message.
  - **Response:** Returns a success message if the message is sent successfully, or an error message if there is a failure in sending the message, or if the rate limit is exceeded.
