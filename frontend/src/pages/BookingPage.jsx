import { useState, useEffect } from 'react'
import { staffAPI, slotAPI, bookingAPI } from '../services/api'
import { formatTimeOnly, formatDateTime } from '../utils/formatTime'
import '../styles/booking.css'

const BookingPage = () => {
  const [staff, setStaff] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const staffRes = await staffAPI.getStaff()
      console.log('Staff response:', staffRes.data)
      const staffData = staffRes.data.data || staffRes.data || []
      console.log('Staff data:', staffData)
      if (staffData.length > 0) {
        setStaff(staffData)
        setError('')
      } else {
        setError('No staff members available')
      }
      setLoading(false)
    } catch (err) {
      setError(`Failed to load staff: ${err.message}`)
      console.error('Staff error:', err)
      setLoading(false)
    }
  }

  const handleStaffSelect = async (staffMember) => {
    setSelectedStaff(staffMember)
    setSelectedSlot(null)
    try {
      const slotsRes = await slotAPI.getSlots(staffMember.id)
      console.log('Slots response:', slotsRes.data)
      const slotsData = slotsRes.data.data || slotsRes.data || []
      setSlots(slotsData)
    } catch (err) {
      setError('Failed to load slots')
      console.error('Slots error:', err)
    }
  }

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
      setSelectedStaff(null)
      setSelectedSlot(null)
      setNotes('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="booking-page">
      <h1>Book an Appointment</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="booking-steps">
        <div className="step">
          <h2>Step 1: Select a Healthcare Professional</h2>
          <div className="staff-selection">
            {staff.length > 0 ? (
              staff.map((member) => (
                <div
                  key={member.id}
                  className={`staff-option ${selectedStaff?.id === member.id ? 'selected' : ''}`}
                  onClick={() => handleStaffSelect(member)}
                >
                  <h4>{member.User?.name || member.user?.name || member.name || 'Unknown'}</h4>
                  <p>{member.specialty || 'General Practice'}</p>
                </div>
              ))
            ) : (
              <p>No staff members available</p>
            )}
          </div>
        </div>

        {selectedStaff && (
          <div className="step">
            <h2>Step 2: Select a Time Slot</h2>
            <div className="slots-selection">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <button
                    key={slot.id}
                    className={`slot-option ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {formatDateTime(slot.date, slot.startTime)}
                  </button>
                ))
              ) : (
                <p>No available slots for this professional</p>
              )}
            </div>
          </div>
        )}

        {selectedSlot && (
          <div className="step">
            <h2>Step 3: Add Notes (Optional)</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about your consultation..."
              rows="4"
            />
          </div>
        )}

        {selectedSlot && (
          <button
            className="btn btn-primary btn-large"
            onClick={handleBooking}
            disabled={bookingLoading}
          >
            {bookingLoading ? 'Booking...' : 'Confirm Booking'}
          </button>
        )}
      </div>
    </div>
  )
}

export default BookingPage
