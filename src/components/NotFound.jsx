import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const goToHome = () => {
    navigate('/'); // Navigate to the homepage
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={goToHome} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px', cursor: 'pointer' }}>
        Return to Homepage
      </button>
    </div>
  );
};

export default NotFound;
