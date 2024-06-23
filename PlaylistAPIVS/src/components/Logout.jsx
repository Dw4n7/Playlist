import React from 'react';
import axios from 'axios';

const Logout = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout/', {}, { withCredentials: true });
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
