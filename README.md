# Truck Fleet Management Frontend

A React.js frontend application for managing truck fleets with role-based access control.

## Features

- **Authentication & Authorization**: Login/Register with role-based access (Admin, Owner, Driver)
- **Dashboard**: Overview of fleet statistics and quick actions
- **Truck Management**: Add, edit, view, and delete trucks
- **Trip Management**: Create and manage trips with detailed tracking
- **Drive Session Tracking**: Start/stop drive sessions with real-time monitoring
- **Refuel Event Logging**: Log and track fuel consumption and costs
- **Notifications**: Real-time notifications system
- **User Management**: Invite drivers to join the fleet
- **Responsive Design**: Bootstrap-based responsive UI

## Tech Stack

- **Frontend**: React.js 18
- **UI Framework**: Bootstrap 5 + React Bootstrap
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Font Awesome
- **Date Handling**: Moment.js
- **Notifications**: React Toastify

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on port 3000

### Installation

1. **Create the React app**:
   \`\`\`bash
   npx create-react-app truck-fleet-frontend
   cd truck-fleet-frontend
   \`\`\`

2. **Replace the generated files** with the files from this project

3. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

4. **Start the development server**:
   \`\`\`bash
   npm start
   \`\`\`

The application will open at `http://localhost:3001` (since port 3000 is used by the backend).

### Backend Configuration

Make sure your backend API is running on `http://localhost:3000`. The frontend is configured to proxy API requests to this URL.

If your backend runs on a different port, update the `proxy` field in `package.json`:

\`\`\`json
{
"proxy": "http://localhost:YOUR_BACKEND_PORT"
}
\`\`\`

## Project Structure

\`\`\`
src/
├── components/ # Reusable components
│ ├── Navbar.js # Navigation bar
│ └── ProtectedRoute.js # Route protection
├── contexts/ # React contexts
│ ├── AuthContext.js # Authentication context
│ └── NotificationContext.js # Notifications context
├── pages/ # Page components
│ ├── Dashboard.js # Main dashboard
│ ├── Login.js # Login page
│ ├── Register.js # Registration page
│ ├── TruckList.js # Truck listing
│ ├── TruckForm.js # Add/Edit truck
│ ├── TripList.js # Trip listing
│ ├── TripForm.js # Create trip
│ ├── TripDetails.js # Trip details
│ ├── DriveSessionList.js # Drive sessions
│ ├── RefuelEventList.js # Refuel events
│ ├── NotificationList.js # Notifications
│ └── InviteDriver.js # Invite drivers
├── App.js # Main app component
├── App.css # Global styles
└── index.js # App entry point
\`\`\`

## User Roles & Permissions

### Admin

- Full access to all features
- Can manage all trucks, trips, and users
- Can view all data across the system

### Owner

- Can manage trucks and trips
- Can invite drivers
- Can view data for their fleet

### Driver

- Can view assigned trucks and trips
- Can start/stop drive sessions
- Can log refuel events
- Can view notifications

## API Integration

The frontend integrates with the backend API using Axios. Key endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/trucks` - Get trucks
- `POST /api/trucks` - Create truck
- `GET /api/trips` - Get trips
- `POST /api/trips` - Create trip
- `POST /api/drive-sessions/start` - Start drive session
- `POST /api/refuel-events` - Log refuel event
- `GET /api/notifications` - Get notifications

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

\`\`\`env
REACT_APP_API_URL=http://localhost:3000
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
