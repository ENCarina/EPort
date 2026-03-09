# EPort Frontend

A modern React frontend for the EPort healthcare appointment booking system.

## Features

- **User Authentication**: Register and login functionality
- **Healthcare Professional Browsing**: Browse available healthcare professionals
- **Appointment Booking**: Book appointments with professionals
- **Time Slot Management**: View and select available time slots
- **My Appointments**: View and manage your bookings
- **User Profile**: Manage user information and password

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```
VITE_API_URL=http://localhost:3001/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Build

```bash
npm run build
```

## Project Structure

- `src/pages/` - Page components
- `src/components/` - Reusable components
- `src/services/` - API services
- `src/context/` - React Context for state management
- `src/styles/` - CSS stylesheets

## Technologies

- React 18
- Vite
- React Router v6
- Axios
- CSS3

## API Endpoints

The frontend connects to the following backend endpoints:
- `/api/register` - User registration
- `/api/login` - User login
- `/api/users` - User management
- `/api/staff` - Healthcare professionals
- `/api/profiles` - Public profiles
- `/api/consultations` - Consultations
- `/api/slots` - Time slots
- `/api/bookings` - Appointments
