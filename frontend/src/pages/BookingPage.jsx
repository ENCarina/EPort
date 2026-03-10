import { useState, useEffect } from 'react'
import { staffAPI, slotAPI, bookingAPI } from '../services/api'
import { formatTimeOnly } from '../utils/formatTime'
import '../styles/booking.css'

const formatLocalDateKey = (dateValue) => {
  const date = new Date(dateValue)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getWeekStart = (dateValue) => {
  const date = new Date(dateValue)
  const weekday = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - weekday)
  date.setHours(0, 0, 0, 0)
  return date
}

const buildWeekDays = (weekStart) => {
  const days = []

  for (let i = 0; i < 7; i += 1) {
    const current = new Date(weekStart)
    current.setDate(weekStart.getDate() + i)
    days.push(current)
  }

  return days
}

const BookingPage = () => {
  const [staff, setStaff] = useState([])
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [slots, setSlots] = useState([])
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()))
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

      if (slotsData.length > 0) {
        setCurrentWeekStart(getWeekStart(slotsData[0].date))
      }
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

  const slotsByDate = slots.reduce((acc, slot) => {
    const dateKey = formatLocalDateKey(slot.date)
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(slot)
    return acc
  }, {})

  const weekDays = buildWeekDays(currentWeekStart)

  const weekLabel = `${weekDays[0].toLocaleDateString('hu-HU')} - ${weekDays[6].toLocaleDateString('hu-HU')}`

  const selectedSlotLabel = selectedSlot
    ? `${new Date(selectedSlot.date).toLocaleDateString('hu-HU')} ${formatTimeOnly(selectedSlot.startTime)}`
    : ''

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
            <h2>Step 2: Weekly Scheduler</h2>
            {slots.length > 0 ? (
              <>
                <div className="scheduler-toolbar">
                  <button
                    className="scheduler-nav-btn"
                    onClick={() => {
                      const prev = new Date(currentWeekStart)
                      prev.setDate(prev.getDate() - 7)
                      setCurrentWeekStart(prev)
                    }}
                  >
                    Előző hét
                  </button>
                  <h3>{weekLabel}</h3>
                  <button
                    className="scheduler-nav-btn"
                    onClick={() => setCurrentWeekStart(getWeekStart(new Date()))}
                  >
                    Ma
                  </button>
                  <button
                    className="scheduler-nav-btn"
                    onClick={() => {
                      const next = new Date(currentWeekStart)
                      next.setDate(next.getDate() + 7)
                      setCurrentWeekStart(next)
                    }}
                  >
                    Következő hét
                  </button>
                </div>

                <div className="week-scheduler-grid">
                  {weekDays.map((day) => {
                    const dayKey = formatLocalDateKey(day)
                    const daySlots = (slotsByDate[dayKey] || []).sort((a, b) => {
                      return String(a.startTime).localeCompare(String(b.startTime))
                    })

                    return (
                      <div key={dayKey} className="day-column">
                        <div className="day-column-header">
                          <h4>
                            {day.toLocaleDateString('hu-HU', { weekday: 'short' })}
                          </h4>
                          <p>{day.toLocaleDateString('hu-HU', { month: '2-digit', day: '2-digit' })}</p>
                          <span className="slot-badge">{daySlots.length} időpont</span>
                        </div>

                        <div className="day-column-slots">
                          {daySlots.length > 0 ? (
                            daySlots.map((slot) => (
                              <button
                                key={slot.id}
                                className={`slot-option scheduler-slot ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                                onClick={() => setSelectedSlot(slot)}
                              >
                                {formatTimeOnly(slot.startTime)}
                              </button>
                            ))
                          ) : (
                            <p className="no-day-slots">Nincs szabad időpont</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <p>No available slots for this professional</p>
            )}

            <div className="selected-slot-preview">
              {selectedSlot && <p>Kiválasztott időpont: {selectedSlotLabel}</p>}
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
