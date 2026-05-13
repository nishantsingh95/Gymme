# Gym Management System (Gymme)

Gymme is a comprehensive, full-stack web application designed to streamline the operations of fitness centers and gym chains. It provides an intuitive interface for managing members, memberships, expenses, and multiple gym outlets, along with an AI-powered chatbot for enhanced assistance.

## 🚀 Features

### Authentication & Security
- Secure User Registration and Login
- Password Recovery (Forgot Password functionality with email support)
- JWT-based Authentication
- Password encryption using bcryptjs

### Member Management
- Add, edit, and view member profiles
- Track member details and status
- Member overview through intuitive Member Cards

### Membership Management
- Create and manage different membership plans
- Assign memberships to members
- Automated scheduled tasks (e.g., membership expiry checks) using `node-cron`

### Gym & Outlet Management
- Manage multiple gym branches/outlets
- Add new outlets and view them via Outlet Cards

### Financial Management
- Track gym expenses
- Add and monitor expenses with Expense Cards

### AI Integration
- Integrated AI Chatbot powered by Google Generative AI to assist users and staff.

### UI/UX
- Responsive Sidebar navigation
- Interactive Modals and Loaders for better user experience
- Smooth animations and transitions
- Toast notifications for user feedback

## 💻 Tech Stack

### Frontend
- **Framework:** React.js
- **Routing:** React Router DOM
- **Styling:** TailwindCSS, Material-UI (@mui/material, @mui/icons-material)
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Other Utilities:** React Switch

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Email Service:** Nodemailer
- **Task Scheduling:** Node-Cron
- **AI Service:** Google Generative AI SDK (`@google/generative-ai`)
- **Security & Utilities:** cors, cookie-parser, dotenv, content-security-policy

## 📂 Project Structure

- `/frontend` - Contains the React application (UI components, pages, styling).
- `/backend` - Contains the Node.js/Express server (API routes, controllers, models, utils).

## 🛠️ Setup and Installation

### Prerequisites
- Node.js installed on your machine
- MongoDB instance (local or Atlas)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and configure your environment variables:
   - MongoDB URI
   - JWT Secret
   - Email credentials (for Nodemailer)
   - Google AI API Key
4. Start the backend development server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```

The application should now be running locally.
