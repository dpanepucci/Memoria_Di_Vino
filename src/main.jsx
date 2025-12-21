import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Auth from './Auth.jsx'

function Root() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <StrictMode>
      {isAuthenticated ? (
        <App onLogout={handleLogout} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />)
