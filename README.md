# RentLoop – A Local Rental Marketplace Platform

A peer-to-peer rental marketplace where users can list their idle items for rent and connect with others through real-time chat.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT
- **Real-time Chat:** Socket.io

## Features

- User registration and login with JWT authentication
- Create, edit, and delete rental listings
- Search and filter listings by category and city
- Real-time chat between renter and owner using Socket.io
- Dashboard for managing your listings
- User reviews and star ratings
- Availability toggle for listings

## Project Structure

```
rentloop/
├── frontend/         # React.js frontend
├── backend/          # Node.js + Express backend
└── README.md
```

## Setup Instructions

### Backend

```bash
cd backend
npm install
```

Create .env file with:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5001
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create .env file with:
```
REACT_APP_API_URL=http://localhost:5001
```

```bash
npm start
```

## Live Demo

- Frontend: https://rentloop.vercel.app
- Backend: https://rentloop-backend-eyfu.onrender.com

## Developer

- K. Gopi Nishanth
- Reg No: 23211A05D1
- B V Raju Institute of Technology
