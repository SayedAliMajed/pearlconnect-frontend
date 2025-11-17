import React, { useState, useEffect, useContext } from 'react';
import Container from '../../components/ui/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BookingList from '../../components/bookings/BookingList';
import { AuthContext } from '../../contexts/AuthContext';

const OrdersPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <Container size="large">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Please sign in to view your orders</h2>
          <p>You need to be logged in to access your orders.</p>
        </div>
      </Container>
    );
  }

  return (
    <div className="orders-page">
      <Container size="xlarge">
        {/* Header */}
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Manage your service orders and appointments</p>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          <BookingList showAll={false} />
        </div>
      </Container>
    </div>
  );
};

export default OrdersPage;
