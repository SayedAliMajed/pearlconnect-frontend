/**
 * @fileoverview Main entry point for the PearlConnect React application
 *
 * This file sets up the root React application with all necessary providers
 * and routing configuration. It handles the initial mounting of the app to the DOM.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './pages/pages.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

// Create the root React application instance
// - BrowserRouter: Enables client-side routing throughout the application
// - AuthProvider: Provides authentication state management via React Context
// - StrictMode: Enables additional development checks and warnings
// - App: Main application component containing all routes and UI
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
