import React, { useState, useEffect, useContext } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext';

const AvailabilityCalendar = () => {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTimeForm, setShowTimeForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [timeForm, setTimeForm] = useState({
    startTime: '',
    endTime: '',
    breakStart: '',
    breakEnd: '',
    isRecurring: false
  });

  useEffect(() => {
    if (user) {
      loadAvailability();
    }
  }, [user]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/providers/availability`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailability(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to load availability');
        setAvailability([]);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // Check if there's existing availability for this date
    const existingSlot = availability.find(slot => {
      const slotDate = new Date(slot.date);
      return slotDate.toDateString() === date.toDateString();
    });

    if (existingSlot) {
      setEditingSlot(existingSlot);
      setTimeForm({
        startTime: existingSlot.startTime || '',
        endTime: existingSlot.endTime || '',
        breakStart: existingSlot.breakStart || '',
        breakEnd: existingSlot.breakEnd || '',
        isRecurring: existingSlot.isRecurring || false
      });
    } else {
      setEditingSlot(null);
      setTimeForm({
        startTime: '09:00',
        endTime: '17:00',
        breakStart: '12:00',
        breakEnd: '13:00',
        isRecurring: false
      });
    }
    setShowTimeForm(true);
  };

  const handleTimeFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTimeForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveTimeSlot = async () => {
    try {
      const slotData = {
        provider: user.id || user._id,
        date: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD format
        startTime: timeForm.startTime,
        endTime: timeForm.endTime,
        breakStart: timeForm.breakStart,
        breakEnd: timeForm.breakEnd,
        isRecurring: timeForm.isRecurring
      };

      let response;
      if (editingSlot) {
        // Update existing slot
        response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/providers/availability/${editingSlot._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(slotData)
        });
      } else {
        // Create new slot
        response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/providers/availability`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(slotData)
        });
      }

      if (response.ok) {
        const result = await response.json();
        loadAvailability(); // Refresh the list
        setShowTimeForm(false);
        setEditingSlot(null);
      } else {
        const error = await response.json();
        alert(`Failed to ${editingSlot ? 'update' : 'create'} availability: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      alert(`Failed to ${editingSlot ? 'update' : 'create'} availability. Please try again.`);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this availability slot?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/providers/availability/${slotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        loadAvailability(); // Refresh the list
      } else {
        alert('Failed to delete availability slot. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      alert('Failed to delete availability slot. Please try again.');
    }
  };

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const calendarDays = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const dayAvailability = availability.find(slot => {
        const slotDate = new Date(slot.date);
        return slotDate.toDateString() === currentDate.toDateString();
      });

      calendarDays.push({
        date: new Date(currentDate),
        availability: dayAvailability,
        isCurrentMonth: currentDate.getMonth() === currentMonth,
        isToday: currentDate.toDateString() === today.toDateString()
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return calendarDays;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!user) {
    return (
      <div className="availability-calendar">
        <p>Please sign in to manage your availability.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="availability-calendar">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading your availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="availability-calendar">
      {/* Header */}
      <div className="calendar-header">
        <div className="header-content">
          <h3>Set Your Availability</h3>
          <p>Manage your working hours and time slots for customer bookings</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowTimeForm(true)}
        >
          ➕ Add Time Slot
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        {/* Month Navigation */}
        <div className="calendar-nav">
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate);
            }}
          >
            ‹ Previous
          </Button>
          <h4>
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          <Button
            variant="secondary"
            size="small"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate);
            }}
          >
            Next ›
          </Button>
        </div>

        {/* Day Headers */}
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-header-cell">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {renderCalendar().map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''} ${day.availability ? 'has-availability' : ''}`}
              onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
            >
              <div className="day-number">{day.date.getDate()}</div>
              {day.availability && (
                <div className="day-availability">
                  <div className="time-slot">
                    {formatTime(day.availability.startTime)} - {formatTime(day.availability.endTime)}
                  </div>
                  {day.availability.breakStart && (
                    <div className="break-time">
                      Break: {formatTime(day.availability.breakStart)} - {formatTime(day.availability.breakEnd)}
                    </div>
                  )}
                  {day.availability.isRecurring && (
                    <div className="recurring-badge">🔄</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time Slot Form Modal */}
      {showTimeForm && (
        <div className="time-form-overlay">
          <Card className="time-form-modal">
            <div className="form-header">
              <h4>
                {editingSlot ? 'Edit' : 'Add'} Availability for {selectedDate.toLocaleDateString()}
              </h4>
            </div>

            <div className="form-content">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startTime">Start Time *</label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={timeForm.startTime}
                    onChange={handleTimeFormChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">End Time *</label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={timeForm.endTime}
                    onChange={handleTimeFormChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="breakStart">Break Start (optional)</label>
                  <input
                    id="breakStart"
                    name="breakStart"
                    type="time"
                    value={timeForm.breakStart}
                    onChange={handleTimeFormChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="breakEnd">Break End (optional)</label>
                  <input
                    id="breakEnd"
                    name="breakEnd"
                    type="time"
                    value={timeForm.breakEnd}
                    onChange={handleTimeFormChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={timeForm.isRecurring}
                    onChange={handleTimeFormChange}
                  />
                  <span className="checkmark"></span>
                  Make this a recurring weekly schedule
                </label>
              </div>
            </div>

            <div className="form-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowTimeForm(false);
                  setEditingSlot(null);
                }}
              >
                Cancel
              </Button>
              {editingSlot && (
                <Button
                  variant="danger"
                  onClick={() => handleDeleteSlot(editingSlot._id)}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="primary"
                onClick={handleSaveTimeSlot}
              >
                {editingSlot ? 'Update' : 'Save'} Availability
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Existing Availability List */}
      <div className="availability-list">
        <h4>Your Current Availability</h4>
        {availability.length > 0 ? (
          availability.map(slot => (
            <Card key={slot._id} className="availability-item">
              <div className="availability-info">
                <div className="availability-date">
                  📅 {new Date(slot.date).toLocaleDateString()}
                </div>
                <div className="availability-times">
                  🕐 {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  {slot.breakStart && (
                    <span className="break-info">
                      (Break: {formatTime(slot.breakStart)} - {formatTime(slot.breakEnd)})
                    </span>
                  )}
                  {slot.isRecurring && <span className="recurring-info">🔄 Weekly</span>}
                </div>
              </div>
              <div className="availability-actions">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    setSelectedDate(new Date(slot.date));
                    setEditingSlot(slot);
                    setTimeForm({
                      startTime: slot.startTime || '',
                      endTime: slot.endTime || '',
                      breakStart: slot.breakStart || '',
                      breakEnd: slot.breakEnd || '',
                      isRecurring: slot.isRecurring || false
                    });
                    setShowTimeForm(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteSlot(slot._id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="no-availability">No availability set yet. Click "Add Time Slot" to get started.</p>
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
