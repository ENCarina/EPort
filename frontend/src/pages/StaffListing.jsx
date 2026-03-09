import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { staffAPI } from '../services/api'
import '../styles/listing.css'

const StaffListing = () => {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await staffAPI.getStaff()
      console.log('Staff API response:', response.data)
      setStaff(response.data.data || [])
    } catch (err) {
      setError('Failed to load staff list')
      console.error('Staff API error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="listing-container">
      <h1>Healthcare Professionals</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="staff-grid">
        {staff.length > 0 ? (
          staff.map((member) => (
            <div key={member.id} className="staff-card">
              <h3>{member.User?.name || member.user?.name || member.name || 'Unknown Doctor'}</h3>
              <p className="specialty">{member.specialty || 'General Practice'}</p>
              <p className="bio">{member.bio || 'No bio available'}</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/staff/${member.id}`, { state: { staff: member } })}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p>No staff members available</p>
        )}
      </div>
    </div>
  )
}

export default StaffListing
