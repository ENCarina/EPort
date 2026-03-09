import { useEffect, useState } from 'react'
import { bookingAPI } from '../services/api'
import { formatDateTime } from '../utils/formatTime'
import '../styles/booking.css'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getBookings()
      console.log('Full bookings response:', response)
      console.log('Bookings data:', response.data)
      const bookingsData = response.data.data || response.data || []
      console.log('Processed bookings:', bookingsData)
      setBookings(bookingsData)
    } catch (err) {
      setError('Failed to load bookings')
      console.error('Bookings error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    try {
      await bookingAPI.deleteBooking(id)
      setBookings(bookings.filter(b => b.id !== id))
    } catch (err) {
      setError('Failed to cancel booking')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="bookings-container">
      <h1>My Appointments</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="bookings-list">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h3>{booking.doctor?.User?.name || booking.staffName || 'Staff Member'}</h3>
              <p className="specialty">{booking.doctor?.specialty || 'General Practice'}</p>
              <p className="consultation">{booking.type?.name || 'Consultation'}</p>
              <p className="date-time">
                {booking.Slot?.date && booking.Slot?.startTime
                  ? formatDateTime(booking.Slot.date, booking.Slot.startTime)
                  : new Date(booking.startTime || booking.createdAt).toLocaleString()}
              </p>
              <p className="status">Status: {booking.status || 'Scheduled'}</p>
              {booking.type?.price && <p className="price">Price: {booking.type.price} Ft</p>}
              {booking.notes && <p className="notes">Notes: {booking.notes}</p>}
              <button
                className="btn btn-danger"
                onClick={() => handleCancelBooking(booking.id)}
              >
                Cancel Appointment
              </button>
            </div>
          ))
        ) : (
          <p>No appointments scheduled</p>
        )}
      </div>
    </div>
  )
}

export default MyBookings
