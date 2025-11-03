# 🏫 IS216 Web Application Development II

---

## Section & Group Number
G4 Group 12

---

## Group Members

| Photo | Full Name | Role / Features Responsible For |
|:--:|:--|:--|
| <img src="photos/adrian.jpg" width="80"> | Adrian Yeo Ying Hong | Backend Developer: Backend Infrastructure, Sign in, Role based Security Restriction Management, Database Management, Backend API calls, Deployment, Git master, Backend-frontend Integration |
| <img src="photos/Kara.jpg" width="80"> | Kara Huang Xiu Ning | Frontend Developer: Interactive Landing Page, Discover CSPs and Filters, Create Project Listing flow, Admin Dashboard, Website Screen Responsiveness |
| <img src="photos/Calynn.jpg" width="80"> | Calynn | Frontend Developer - Organisation Dashboard, Nav Bar Profile Dropdown Backend - Organisation Profile Edit, Page Locking for Student Pages, Status Tab Counts |
| <img src="photos/Sheryl.jpg" width="80"> | Tan Xing Yee Sheryl | Frontend Developer - Profile page, Organiser Dashboard, Admin Dashboard, Create Organiser listing form, Google Maps design |
| <img src="photos/Rey.jpg" width="80"> | John Rey Valdellon Pastores | Backend Developer - Google Maps & Google Calendar API Integration |
| <img src="photos/KaiJie.jpg" width="80"> | Leo Kai Jie | {To be Filled} |


---

## Business Problem

Describe the **real-world business or community problem** your project addresses.

> Current CSP opportunities are scattered across multiple platforms, making it difficult for students to discover project aligned with their interest and availability.
> Organizations lack a unified system for application management and volunteer tracking.
> SMUnity addresses these paint points by creating an integrated platform where students can discover and apply for CSP opportunities, and organizations, can post projects and manage applications efficiently. 

---

## Web Solution Overview

### 🎯 Intended Users

SMU Students - Undergraduates at SMU seeking community service opportunities to fulfill graduation requirements

CSP Leaders and Organizations - Community service organizations heads, coordinators and project leads responsible for posting volunteer opportunties, managing application and recruiting student voluneers.


### 💡 What Users Can Do & Benefits  

| Feature | Description | User Benefit |
|:--|:--|:--|
| Search & Filter Projects | Find CSPs by category, location, duration, and keywords | Saves time finding relevant results |
| View on Interactive Map | Locate CSP opportunities nearby with Google Maps integration | Quick discovery of projects in the area |
| Apply for Projects | Submit applications directly through the platform | Simple way to apply for opportunities |
| Track Application Status | Monitor application progress (pending, accepted, rejected, confirmed, withdrawn) | Clear visibility into application outcomes |
| Google Calendar Sync | Integrate confirmed projects into calendar | Manage volunteer schedule with other activities |
| Personalized Dashboard | View all saved projects and application history | Centralized hub for managing volunteer activities |
| Organization Management Portal | Post opportunities, review applications, and manage volunteer slots | Connect with and manage student volunteers |

---

## Tech Stack
| Logo | Technology | Purpose / Usage |
|:--:|:--|:--|
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png" width="40"> | **React** | Frontend UI framework |
| <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfLiZmMOa7nJKl15YVdWyMrEY19RETEDe8mA&s" width="40"> | **Bun** | JavaScript runtime and package manager |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/2560px-Tailwind_CSS_Logo.svg.png" width="40"> | **Tailwind CSS** | Styling and responsiveness |
| <img src="https://gsap.com/community/uploads/monthly_2020_03/tweenmax.png.cf27916e926fbb328ff214f66b4c8429.png" width="40"> | **GSAP** | UI animations |
| <img src="https://www.framer.com/creators-assets/_next/image/?url=https%3A%2F%2Fy4pdgnepgswqffpt.public.blob.vercel-storage.com%2Fcomponents%2FbSeEZJm22jsjERCOGQvq%2Flenis-IR6x5YJmajCtRooZgkmfzfBTzWJTLg&w=1920&q=90" width="40"> | **Lenis** | Smooth scrolling |
| <img src="https://media.licdn.com/dms/image/v2/D4E0BAQGvrlykNx9Xaw/company-logo_200_200/company-logo_200_200/0/1684762073756/neondatabase_logo?e=2147483647&v=beta&t=pjpaL_-tBQPhI4Jr9cNceBx7tV8drTsa5yG30NZfVm4" width="40"> | **Neonbase** | Database and real-time sync |
| <img src="https://avatars.githubusercontent.com/u/163827765?s=200&v=4" width="40"> | **Better Auth** | Authentication and sessions |
| <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Yyu-X8Q9rvur3BTaHSf1XaRNbizBAZjFbA&s" width="40"> | **Google Cloud** | OAuth login integration |
| <img src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Maps_Pin_FullColor.width-500.format-webp.webp" width="40"> | **Google Maps** | Location-based features |
| <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/2048px-Google_Calendar_icon_%282020%29.svg.png" width="40"> | **Google Calendar** | Event scheduling |
| <img src="https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png" width="40"> | **Vercel** | Deployment |


---

## Use Case & User Journey

Provide screenshots and captions showing how users interact with your app.

1. **Landing Page**  
   <img src="screenshots/landing.jpg" width="600">  
   - Displays the homepage with navigation options.

2. **CSP Discover and Matching**  
   <img src="screenshots/discover.jpg" width="600">  
   - Users can search and filter through CSPs in this page

3. **User Dashboard**  
   <img src="screenshots/dashboard.png" width="600">  
   - Shows saved data and recent activities.

> Save screenshots inside `/screenshots` with clear filenames.

---

## Developers Setup Guide

Comprehensive steps to help other developers or evaluators run and test your project.

---

### 0) Prerequisites
- [Git](https://git-scm.com/) v2.4+  
- [Node.js](https://nodejs.org/) v18+ and npm v9+  
- Access to backend or cloud services used (Firebase, MongoDB Atlas, AWS S3, etc.)

---

### 1) Download the Project
```bash
git clone https://github.com/<org-or-user>/<repo-name>.git
cd <repo-name>
npm install
```

---

### 2) Configure Environment Variables
Create a `.env` file in the root directory with the following structure:

```bash

VITE_API_URL=<your_backend_or_firebase_url>
VITE_FIREBASE_API_KEY=<your_firebase_api_key>
VITE_FIREBASE_AUTH_DOMAIN=<your_auth_domain>
VITE_FIREBASE_PROJECT_ID=<your_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<your_storage_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
VITE_FIREBASE_APP_ID=<your_app_id>

```

> Never commit the `.env` file to your repository.  
> Instead, include a `.env.example` file with placeholder values.

---

### 3) Backend / Cloud Service Setup

#### Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project.
3. Enable the following:
   - **Authentication** → Email/Password sign-in
   - **Firestore Database** or **Realtime Database**
   - **Hosting (optional)** if you plan to deploy your web app
4. Copy the Firebase configuration into your `.env` file.

#### Optional: Express.js / MongoDB
If your app includes a backend:
1. Create a `/server` folder for backend code.
2. Inside `/server`, create a `.env` file with:
   ```bash
   MONGO_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret_key>
   ```
3. Start the backend:
   ```bash
   cd server
   npm install
   npm start
   ```

---

### 4) Run the Frontend
To start the development server:
```bash
npm run dev
```
The project will run on [http://localhost:5173](http://localhost:5173) by default.

To build and preview the production version:
```bash
npm run build
npm run preview
```

---

### 5) Testing the Application

#### Manual Testing
Perform the following checks before submission:

| Area | Test Description | Expected Outcome |
|:--|:--|:--|
| Authentication | Register, Login, Logout | User successfully signs in/out |
| CRUD Operations | Add, Edit, Delete data | Database updates correctly |
| Responsiveness | Test on mobile & desktop | Layout adjusts without distortion |
| Navigation | All menu links functional | Pages route correctly |
| Error Handling | Invalid inputs or missing data | User-friendly error messages displayed |

#### Automated Testing (Optional)
If applicable:
```bash
npm run test
```

---

### 6) Common Issues & Fixes

| Issue | Cause | Fix |
|:--|:--|:--|
| `Module not found` | Missing dependencies | Run `npm install` again |
| `Firebase: permission-denied` | Firestore security rules not set | Check rules under Firestore → Rules |
| `CORS policy error` | Backend not allowing requests | Enable your domain in CORS settings |
| `.env` variables undefined | Missing `VITE_` prefix | Rename variables to start with `VITE_` |
| `npm run dev` fails | Node version mismatch | Check Node version (`node -v` ≥ 18) |

---

## Group Reflection

Each member should contribute 2–3 sentences on their learning and project experience.

> **Example Template:**  
> - *Adrian Yeo Ying Hong:* Learnt to use other local development tools like docker containers and drizzle, and better auth for local authentication management, role based permissions which i learnt from cybersecurity, operating systems and networking mods from previous and ongoing semesters.  
> - *Kara Huang Xiu Ning:* I learnt to develop a clean UI with reusable components and multi-role user management, which required coordinating complex workflows between students, organisations, and administrators while maintaining an easy-to-use system. I also had the opportunity to explore and integrate advanced animations (smooth-scrolling) to create a modern, user-friendly interface. 
> - *Calynn:* I learned more about the syntax for responsiveness in Tailwind CSS and React. I also gained a better understanding of how to extract data from the backend and incorporate it into the frontend to implement features that allow for customisation and prevent users from accessing pages without authentication.  
> - *Tan Xing Yee Shery:* I learnt more about tools such as react, tailwind css, drizzle, betterauth, etc. I got to explore Lenis and GSAP which I never knew existed. I also was able to learn more about working with external APIs which I havent really explored much before. Hence, this project gave me the chance to be able to learn and discover new things which would be useful for future uses.
> - *John Rey Valdellon Pastores:* Learned how to use tools that I haven't touched before such Tailwind CSS, bun, docker, drizzle, typescript and many others. I also got to experience how to use APIs, especially in Google Cloud, first hand in a website and I believe this would help for my own personal projects.
> - *Leo Kai Jie:* 


As a team, reflect on:
- Key takeaways from working with real-world frameworks  
- Challenges faced and how they were resolved  
- Insights on teamwork, project management, and problem-solving  
