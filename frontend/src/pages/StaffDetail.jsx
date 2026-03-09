import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { staffAPI, slotAPI, bookingAPI } from '../services/api'
import { formatTimeOnly } from '../utils/formatTime'
import '../styles/detail.css'

const StaffDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [staff, setStaff] = useState(location.state?.staff || null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    // Always fetch slots, even if we have staff from navigation
    const loadData = async () => {
      try {
        console.log('Loading data for staff ID:', id)
        
        // Fetch staff if not already loaded
        if (!staff) {
          const staffRes = await staffAPI.getStaffDetail(id)
          console.log('Staff detail response', staffRes.data)
          const staffData = staffRes.data.data || staffRes.data || null
          setStaff(staffData)
        }
        
        // Always fetch slots for this staff member
        const slotsRes = await slotAPI.getSlots(id)
        console.log('Slots response', slotsRes.data)
        const slotsArray = slotsRes.data.data || slotsRes.data || []
        console.log('Slots array length:', slotsArray.length)
        setSlots(slotsArray)
      } catch (err) {
        setError('Failed to load data')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [id])


  const handleBooking = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot')
      return
    }

    setBookingLoading(true)
    try {
      await bookingAPI.createBooking({
        slotId: selectedSlot.id,
        notes: notes,
      })
      alert('Appointment booked successfully!')
      navigate('/my-bookings')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  if (!staff) return <div className="error-message">Staff member not found</div>

  return (
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="btn-back">← Back</button>

      <div className="detail-content">
        <h1>{staff.User?.name || staff.user?.name || staff.name || 'Unknown Doctor'}</h1>
        <p className="specialty">{staff.specialty || 'General Practice'}</p>
        <p className="bio">{staff.bio || 'No bio available'}</p>

        {error && <div className="error-message">{error}</div>}

        <div className="booking-section">
          <h2>Book an Appointment</h2>

          <div className="form-group">
            <label>Available Time Slots</label>
            <div className="slots-list">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <button
                    key={slot.id}
                    className={`slot-option ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot.date} at {formatTimeOnly(slot.startTime)}
                  </button>
                ))
              ) : (
                <p>No available slots</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about your consultation..."
              rows="4"
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleBooking}
            disabled={bookingLoading || !selectedSlot}
          >
            {bookingLoading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StaffDetail
