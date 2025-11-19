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
      // Use the most compatible ID format (try multiple)
      const providerId = user._id || user.id;
      console.log('Loading services for provider:', providerId);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/services?provider=${providerId}`, {
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

        // Fix provider field inconsistency - ensure it's an object
        const normalizedServices = servicesArray.map(service => ({
          ...service,
          provider: typeof service.provider === 'object'
            ? service.provider
            : { _id: providerId, email: user.email, name: user.username }
        }));

        setServices(Array.isArray(normalizedServices) ? normalizedServices : []);
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

      // Find the service being deleted for debugging
      const serviceToDelete = services.find(s => s._id === serviceId || s.id === serviceId);
      console.log('🔍 DELETE REQUEST DEBUG:', {
        serviceId,
        serviceToDelete: {
          _id: serviceToDelete?._id,
          title: serviceToDelete?.title,
          provider: serviceToDelete?.provider,
          providerId: serviceToDelete?.providerId,
          fullProviderObj: serviceToDelete?.provider
        },
        currentUser: {
          _id: user?._id,
          id: user?.id,
          username: user?.username,
          role: user?.role,
          email: user?.email
        },
        ownershipCheck: `service.provider === user._id → ${serviceToDelete?.provider} === ${user?._id} = ${serviceToDelete?.provider === user?._id}`,
        ownershipCheckByEmail: `service.provider.email === user.email → ${serviceToDelete?.provider?.email} === ${user?.email} = ${serviceToDelete?.provider?.email === user?.email}`,
        token: localStorage.getItem('token') ? 'Token exists (length: ' + localStorage.getItem('token').length + ')' : 'No token',
        apiUrl: `${import.meta.env.VITE_API_URL}/services/${serviceId}`
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🗑️ DELETE RESPONSE:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        console.log('✅ Service deleted successfully');
        setServices(services.filter(service => service._id !== serviceId));
      } else {
        let errorDetails = 'Unknown error';
        try {
          const errorText = await response.text();
          errorDetails = errorText || `Status ${response.status}`;
        } catch (e) {
          console.error('Could not read error response');
        }

        console.error('❌ Delete failed:', errorDetails);
        alert(`Failed to delete service: ${errorDetails}`);
      }
    } catch (error) {
      console.error('💥 Error deleting service:', error);
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

  // Error boundary - prevent white screen
  try {
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
        {console.log('ServiceManagement - services count:', services.length)}
        {services.length > 0 ? (
          services.map(service => {
            console.log('Rendering service:', service.title, service._id);
            return (
              <Card key={service._id || service.id} className="service-item" style={{ height: 'auto', overflow: 'visible' }}>
              <div className="service-content">
                <div className="service-info">
                  <h4>{service.title}</h4>
                  <p className="service-description">{service.description}</p>
                  <div className="service-meta">
                    <span className="service-category">
                      {typeof service.category === 'object' ? service.category.name : service.category}
                    </span>
                    <span className="service-price">
                      {service.currency || 'BD'} {service.price}
                    </span>
                    <span className={`service-status ${service.active !== false ? 'active' : 'inactive'}`}>
                      {service.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="service-image">
                  <img
                    src={
                      // API services have images[] array with uploaded images
                      (service.images?.[0]?.url || service.images?.[0]) ||
                      // If no images, show placeholder
                      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=60&fit=crop'
                    }
                    alt={service.title}
                    className="service-thumbnail"
                    style={service.images?.length > 0 ? {} : { opacity: 0.5 }}
                  />
                </div>
              </div>

              <div className="service-actions" style={{
                display: 'flex',
                gap: '8px',
                marginTop: '10px',
                justifyContent: 'flex-end'
              }}>
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
            );
          })
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
  } catch (error) {
    console.error('ServiceManagement rendering error:', error);
    return (
      <div className="service-management">
        <div className="error-fallback">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>We encountered an issue loading your services.</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

export default ServiceManagement;
