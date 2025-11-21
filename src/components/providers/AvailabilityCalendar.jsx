import React, { useState, useEffect, useContext } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AuthContext } from '../../contexts/AuthContext';

const AvailabilityCalendar = () => {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState(null);
  const [editingDaySchedule, setEditingDaySchedule] = useState(null);

  const [dayForm, setDayForm] = useState({
    dayOfWeek: 0,
    isEnabled: true,
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    slotDuration: 60,
    bufferTime: 0,
    breakTimes: []
  });

  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Bahrain weekend constants
  const WORK_DAYS = [0, 1, 2, 3, 4]; // Sunday to Thursday
  const WEEKEND_DAYS = [5, 6]; // Friday to Saturday

  // Convert time string to minutes for comparison
  const timeToMinutes = (timeStr) => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return 0;

    let [, hours, minutes, ampm] = match;
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    if (ampm.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };





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
        setAvailability(data);
      } else if (response.status === 404) {
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
    if (expandedDay === dayOfWeek) {
      setExpandedDay(null);
      return;
    }

    setFormError('');

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
    setExpandedDay(dayOfWeek);
  };

  const handleDayFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDayForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateTimes = () => {
    if (!dayForm.startTime || !dayForm.endTime) {
      return 'Please fill in both opening and closing times.';
    }

    const startMin = timeToMinutes(dayForm.startTime);
    const endMin = timeToMinutes(dayForm.endTime);

    if (startMin >= endMin) {
      return 'Closing time must be after opening time.';
    }

    if (endMin - startMin < 30) {
      return 'Please schedule at least 30 minutes for your availability.';
    }

    return null;
  };

  const handleSaveDaySchedule = async () => {
    if (saving) return; // Prevent double clicks

    try {
      setSaving(true);
      setFormError('');

      // Enhanced validation
      const timeError = validateTimes();
      if (timeError) {
        setFormError(timeError);
        return;
      }

      const providerId = user._id || user.id;
      const currentSchedules = availability?.schedules || [];

      // Filter out the one we're updating
      const filteredSchedules = currentSchedules.filter(sch => sch.dayOfWeek !== dayForm.dayOfWeek);
      const updatedSchedules = [...filteredSchedules];

      if (dayForm.isEnabled) {
        updatedSchedules.push({
          dayOfWeek: dayForm.dayOfWeek,
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

      // Debug logging for troubleshooting
      console.log('Sending availability data:', {
        schedulesCount: updatedSchedules.length,
        currentDayOfWeek: dayForm.dayOfWeek,
        schedules: updatedSchedules
      });

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
        await loadAvailability();
        setExpandedDay(null);
        setEditingDaySchedule(null);
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.err || errorData.message || 'Unknown error';

        console.warn('Backend schedule restriction:', {
          dayOfWeek: dayForm.dayOfWeek,
          dayName: dayNames[dayForm.dayOfWeek],
          attempt: 'schedule_update',
          error: errorMessage
        });

        if (errorMessage.toLowerCase().includes('time') && errorMessage.toLowerCase().includes('change')) {
          setFormError('NOTE: Time changes are currently restricted by backend settings. Contact support if you need to modify times.');
        } else if (errorMessage.toLowerCase().includes('sunday') || errorMessage.toLowerCase().includes('monday')) {
          setFormError(`NOTE: Updates for ${dayNames[dayForm.dayOfWeek]} are currently restricted. Contact support for assistance.`);
        } else {
          setFormError(`Failed to save schedule: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      setFormError('Failed to save schedule. Please try again.');
    } finally {
      setSaving(false);
    }
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

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="availability-calendar">
      <div className="calendar-header">
        <div className="header-content">
          <h3>Set Your Weekly Availability</h3>
          <p>Configure your working hours for each day that apply to all your services</p>
        </div>
      </div>

      <div className="weekly-schedule">
        {dayNames.map((dayName, dayOfWeek) => {
          const schedule = availability?.schedules?.find(sch => sch.dayOfWeek === dayOfWeek);
          const isEnabled = schedule && schedule.isEnabled !== false;
          const isExpanded = expandedDay === dayOfWeek;

          return (
            <Card key={dayOfWeek} className={`day-schedule-card ${!isEnabled ? 'disabled' : ''} ${isExpanded ? 'expanded' : ''}`} onClick={() => handleDaySelect(dayOfWeek)}>
              <div className="day-header">
                <h4>{dayName}</h4>
                {!isEnabled && <span className="day-disabled">Unscheduled</span>}
              </div>

              {isEnabled && schedule ? (
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

              {isExpanded && (
                <div className="inline-day-form" onClick={(e) => e.stopPropagation()}>
                  {formError && (
                    <div className="inline-error-message">
                      <span className="error-icon">⚠️</span> {formError}
                    </div>
                  )}

                  <div className="inline-form-group checkbox-group">
                    <label className="inline-checkbox-label">
                      <input
                        type="checkbox"
                        name="isEnabled"
                        checked={dayForm.isEnabled}
                        onChange={handleDayFormChange}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="checkmark"></span>
                      This day is available for bookings
                    </label>
                  </div>

                  {dayForm.isEnabled && (
                    <div className="inline-form-content">
                      <div className="inline-form-row">
                        <div className="inline-form-group">
                          <label htmlFor="startTime">Opening Time *</label>
                          <select
                            id="startTime"
                            name="startTime"
                            value={dayForm.startTime}
                            onChange={handleDayFormChange}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-form-input"
                            disabled={saving}
                          >
                            {['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'].map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                        <div className="inline-form-group">
                          <label htmlFor="endTime">Closing Time *</label>
                          <select
                            id="endTime"
                            name="endTime"
                            value={dayForm.endTime}
                            onChange={handleDayFormChange}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-form-input"
                            disabled={saving}
                          >
                            {['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'].map(time => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="inline-form-row">
                        <div className="inline-form-group">
                          <label htmlFor="slotDuration">Service Duration (minutes)</label>
                          <select
                            id="slotDuration"
                            name="slotDuration"
                            value={dayForm.slotDuration}
                            onChange={handleDayFormChange}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-form-input"
                            disabled={saving}
                          >
                            <option value="30">30 min</option>
                            <option value="45">45 min</option>
                            <option value="60">60 min</option>
                            <option value="90">90 min</option>
                            <option value="120">120 min</option>
                          </select>
                        </div>
                        <div className="inline-form-group">
                          <label htmlFor="bufferTime">Buffer Time (minutes)</label>
                          <select
                            id="bufferTime"
                            name="bufferTime"
                            value={dayForm.bufferTime}
                            onChange={handleDayFormChange}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-form-input"
                            disabled={saving}
                          >
                            <option value="0">0 min</option>
                            <option value="15">15 min</option>
                            <option value="30">30 min</option>
                            <option value="60">60 min</option>
                          </select>
                        </div>
                      </div>
                      <div className="inline-form-actions">
                        <Button
                          variant="secondary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedDay(null);
                            setEditingDaySchedule(null);
                            setFormError('');
                          }}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveDaySchedule();
                          }}
                          disabled={saving}
                        >
                          {saving ? 'Saving...' : editingDaySchedule ? 'Update' : 'Save'} Schedule
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

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
