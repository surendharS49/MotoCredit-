# RC Finance Manager Backend

This is the backend service for the RC Finance Manager application, built with Node.js, Express, TypeScript, and MySQL.

## Features

- User Authentication and Authorization
- Customer Management
- Vehicle and RC Book Management
- Loan Management
- EMI Tracking
- Document Management
- File Upload Support
- Role-based Access Control
- Error Handling
- Rate Limiting
- Security Features

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- TypeScript
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd rc-finance-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration.

5. Create the database:
```sql
CREATE DATABASE rc_finance;
```

6. Build the project:
```bash
npm run build
```

7. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## API Documentation

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout

### Customers
- GET /api/customers
- POST /api/customers
- GET /api/customers/:id
- PUT /api/customers/:id
- DELETE /api/customers/:id

### Vehicles
- GET /api/vehicles
- POST /api/vehicles
- GET /api/vehicles/:id
- PUT /api/vehicles/:id
- DELETE /api/vehicles/:id

### Loans
- GET /api/loans
- POST /api/loans
- GET /api/loans/:id
- PUT /api/loans/:id
- DELETE /api/loans/:id

### EMIs
- GET /api/emis
- POST /api/emis
- GET /api/emis/:id
- PUT /api/emis/:id
- DELETE /api/emis/:id

### Documents
- GET /api/documents
- POST /api/documents
- GET /api/documents/:id
- PUT /api/documents/:id
- DELETE /api/documents/:id

## Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server
- `npm run build`: Build the TypeScript code
- `npm run lint`: Run ESLint
- `npm test`: Run tests

## Security Features

- JWT Authentication
- Password Hashing
- Rate Limiting
- CORS Protection
- Helmet Security Headers
- Input Validation
- Error Handling
- SQL Injection Protection

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 