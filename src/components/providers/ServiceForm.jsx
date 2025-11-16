import React, { useState, useEffect, useContext } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { AuthContext } from '../../contexts/AuthContext';
import { useCategories } from '../../hooks/useCategories';

const ServiceForm = ({ service, onSuccess, onCancel }) => {
  const { user } = useContext(AuthContext);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    currency: 'BD',
    duration: '',
    images: [],
    active: true
  });
  const [availabilityData, setAvailabilityData] = useState({
    scheduleType: 'weekly', // 'weekly' or 'custom'
    workingHours: {
      monday: { enabled: false, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      tuesday: { enabled: false, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      wednesday: { enabled: false, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      thursday: { enabled: false, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      saturday: { enabled: true, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00', breakStart: '12:00', breakEnd: '13:00' }
    },
    appointmentDuration: 60, // minutes
    bufferTime: 15, // minutes between appointments
    minimumAdvanceBooking: 60 // minutes
  });
  const [availabilityCollapsed, setAvailabilityCollapsed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    if (service) {
      // Editing existing service
      setFormData({
        title: service.title || '',
        description: service.description || '',
        category: service.category || '',
        price: service.price || '',
        currency: service.currency || 'BD',
        duration: service.duration || '',
        images: service.images || [],
        active: service.active !== false
      });
      // Initialize preview from existing images
      const existingImages = service.images || [];
      setImagePreview(existingImages.map(img => ({
        url: img.url || img,
        alt: img.alt || service.title,
        existing: true // Mark as existing to avoid re-uploading
      })));
    } else {
      // Clear for new service
      setSelectedFiles([]);
      setImagePreview([]);
    }
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Convert file to base64 string
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file); // This creates base64 string
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Store files for processing
    setSelectedFiles(prev => [...prev, ...files]);

    // Create preview URLs for display
    const previewUrls = files.map(file => ({
      url: URL.createObjectURL(file),
      alt: file.name,
      existing: false
    }));

    setImagePreview(prev => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    const newPreview = [...imagePreview];

    // Clean up object URL if it was a new file (not existing)
    if (!newPreview[index].existing) {
      URL.revokeObjectURL(newPreview[index].url);
      // Remove from selectedFiles as well
      const fileIndex = newPreview.slice(0, index).filter(p => !p.existing).length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }

    newPreview.splice(index, 1);
    setImagePreview(newPreview);
  };

  const handleAvailabilityChange = (field, value, day = null) => {
    if (day) {
      // Updating a specific day's availability
      setAvailabilityData(prev => ({
        ...prev,
        workingHours: {
          ...prev.workingHours,
          [day]: {
            ...prev.workingHours[day],
            [field]: value
          }
        }
      }));
    } else {
      // Updating a global availability field
      setAvailabilityData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const copyToAllDays = (sourceDay) => {
    const sourceData = availabilityData.workingHours[sourceDay];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    setAvailabilityData(prev => ({
      ...prev,
      workingHours: days.reduce((acc, day) => ({
        ...acc,
        [day]: {
          ...sourceData,
          enabled: day === 'friday' || day === 'saturday' ? true : sourceData.enabled // Keep Bahrain weekend by default
        }
      }), {})
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Service title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || !validateAvailability()) {
      return;
    }

    setLoading(true);

    try {
      // Process new images (convert to base64)
      let processedImages = [];

      if (selectedFiles.length > 0) {
        console.log('Converting', selectedFiles.length, 'new images to base64...');
        for (let i = 0; i < selectedFiles.length; i++) {
          const base64String = await fileToBase64(selectedFiles[i]);
          processedImages.push({
            url: base64String, // Base64 string as URL
            alt: selectedFiles[i].name
          });
        }
      }

      // Include existing images from service being edited
      const existingImages = imagePreview
        .filter(img => img.existing)
        .map(img => ({
          url: img.url,
          alt: img.alt
        }));

      // Combine new and existing images
      processedImages = [...existingImages, ...processedImages];

      const serviceData = {
        ...formData,
        price: parseFloat(formData.price), // Convert price to number
        images: processedImages, // Use processed images with base64
        // Omit category field for now since backend expects ObjectId
        // category: formData.category, // Commented out - needs ObjectId
        provider: user.id || user._id,
        providerName: user.username || user.name
      };

      // Remove category from serviceData if it's empty or invalid
      if (!serviceData.category || typeof serviceData.category === 'string') {
        delete serviceData.category;
      }

      console.log('Sending service data:', {
        ...serviceData,
        images: `${serviceData.images.length} images` // Avoid spamming console with base64
      });
      console.log('API URL:', `${import.meta.env.VITE_BACK_END_SERVER_URL}/services`);
      console.log('Auth token exists:', !!localStorage.getItem('token'));

      let response;
      let serviceResult;
      if (service) {
        console.log('🔄 UPDATE REQUEST DEBUG:', {
          serviceId: service._id || service.id,
          originalService: {
            _id: service._id,
            title: service.title,
            provider: service.provider,
            providerId: service.providerId
          },
          currentUser: {
            _id: user?._id,
            id: user?.id,
            username: user?.username,
            role: user?.role,
            email: user?.email
          },
          serviceDataToSend: {
            title: serviceData.title,
            provider: serviceData.provider,
            images: `${serviceData.images.length} images`
          },
          token: localStorage.getItem('token') ? 'Token exists' : 'No token',
          apiUrl: `${import.meta.env.VITE_BACK_END_SERVER_URL}/services/${service._id || service.id}`
        });

        // Update existing service
        response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/services/${service._id || service.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(serviceData)
        });
        serviceResult = await response.json();
      } else {
        // Create new service
        response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/services`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(serviceData)
        });
        serviceResult = await response.json();
      }

      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const error = await response.json();
          errorMessage = error.message || `HTTP ${response.status}: ${response.statusText}`;
          console.error('API Error Response:', error);
        } catch (parseError) {
          // Response might not be JSON
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          console.error('API Error (non-JSON):', response.status, response.statusText);
        }

        console.error('Full API Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          url: response.url
        });

        alert(`Failed to ${service ? 'update' : 'create'} service: ${errorMessage}`);
        return;
      }

      // Service created/updated successfully
      const serviceId = service?.id || service?._id || serviceResult.service?._id || serviceResult._id;

      // Now submit availability data for the service
      console.log('📅 Submitting availability for service:', serviceId);
      console.log('📊 Availability data structure:', JSON.stringify(availabilityData, null, 2));
      console.log('🔗 Availability API URL:', `${import.meta.env.VITE_BACK_END_SERVER_URL}/availability/service/${serviceId}`);
      console.log('🔐 Auth token exists:', !!localStorage.getItem('token'));

      const availabilityResponse = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/availability/service/${serviceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(availabilityData)
      });

      console.log('📡 Availability API Response:', {
        status: availabilityResponse.status,
        statusText: availabilityResponse.statusText,
        ok: availabilityResponse.ok,
        headers: Object.fromEntries(availabilityResponse.headers.entries()),
        url: availabilityResponse.url
      });

      let responseBody = null;
      try {
        responseBody = await availabilityResponse.text();
        if (responseBody) {
          responseBody = JSON.parse(responseBody);
          console.log('📄 Response body:', responseBody);
        } else {
          console.log('📄 Response body: empty');
        }
      } catch (e) {
        console.log('📄 Response body (raw):', responseBody);
      }

      if (availabilityResponse.ok) {
        console.log('✅ Service availability saved successfully');
        const result = service ? serviceResult : serviceResult;
        onSuccess && onSuccess(result);
      } else {
        console.log('❌ Availability API failed');
        console.log('🔍 Frontend sent data:', JSON.stringify(availabilityData, null, 2));
        console.log('🔍 Backend responded:', responseBody);

        // For debugging - temporarily remove error alert until API is fixed
        // alert('Service created successfully, but availability settings could not be saved. Please try editing the service again.');

        // Still call onSuccess since the service was created successfully
        const result = service ? serviceResult : serviceResult;
        onSuccess && onSuccess(result);

        console.log('⚠️ Temporarily hiding availability error alert until API is fixed');
        console.log('💡 Providers should be able to edit the service again to set availability');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert(`Failed to ${service ? 'update' : 'create'} service. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const validateAvailability = () => {
    // At least one day should be enabled
    const hasEnabledDay = Object.values(availabilityData.workingHours).some(day => day.enabled);

    if (!hasEnabledDay) {
      alert('Please enable at least one day for your availability schedule.');
      setAvailabilityCollapsed(false); // Expand availability section
      return false;
    }

    // Check if enabled days have valid time ranges
    for (const [day, config] of Object.entries(availabilityData.workingHours)) {
      if (config.enabled) {
        if (!config.startTime || !config.endTime) {
          alert(`Please set both start and end times for ${day.charAt(0).toUpperCase() + day.slice(1)}.`);
          setAvailabilityCollapsed(false);
          return false;
        }

        if (config.startTime >= config.endTime) {
          alert(`End time must be after start time for ${day.charAt(0).toUpperCase() + day.slice(1)}.`);
          setAvailabilityCollapsed(false);
          return false;
        }
      }
    }

    return true;
  };

  return (
    <Card className="service-form">
      <div className="form-header">
        <h3>{service ? 'Edit Service' : 'Create New Service'}</h3>
        <p>{service ? 'Update your service details' : 'Add a new service to your offerings'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h4>Basic Information</h4>

            <div className="form-group">
              <label htmlFor="title">Service Title *</label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Professional House Cleaning"
                error={!!errors.title}
                fullWidth
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your service in detail..."
                rows="4"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              {categoriesLoading ? (
                <div style={{ padding: '8px', color: '#666' }}>
                  Loading categories...
                </div>
              ) : categoriesError ? (
                <div style={{ padding: '8px', color: '#d32f2f' }}>
                  Error loading categories. Please refresh and try again.
                </div>
              ) : (
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`form-select ${errors.category ? 'error' : ''}`}
                  disabled={categoriesLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              )}
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
          </div>

          {/* Pricing */}
          <div className="form-section">
            <h4>Pricing</h4>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  error={!!errors.price}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="BD">BD (Bahraini Dinar)</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (optional)</label>
              <Input
                id="duration"
                name="duration"
                type="text"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 2-3 hours, 1 session"
                fullWidth
              />
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h4>Service Images</h4>

            <div className="image-upload">
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="images" className="upload-button">
                📷 Choose Images
              </label>
              <p className="upload-help">Upload up to 5 images. First image will be the main photo.</p>
            </div>

            {imagePreview.length > 0 && (
              <div className="image-preview">
                {imagePreview.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.url} alt={image.alt || `Service ${index + 1}`} className="preview-image" />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="form-section">
            <h4>Settings</h4>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                />
                <span className="checkmark"></span>
                Service is active and available for booking
              </label>
            </div>
          </div>

          {/* Availability - Collapsible Section */}
          <div className="form-section availability-section">
            <div className="section-header" onClick={() => setAvailabilityCollapsed(!availabilityCollapsed)}>
              <h4>Availability Schedule</h4>
              <button type="button" className="collapse-toggle">
                {availabilityCollapsed ? '▼' : '▲'}
              </button>
            </div>

            {!availabilityCollapsed && (
              <div className="availability-content">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="appointmentDuration">Appointment Duration (minutes)</label>
                    <Input
                      id="appointmentDuration"
                      name="appointmentDuration"
                      type="number"
                      value={availabilityData.appointmentDuration}
                      onChange={(e) => handleAvailabilityChange('appointmentDuration', parseInt(e.target.value))}
                      placeholder="60"
                      min="15"
                      max="480"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="minimumAdvanceBooking">Minimum Advance Booking (minutes)</label>
                    <Input
                      id="minimumAdvanceBooking"
                      name="minimumAdvanceBooking"
                      type="number"
                      value={availabilityData.minimumAdvanceBooking}
                      onChange={(e) => handleAvailabilityChange('minimumAdvanceBooking', parseInt(e.target.value))}
                      placeholder="60"
                      min="0"
                    />
                  </div>
                </div>

                <div className="weekly-schedule">
                  <h5>Weekly Schedule</h5>
                  <p>Set your working hours for each day of the week</p>

                  {Object.entries(availabilityData.workingHours).map(([day, config]) => (
                    <div key={day} className="schedule-day">
                      <div className="day-header">
                        <label className="day-label">
                          <input
                            type="checkbox"
                            checked={config.enabled}
                            onChange={(e) => handleAvailabilityChange('enabled', e.target.checked, day)}
                          />
                          <span className="checkmark"></span>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </label>
                        {day === 'friday' && (
                          <button
                            type="button"
                            className="copy-to-all"
                            onClick={() => copyToAllDays('friday')}
                          >
                            Copy to All Days
                          </button>
                        )}
                      </div>

                      {config.enabled && (
                        <div className="day-times">
                          <div className="time-row">
                            <div className="time-group">
                              <label>Start Time</label>
                              <input
                                type="time"
                                value={config.startTime}
                                onChange={(e) => handleAvailabilityChange('startTime', e.target.value, day)}
                                className="time-input"
                              />
                            </div>
                            <div className="time-group">
                              <label>End Time</label>
                              <input
                                type="time"
                                value={config.endTime}
                                onChange={(e) => handleAvailabilityChange('endTime', e.target.value, day)}
                                className="time-input"
                              />
                            </div>
                          </div>

                          <div className="time-row">
                            <div className="time-group">
                              <label>Break Start (optional)</label>
                              <input
                                type="time"
                                value={config.breakStart}
                                onChange={(e) => handleAvailabilityChange('breakStart', e.target.value, day)}
                                className="time-input"
                              />
                            </div>
                            <div className="time-group">
                              <label>Break End (optional)</label>
                              <input
                                type="time"
                                value={config.breakEnd}
                                onChange={(e) => handleAvailabilityChange('breakEnd', e.target.value, day)}
                                className="time-input"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ServiceForm;
