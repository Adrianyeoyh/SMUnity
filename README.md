# 🏫 IS216 Web Application Development II

---

## Section & Group Number

G4 Group 12

---

## Group Members

|                  Photo                   | Full Name                   | Role / Features Responsible For                                                                                                                                                              |
| :--------------------------------------: | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="photos/Adrian.jpg" width="80"> | Adrian Yeo Ying Hong        | Backend Developer: Backend Infrastructure, Sign in, Role based Security Restriction Management, Database Management, Backend API calls, Deployment, Git master, Backend-frontend Integration |
|  <img src="photos/Kara.jpg" width="80">  | Kara Huang Xiu Ning         | Frontend Developer: Interactive Landing Page, Discover CSPs and Filters, Create Project Listing flow, Admin Dashboard, Website Screen Responsiveness                                         |
| <img src="photos/Calynn.jpg" width="80"> | Calynn                      | Frontend Developer: Organisation Dashboard, Nav Bar Profile Dropdown Backend - Organisation Profile Edit, Page Locking for Student Pages, Status Tab Counts                                  |
| <img src="photos/Sheryl.jpg" width="80"> | Tan Xing Yee Sheryl         | Frontend Developer: Profile page, Organiser Dashboard, Admin Dashboard, Create Organiser listing form, Google Maps design                                                                    |
|  <img src="photos/Rey.jpg" width="80">   | John Rey Valdellon Pastores | Backend Developer: Google Maps & Google Calendar API Integration                                                                                                                             |
| <img src="photos/KaiJie.jpg" width="80"> | Leo Kai Jie                 | Slides, ReadME                                                                                                                                                                               |

---

## Business Problem

> Current CSP opportunities are scattered across multiple platforms, making it difficult for students to discover projects aligned with their interests and availability.
> Organizations lack a unified system for application management and volunteer tracking.
> SMUnity solves this by consolidating all CSP listings into one accessible hub, allowing students to browse available projects, filter them by skills, interests or location, and apply directly through the site.
> For CSP leaders, the platform provides an intuitive admin panel to post opportunities, manage applications, and track volunteer slots.
> By streamlining both discovery and management, SMUnity makes it easier for students to find their CSPs and organisations to manage their programs efficiently in one place, fostering greater participation and impact within the SMU community.

---

## Web Solution Overview

### 🎯 Intended Users

SMU Students - Undergraduates at SMU seeking community service opportunities to fulfill graduation requirements

CSP Leaders and Organizations - Community service organizations heads, coordinators and project leads responsible for posting volunteer opportunities, managing applications, and recruiting student volunteers.

### 💡 What Users Can Do & Benefits

| Feature                        | Description                                                                                       | User Benefit                                      |
| :----------------------------- | :------------------------------------------------------------------------------------------------ | :------------------------------------------------ |
| Search & Filter Projects       | Find CSPs by category, location, duration, and keywords                                           | Saves time finding relevant results               |
| View on Interactive Map        | Locate CSP opportunities nearby with Google Maps integration                                      | Quick discovery of projects in the area           |
| Apply for Projects             | Submit applications directly through the platform                                                 | Simple way to apply for opportunities             |
| Track Application Status       | Monitor application progress (pending, accepted, rejected, confirmed, withdrawn)                  | Clear visibility into application outcomes        |
| Google Calendar Sync           | Integrate confirmed projects into calendar                                                        | Manage volunteer schedule with other activities   |
| Personalized Dashboard         | View all saved projects and application history                                                   | Centralized hub for managing volunteer activities |
| Organization Management Portal | Post opportunities, review applications, and manage volunteer slots                               | Connect with and manage student volunteers        |
| Admin Management Portal        | Search organizations, approve/suspend accounts, view project analytics, and manage platform users | Ensures platform integrity                        |

---

## Tech Stack

|                                                                                                                Logo                                                                                                                 | Technology          | Purpose / Usage                        |
| :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------ | :------------------------------------- |
|                                                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png" width="40">                                                       | **React**           | Frontend UI framework                  |
|                                                         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfLiZmMOa7nJKl15YVdWyMrEY19RETEDe8mA&s" width="40">                                                         | **Bun**             | JavaScript runtime and package manager |
|                                               <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png" width="40">                                               | **Tailwind CSS**    | Styling and responsiveness             |
|                                                     <img src="https://gsap.com/community/uploads/monthly_2020_03/tweenmax.png.cf27916e926fbb328ff214f66b4c8429.png" width="40">                                                     | **GSAP**            | UI animations                          |
| <img src="https://www.framer.com/creators-assets/_next/image/?url=https%3A%2F%2Fy4pdgnepgswqffpt.public.blob.vercel-storage.com%2Fcomponents%2FbSeEZJm22jsjERCOGQvq%2Flenis-IR6x5YJmajCtRooZgkmfzfBTzWJTLg&w=1920&q=90" width="40"> | **Lenis**           | Smooth scrolling                       |
|    <img src="https://media.licdn.com/dms/image/v2/D4E0BAQGvrlykNx9Xaw/company-logo_200_200/company-logo_200_200/0/1684762073756/neondatabase_logo?e=2147483647&v=beta&t=pjpaL_-tBQPhI4Jr9cNceBx7tV8drTsa5yG30NZfVm4" width="40">    | **Neonbase**        | Database and real-time sync            |
|                                                                         <img src="https://avatars.githubusercontent.com/u/163827765?s=200&v=4" width="40">                                                                          | **Better Auth**     | Authentication and sessions            |
|                                                         <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Yyu-X8Q9rvur3BTaHSf1XaRNbizBAZjFbA&s" width="40">                                                         | **Google Cloud**    | OAuth login integration                |
|                                                <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.width-500.format-webp.webp" width="40">                                                 | **Google Maps**     | Location-based features                |
|                                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/2048px-Google_Calendar_icon_%282020%29.svg.png" width="40">                                 | **Google Calendar** | Event scheduling                       |
|                                                            <img src="https://download.logo.wine/logo/Amazon_Web_Services/Amazon_Web_Services-Logo.wine.png" width="40">                                                             | **AWS**             | Deployment                             |
|                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s" width="40">                                                             | **Gemini**             | AI Chatbot                             |

---

## Use Case & User Journey

1. **Landing Page**  
   <img src="screenshots/landing.jpg" width="600">

- Displays the homepage with navigation options.

2. **AI Chatbot**  
   <img src="screenshots/AIChatbot.jpg" width="600">

- The AI Chatbot helps users on how to use the website

3. **CSP Discover and Matching**  
   <img src="screenshots/discover.jpg" width="600">

- Users can search and filter through CSPs in this page by Category, Location (Map), and Keywords

4. **View CSP Details**  
   <img src="screenshots/viewCSPDetails.jpg" width="600">

- Detailed CSP View Page showing description, requirements, and application.

5. **GoogleOAuth Sign In**  
   <img src="screenshots/GoogleSignIn.jpg" width="600">

- Users sign in securely using their accounts before applying.

6. **User Application Form**  
   <img src="screenshots/applicationform.jpg" width="600">

- Users must complete the application form to apply for a CSP.

7. **User Dashboard**  
   <img src="screenshots/UserDashboard.jpg" width="600">

- Main dashboard displaying overview of user CSP applications and upcoming events.

8. **User My Applications**  
   <img src="screenshots/MyApplications.jpg" width="600">

- Dedicated application tracking page monitoring all their applications for CSP.

### Organisation User Journey

9. **Organisation Dashboard**  
   <img src="screenshots/OrganisationDashboard.jpg" width="600">

- Dashboard for organisation coordinators to view all posted listings, track application status, manage volunteer slots, and access analytics.

10. **Organisation Request Form**  
    <img src="screenshots/OrgRequestForm.jpg" width="600">

- Organisation members can request to make a form. Once request is accepted, the password is then sent to their email. (If done locally its sent to MailDev)

11. **Create New CSP Listing**  
    <img src="screenshots/CreateListing.jpg" width="600">

- Organisation coordinators can create a CSP Listing with specified requirements that they need to fill.

12. **View Posted Listing**  
    <img src="screenshots/ViewListing.jpg" width="600">

- Organisation coordinators can view details of their posted listing including project overview with all listing details, student applicant profiles, and options to accept or reject applications.

13. **View Applicant Details**  
    <img src="screenshots/ViewApplicant.jpg" width="600">

- Organisation coordinators can view applicant's details including options to call and email and view details from application form.

### Admin User Journey

14. **Admin Dashboard**  
    <img src="screenshots/AdminDashboard.jpg" width="600">

- Admin Dashboard provides an overview of platform activity on active organisations, total CSP listings, and active users. Admins can quickly review, approve, or reject pending organisations.

15. **CreateOrganiserForm**  
    <img src="screenshots/CreateOrganiserForm.jpg" width="600">

- Admins can create a new organiser by filling out the organiser form.

16. **ViewOrganisation**  
    <img src="screenshots/ViewOrganisation.jpg" width="600">

- Lets admins browse all registered organisations, search or filter by status and see contact details for each entry. Admins can suspend or reactivate organisations directly from this list for quick management.

---

## Developers Setup Guide

Comprehensive steps to help other developers or evaluators run and test your project.

---

### 0) Prerequisites

- [Git](https://git-scm.com/) v2.4+
- [Bun](https://bun.sh/) v1.2.15+
- [PostgreSQL](https://www.postgresql.org/) v17+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (For Local Development)

---

### 1) Download the Project

```bash
git clone https://github.com/Adrianyeoyh/SMUnity.git
cd SMUnity
bun install
```

---

### 2) Configure Environment Variables

Create a `.env` file in the root directory with the following structure:

```bash

DATABASE_URL="postgresql://postgres:password@localhost:5432/app" # For Local Development

BETTER_AUTH_SECRET="your-generated-secret-here"

VITE_APP_URL="http://localhost:4000"
VITE_SERVER_URL="http://localhost:4001"

GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
VITE_GOOGLE_CALENDAR_CLIENT_ID="your-calendar-client-id.apps.googleusercontent.com"
VITE_GOOGLE_CALENDAR_CLIENT_SECRET="your-calendar-client-secret"

GEMINI_API_KEY="your-gemini-api-key"

SMTP_HOST="localhost"
SMTP_PORT="1025"
SMTP_SECURE="false"
SMTP_USER="username"
SMTP_PASS="password"
SMTP_FROM="no-reply@localhost"

AWS_ACCESS_KEY_ID="admin"
AWS_SECRET_ACCESS_KEY="password"
AWS_REGION="ap-southeast-1"
AWS_S3_ENDPOINT="http://localhost:9000"
AWS_S3_BUCKET="app"
FORCE_PATH_STYLE="true"

```

> Never commit the `.env` file to your repository.  
> Instead, include a `.env.example` file with placeholder values.

---

### 3) Backend / Cloud Service Setup

#### Docker

1. Make sure Docker Desktop is installed and running before proceeding.

2. Start local database and services
   ```bash
      docker-compose -f docker-compose.dev.yaml up -d
   ```
3. Push schema to the database
   ```bash
      bun db:push
      bun run scripts/db-seed-admin.ts
   ```
4. Open Drizzle Studio to visualise local database:

   ```bash
      bun db:studio
   ```

5. Access at: `https://local.drizzle.studio`

#### Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable APIs:
   - Navigate to **APIs & Services** → **Enable APIs**
   - Enable: **Google+ API**, **Google Maps JavaScript API**, **Google Calendar API**

4. Create OAuth Credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Add Authorized redirect URI: `http://localhost:4000/api/auth/callback/google`
   - Copy **Client ID** and **Client Secret** to your `.env`

5. Get Maps API Key:
   - In **Credentials**, click **Create Credentials** → **API Key**
   - Copy to `.env` as `VITE_GOOGLE_MAPS_API_KEY`

6. Get Gemini API Key:
   - Go to [Google AI Studio](https://ai.google.dev/aistudio)
   - Create an API key
   - Copy to `.env` as `GEMINI_API_KEY`

#### Better Auth Secret

Generate a secure secret for authentication:

```bash
   openssl rand -base64 32
```

- Copy the output to your `.env` as `BETTER_AUTH_SECRET`

---

### 4) Run the Frontend

To start the development server:

```bash
bun dev
```

The project will run on [http://localhost:4000](http://localhost:4000) by default.
Emails on development mode will be sent to MailDev at [http://localhost:1080](http://localhost:1080).

To build and preview the production version:

```bash
bun build
bun start
```

---

### 5) Testing the Application

#### Manual Testing

Perform the following checks before submission:

| Area            | Test Description               | Expected Outcome                       |
| :-------------- | :----------------------------- | :------------------------------------- |
| Authentication  | Register, Login, Logout        | User successfully signs in/out         |
| CRUD Operations | Add, Edit, Delete data         | Database updates correctly             |
| Responsiveness  | Test on mobile & desktop       | Layout adjusts without distortion      |
| Navigation      | All menu links functional      | Pages route correctly                  |
| Error Handling  | Invalid inputs or missing data | User-friendly error messages displayed |

#### Width Testing

Application was tested on these screen widths: iPhone 12pro, iPad Pro, and Normal Desktop Screen

---

### 6) Common Issues & Fixes

| Issue                              | Cause                            | Fix                                                                                        |
| :--------------------------------- | :------------------------------- | :----------------------------------------------------------------------------------------- |
| `Module not found`                 | Missing dependencies             | Run `bun install` again                                                                    |
| Docker containers not starting     | Docker Desktop not running       | Open Docker Desktop and ensure it's running                                                |
| `Database connection failed`       | PostgreSQL not running in Docker | Run `docker-compose up -d` to start services                                               |
| `BETTER_AUTH_SECRET not found`     | Missing environment variable     | Generate secret with `openssl rand -base64 32` and add to `.env`                           |
| `.env` variables undefined         | Missing `VITE_` prefix           | Rename variables to start with `VITE_`                                                     |
| `Google OAuth error`               | Invalid redirect URI             | Check Google Console OAuth settings match `http://localhost:4000/api/auth/callback/google` |
| `bun dev` fails                    | Wrong Bun                        | Check versions: `bun -v` ≥ 1.2.15                                                          |
| Port already in use (4000 or 4001) | Another process using the port   | Stop other processes or change ports in config                                             |
| MinIO connection error             | MinIO not running                | Verify Docker services with `docker ps`                                                    |

---

## Group Reflection

> - _Adrian Yeo Ying Hong:_ Learnt to use other local development tools like docker containers and drizzle, and better auth for local authentication management, role based permissions which i learnt from cybersecurity, operating systems and networking mods from previous and ongoing semesters.

> - _Kara Huang Xiu Ning:_ I learnt to develop a clean UI with reusable components and multi-role user management, which required coordinating complex workflows between students, organisations, and administrators while maintaining an easy-to-use system. I also had the opportunity to explore and integrate advanced animations (smooth-scrolling) to create a modern, user-friendly interface.

> - _Calynn:_ I learned more about the syntax for responsiveness in Tailwind CSS and React. I also gained a better understanding of how to extract data from the backend and incorporate it into the frontend to implement features that allow for customisation and prevent users from accessing pages without authentication.

> - _Tan Xing Yee Sheryl:_ I learnt more about tools such as react, tailwind css, drizzle, betterauth, etc. I got to explore Lenis and GSAP which I never knew existed. I also was able to learn more about working with external APIs which I haven't really explored much before. Hence, this project gave me the chance to be able to learn and discover new things which would be useful for future uses.

> - _John Rey Valdellon Pastores:_ Learned how to use tools that I haven't touched before such Tailwind CSS, bun, docker, drizzle, typescript and many others. I also got to experience how to use APIs, especially in Google Cloud, first hand in a website and I believe this would help for my own personal projects.

> - _Leo Kai Jie:_ I learned to use docker to run and managed container application as well as learn how components can be used to effectively manage big projects, by calling the container and to make it easier for the eyes.

As a team, reflect on:

- Key takeaways from working with real-world frameworks
- Challenges faced and how they were resolved
- Insights on teamwork, project management, and problem-solving
