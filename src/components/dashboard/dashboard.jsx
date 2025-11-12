// src/components/Dashboard/Dashboard.jsx

import { useContext, useEffect } from 'react';
import * as userService from '../../services/userService'
import { AuthContext } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.index();
        console.log(fetchedUsers);
      } catch (err) {
        console.log(err)
      }
    }
    if (user) fetchUsers();
  }, [user]);


  return (
    <main style={{
      padding: '2rem',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: 'Lato, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          color: '#00AD96',
          marginBottom: '1rem',
          fontSize: '2.5rem'
        }}>
          Welcome, {user.username}!
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          This is your dashboard page. Here you can manage your account, view your bookings, and access all PearlConnect features.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{
            backgroundColor: '#f0f8ff',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #00AD96'
          }}>
            <h3 style={{color: '#00AD96', marginBottom: '0.5rem'}}>My Bookings</h3>
            <p style={{margin: 0, color: '#666'}}>View and manage your service bookings</p>
          </div>

          <div style={{
            backgroundColor: '#fff0f5',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #00AD96'
          }}>
            <h3 style={{color: '#00AD96', marginBottom: '0.5rem'}}>Profile Settings</h3>
            <p style={{margin: 0, color: '#666'}}>Update your account information</p>
          </div>

          <div style={{
            backgroundColor: '#f0fff0',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #00AD96'
          }}>
            <h3 style={{color: '#00AD96', marginBottom: '0.5rem'}}>Favorites</h3>
            <p style={{margin: 0, color: '#666'}}>Access your saved services</p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
