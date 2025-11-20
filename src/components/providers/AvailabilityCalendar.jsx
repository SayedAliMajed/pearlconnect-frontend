import React, { useState, useEffect, useContext } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext';

const AvailabilityCalendar = () => {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDayForm, setShowDayForm] = useState(false);
  const [editingDaySchedule, setEditingDaySchedule] = useState(null);

  // Form for editing daily schedule - matches backend 12-hour format
  const [dayForm, setDayForm] = useState({
    dayOfWeek: 1,
    isEnabled: true,
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    slotDuration: 60,
    bufferTime: 0,
    breakTimes: []
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      loadAvailability();
    }
  }, [user]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const providerId = user._id || user.id;
      const response = await fetch(`${import.meta.env.VITE_API_URL}/availability/provider/${providerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailability(data); // Backend returns single availability object
      } else if (response.status === 404) {
        // No availability set yet - create default structure
        setAvailability({
          providerId,
          schedules: [],
          exceptions: [],
          timezone: 'Asia/Bahrain',
          advanceBookingDays: 30
        });
      } else {
        console.error('Failed to load availability');
        setAvailability(null);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDaySelect = (dayOfWeek) => {
    setFormError('');

    // Find existing schedule for this day
    const existingSchedule = availability?.schedules?.find(sch => sch.dayOfWeek === dayOfWeek);

    if (existingSchedule) {
      setEditingDaySchedule(existingSchedule);
      setDayForm({
        dayOfWeek,
        isEnabled: existingSchedule.isEnabled !== false,
        startTime: existingSchedule.startTime || '09:00 AM',
        endTime: existingSchedule.endTime || '05:00 PM',
        slotDuration: existingSchedule.slotDuration || 60,
        bufferTime: existingSchedule.bufferTime || 0,
        breakTimes: existingSchedule.breakTimes || []
      });
    } else {
      setEditingDaySchedule(null);
      setDayForm({
        dayOfWeek,
        isEnabled: true,
        startTime: '09:00 AM',
        endTime: '05:00 PM',
        slotDuration: 60,
        bufferTime: 0,
        breakTimes: []
      });
    }
    setShowDayForm(true);
  };

  const handleDayFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDayForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveDaySchedule = async () => {
    try {
      setFormError('');

      // Basic validation
      if (!dayForm.startTime || !dayForm.endTime) {
        setFormError('Please fill in both opening and closing times.');
        return;
      }

      // Backend expects the entire availability object to be sent
      const providerId = user._id || user.id;
      const currentSchedules = availability?.schedules || [];

      // Create updated schedule with the new day
      const updatedSchedules = [...currentSchedules.filter(sch => sch.dayOfWeek !== dayForm.dayOfWeek)];

      if (dayForm.isEnabled) {
        updatedSchedules.push({
          dayOfWeek: dayForm.dayOfWeek,
          isEnabled: dayForm.isEnabled,
          startTime: dayForm.startTime,
          endTime: dayForm.endTime,
          slotDuration: parseInt(dayForm.slotDuration),
          bufferTime: parseInt(dayForm.bufferTime),
          breakTimes: dayForm.breakTimes || []
        });
      }

      const availabilityData = {
        schedules: updatedSchedules,
        exceptions: availability?.exceptions || [],
        timezone: availability?.timezone || 'Asia/Bahrain',
        advanceBookingDays: availability?.advanceBookingDays || 30
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/availability/provider/${providerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(availabilityData)
      });

      if (response.ok) {
        const result = await response.json();
        loadAvailability();
        setShowDayForm(false);
        setEditingDaySchedule(null);
      } else {
        const error = await response.json();
        setFormError(`Failed to save schedule: ${error.err || error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      setFormError('Failed to save schedule. Please try again.');
    }
  };

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendarDays = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
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

  // Day names for display
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="availability-calendar">
      <div className="calendar-header">
        <div className="header-content">
          <h3>Set Your Weekly Availability</h3>
          <p>Configure your working hours for each day that apply to all your services</p>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="weekly-schedule">
        {dayNames.map((dayName, dayOfWeek) => {
          const schedule = availability?.schedules?.find(sch => sch.dayOfWeek === dayOfWeek);
          const isEnabled = schedule?.isEnabled !== false;

          return (
            <Card key={dayOfWeek} className={`day-schedule-card ${!isEnabled ? 'disabled' : ''}`} onClick={() => handleDaySelect(dayOfWeek)}>
              <div className="day-header">
                <h4>{dayName}</h4>
                {!isEnabled && <span className="day-disabled">Unscheduled</span>}
              </div>

              {isEnabled ? (
                <div className="day-times">
                  <div className="time-range">
                    {schedule.startTime} - {schedule.endTime}
                  </div>
                  {schedule.breakTimes && schedule.breakTimes.length > 0 && (
                    <div className="break-info">
                      Break: {schedule.breakTimes[0].startTime} - {schedule.breakTimes[0].endTime}
                    </div>
                  )}
                  <div className="slot-info">
                    {schedule.slotDuration}min slots • {schedule.bufferTime}min buffer
                  </div>
                </div>
              ) : (
                <div className="day-times disabled">
                  <div>Click to set availability</div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Day Edit Modal */}
      {showDayForm && (
        <div className="time-form-overlay">
          <Card className="time-form-modal">
            <div className="form-header">
              <h4>{editingDaySchedule ? 'Edit' : 'Set'} {dayNames[dayForm.dayOfWeek]} Schedule</h4>
            </div>
            {formError && (
              <div className="form-error-message">
                <span className="error-icon">⚠️</span> {formError}
              </div>
            )}
            <div className="form-content">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" name="isEnabled" checked={dayForm.isEnabled} onChange={handleDayFormChange} />
                  <span className="checkmark"></span>
                  This day is available for bookings
                </label>
              </div>

              {dayForm.isEnabled && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="startTime">Opening Time *</label>
                      <select id="startTime" name="startTime" value={dayForm.startTime} onChange={handleDayFormChange} className="form-input">
                        {['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="endTime">Closing Time *</label>
                      <select id="endTime" name="endTime" value={dayForm.endTime} onChange={handleDayFormChange} className="form-input">
                        {['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'].map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="slotDuration">Service Duration (minutes)</label>
                      <select id="slotDuration" name="slotDuration" value={dayForm.slotDuration} onChange={handleDayFormChange} className="form-input">
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                        <option value="90">90 min</option>
                        <option value="120">120 min</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="bufferTime">Buffer Time (minutes)</label>
                      <select id="bufferTime" name="bufferTime" value={dayForm.bufferTime} onChange={handleDayFormChange} className="form-input">
                        <option value="0">0 min</option>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="60">60 min</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="form-actions">
              <Button variant="secondary" onClick={() => { setShowDayForm(false); setEditingDaySchedule(null); setFormError(''); }}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveDaySchedule}>{editingDaySchedule ? 'Update' : 'Save'} Schedule</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Settings Summary */}
      {availability && (
        <div className="availability-settings">
          <Card className="settings-card">
            <h4>Current Settings</h4>
            <div className="settings-grid">
              <div className="setting-item">
                <label>Timezone:</label>
                <span>{availability.timezone || 'Asia/Bahrain'}</span>
              </div>
              <div className="setting-item">
                <label>Advance Booking:</label>
                <span>{availability.advanceBookingDays || 30} days</span>
              </div>
              <div className="setting-item">
                <label>Active Days:</label>
                <span>{availability.schedules?.filter(sch => sch.isEnabled !== false).length || 0} of 7</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
