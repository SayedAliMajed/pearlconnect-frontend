import React, { useState, useEffect, useContext } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ServiceForm from './ServiceForm';
import { AuthContext } from '../../contexts/AuthContext';

const ServiceManagement = () => {
  const { user } = useContext(AuthContext);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user) {
      loadServices();
    }
  }, [user]);

  const loadServices = async () => {
    try {
      setLoading(true);
      // Fetch services for this provider
      const response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/services?provider=${user.id || user._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Loaded services:', data);
        // API returns {services: [...], pagination: {...}}
        const servicesArray = data.services || data || [];
        setServices(Array.isArray(servicesArray) ? servicesArray : []);
      } else {
        console.error('Failed to load services');
        setServices([]);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(serviceId);
      const response = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setServices(services.filter(service => service._id !== serviceId));
      } else {
        alert('Failed to delete service. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    loadServices(); // Refresh the services list
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (loading) {
    return (
      <div className="service-management">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>Loading your services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-management">
      {/* Header */}
      <div className="services-header">
        <div className="header-content">
          <h3>My Services</h3>
          <p>Manage your service offerings</p>
        </div>
        <Button variant="primary" onClick={handleCreateService}>
          ➕ Add New Service
        </Button>
      </div>

      {/* Service Form Modal/Inline */}
      {showForm && (
        <div className="service-form-container">
          <ServiceForm
            service={editingService}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {/* Services List */}
      <div className="services-list">
        {services.length > 0 ? (
          services.map(service => (
            <Card key={service._id || service.id} className="service-item">
              <div className="service-content">
                <div className="service-info">
                  <h4>{service.title}</h4>
                  <p className="service-description">{service.description}</p>
                  <div className="service-meta">
                    <span className="service-category">{service.category}</span>
                    <span className="service-price">
                      {service.currency || 'BD'} {service.price}
                    </span>
                    <span className={`service-status ${service.active !== false ? 'active' : 'inactive'}`}>
                      {service.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="service-image">
                  {service.images && service.images.length > 0 ? (
                    <img
                      src={service.images[0].url || service.images[0]}
                      alt={service.images[0].alt || service.title}
                      className="service-thumbnail"
                    />
                  ) : (
                    <div className="no-image">📷</div>
                  )}
                </div>
              </div>

              <div className="service-actions">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => handleEditService(service)}
                >
                  ✏️ Edit
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteService(service._id || service.id)}
                  disabled={deletingId === (service._id || service.id)}
                >
                  {deletingId === (service._id || service.id) ? 'Deleting...' : '🗑️ Delete'}
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="no-services">
            <div className="no-services-content">
              <div className="no-services-icon">🛠️</div>
              <h4>No services yet</h4>
              <p>Get started by adding your first service offering.</p>
              <Button variant="primary" onClick={handleCreateService}>
                Create Your First Service
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagement;
