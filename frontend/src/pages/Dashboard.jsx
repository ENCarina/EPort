import { useEffect, useState } from 'react'
import { staffAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import '../styles/dashboard.css'

const Dashboard = () => {
  const [staffCount, setStaffCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await staffAPI.getStaff()
      setStaffCount(response.data.length || 0)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="welcome">Welcome, {user?.name || 'User'}!</p>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Available Healthcare Professionals</h3>
          <p className="dashboard-number">{staffCount}</p>
        </div>

        <div className="dashboard-card">
          <h3>Book an Appointment</h3>
          <p>Find and book consultations with our healthcare professionals</p>
          <a href="/staff" className="btn btn-primary">Browse Professionals</a>
        </div>

        <div className="dashboard-card">
          <h3>My Appointments</h3>
          <p>View and manage your upcoming appointments</p>
          <a href="/my-bookings" className="btn btn-primary">View Appointments</a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
