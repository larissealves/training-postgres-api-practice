import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './hooks/context/AuthContext.jsx';
import Router from './Router.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Router /> {/* Main router with route-based structure */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
