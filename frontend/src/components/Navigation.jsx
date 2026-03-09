import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/navigation.css'

const Navigation = () => {
  const { logout, user } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand">
          EPort Healthcare
        </Link>

        <ul className="nav-menu">
          <li>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/staff"
              className={`nav-link ${isActive('/staff') ? 'active' : ''}`}
            >
              Professionals
            </Link>
          </li>
          <li>
            <Link
              to="/booking"
              className={`nav-link ${isActive('/booking') ? 'active' : ''}`}
            >
              Book Appointment
            </Link>
          </li>
          <li>
            <Link
              to="/my-bookings"
              className={`nav-link ${isActive('/my-bookings') ? 'active' : ''}`}
            >
              My Appointments
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              Profile
            </Link>
          </li>
        </ul>

        <div className="nav-user">
          <span className="user-name">{user?.name}</span>
          <button onClick={logout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
