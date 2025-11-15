import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import './pages/pages.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

// Wrap the App component with the BrowserRouter component to enable
// enable route handling throughout the application.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
