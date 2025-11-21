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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    if (service) {
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
      const existingImages = service.images || [];
      setImagePreview(existingImages.map(img => ({
        url: img.url || img,
        alt: img.alt || service.title,
        existing: true
      })));
    } else {
      setSelectedFiles([]);
      setImagePreview([]);
    }
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    const previewUrls = files.map(file => ({
      url: URL.createObjectURL(file),
      alt: file.name,
      existing: false
    }));
    setImagePreview(prev => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    const newPreview = [...imagePreview];
    if (!newPreview[index].existing) {
      URL.revokeObjectURL(newPreview[index].url);
      const fileIndex = newPreview.slice(0, index).filter(p => !p.existing).length;
      setSelectedFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    newPreview.splice(index, 1);
    setImagePreview(newPreview);
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
    if (!validateForm()) return;
    setLoading(true);

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        provider: user._id || user.id,
        providerName: user.username || user.name,
        active: formData.active,
        images: formData.images // Include existing images
      };

      // Handle category lookup
      if (formData.category && typeof formData.category === 'string') {
        const categoryObj = categories.find(cat => cat.name === formData.category);
        if (categoryObj) {
          serviceData.category = categoryObj._id || categoryObj.id;
        }
      }

      // Use JSON format - backend expects destructuring of req.body
      const formDataObj = JSON.stringify({
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price,
        provider: serviceData.provider,
        providerName: serviceData.providerName,
        active: serviceData.active,
        category: serviceData.category || '',
        currency: formData.currency,
        duration: formData.duration,
        // Include existing images as URLs
        images: serviceData.images || [],
        // Note: File uploads temporarily disabled until backend supports multipart
        // When re-enabling file uploads, backend needs to handle FormData properly
      });

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };

      // Warn about file uploads being skipped temporarily
      if (selectedFiles.length > 0) {
        console.warn('⚠️ File uploads temporarily disabled. Backend needs FormData support for image uploads.');
        console.warn('Images will be handled as URLs only until backend is updated.');
      }

      console.log('Sending service data: JSON format', {
        title: serviceData.title,
        descriptionLength: serviceData.description.length,
        price: serviceData.price,
        category: formData.category,
        provider: serviceData.provider,
        filesCount: selectedFiles.length,
        existingImages: serviceData.images.length,
        formattedAsJSON: true,
        authTokenExists: !!localStorage.getItem('token')
      });

      let response;
      if (service) {
        response = await fetch(`${import.meta.env.VITE_API_URL}/services/${service._id || service.id}`, {
          method: 'PUT',
          headers,
          body: formDataObj
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL}/services`, {
          method: 'POST',
          headers,
          body: formDataObj
        });
      }

      if (!response.ok) {
        let errorMessage = 'Unknown error';
        try {
          const error = await response.json();
          errorMessage = error.message || `HTTP ${response.status}: ${response.statusText}`;
          console.error('API Error Response:', error);
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          console.error('API Error (non-JSON):', response.status, response.statusText);
        }
        console.error(`Service ${service ? 'update' : 'creation'} failed:`, errorMessage);
        return;
      }

      const result = await response.json();
      const serviceId = result?._id || result?.id;
      console.log('✅ Service saved successfully:', { serviceId, title: result.title });
      onSuccess && onSuccess(result);
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ensure categories are loaded
  }, []);

  return (
    <Card className="service-form">
      <div className="form-header">
        <h3>{service ? 'Edit Service' : 'Create New Service'}</h3>
        <p>{service ? 'Update your service details' : 'Add a new service to your offerings'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-group">
              <label htmlFor="title">Service Title *</label>
              <Input id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} placeholder="e.g., Professional House Cleaning" error={!!errors.title} fullWidth />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your service in detail..." rows="4" className={`form-textarea ${errors.description ? 'error' : ''}`} />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              {categoriesLoading ? (
                <div style={{ padding: '8px', color: '#666' }}>Loading categories...</div>
              ) : categoriesError ? (
                <div style={{ padding: '8px', color: '#d32f2f' }}>Error loading categories. Please refresh and try again.</div>
              ) : (
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} className={`form-select ${errors.category ? 'error' : ''}`} disabled={categoriesLoading}>
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id || cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              )}
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>
          </div>

          <div className="form-section">
            <h4>Pricing</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="0.00" min="0" step="0.01" error={!!errors.price} />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="currency">Currency</label>
                <select id="currency" name="currency" value={formData.currency} onChange={handleInputChange} className="form-select">
                  <option value="BD">BD (Bahraini Dinar)</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duration (optional)</label>
              <Input id="duration" name="duration" type="text" value={formData.duration} onChange={handleInputChange} placeholder="e.g., 2-3 hours, 1 session" fullWidth />
            </div>
          </div>

          <div className="form-section">
            <h4>Service Images</h4>
            <div className="image-upload">
              <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
              <label htmlFor="images" className="upload-button">📷 Choose Images</label>
              <p className="upload-help">Upload up to 5 images. First image will be the main photo.</p>
            </div>
            {imagePreview.length > 0 && (
              <div className="image-preview">
                {imagePreview.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.url} alt={image.alt || `Service ${index + 1}`} className="preview-image" />
                    <button type="button" className="remove-image" onClick={() => removeImage(index)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-section">
            <h4>Settings</h4>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" name="active" checked={formData.active} onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))} />
                <span className="checkmark"></span>
                Service is active and available for booking
              </label>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ServiceForm;
