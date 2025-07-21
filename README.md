# MotoCredit

MotoCredit is a full-stack web application for managing vehicle loans, customers, payments, and reports for a lending business. It provides an admin portal for loan management and a customer portal for loan tracking and payment history.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Core Data Models](#core-data-models)
- [License](#license)

---

## Features
- Admin authentication and dashboard
- Customer, vehicle, loan, and guarantor management
- Loan application, approval, and EMI calculation
- Payment tracking and history
- Reports and analytics (admin)
- Customer portal for viewing loans, vehicles, and payment history

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, dotenv
- **Frontend:** React (Vite), React Router, TailwindCSS, Axios, Recharts

## Project Structure
```
MotoCredit-
│
├── backend/          # Express API server
│   ├── src/
│   │   ├── models/   # Mongoose models (Customer, Vehicle, Loan, etc.)
│   │   ├── routes/   # Express routes
│   │   └── ...
│   ├── server.js     # Entry point for backend
│   └── .env          # Backend environment variables
│
├── frontend/         # React client app
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md         # Project documentation
```

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see [Environment Variables](#environment-variables))
4. Start the backend server:
   ```bash
   npm run dev
   # or
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
3. Start the frontend dev server:
   ```bash
   npm run dev
   ```

## Environment Variables
### Backend `.env` example:
```
MONGODB_URL=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=3000
BACKEND_URL=<your-backend-url>
```

## Scripts
### Backend
- `npm run dev` — Start backend with nodemon (development)
- `npm start` — Start backend (production)

### Frontend
- `npm run dev` — Start frontend dev server
- `npm run build` — Build frontend for production
- `npm run preview` — Preview production build

## Core Data Models
- **Customer:** Personal and contact details, KYC (Aadhar, PAN, DL), status
- **Vehicle:** Registration, manufacturer, model, year, engine/chassis, status
- **Loan:** Customer, vehicle, amount, tenure, interest, payments, status
- **Payment:** Loan, installment, amount, status, dates, method
- **Guarantor:** Linked to customers, personal info
- **Admin:** Admin users, roles
- **AuditLog:** Tracks actions on payments/loans

## License
This project is for educational/demo purposes. Please contact the author for production/commercial use.

## Contact
- Email: surendhar0fficial49@gmail.com

## credentials
-**admin**
   username: admin@1234.com
   password: Admin@1234

-**user**
   username: user@1234.com
   password: User@1234



   

