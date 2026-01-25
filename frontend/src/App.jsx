import React, { useState } from 'react';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleAuth = (data) => {
    if (data && data.token) {
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
    } else {
      alert(data.message || 'Auth failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="app">
      <h1>Water Tracker</h1>
      {!user ? (
        <div className="auth-row">
          <Register onRegister={handleAuth} />
          <Login onLogin={handleAuth} />
        </div>
      ) : (
        <div className="main">
          <div className="top">
            <span>Logged in as <strong>{user.username}</strong></span>
            <button onClick={logout}>Logout</button>
          </div>
          <Dashboard user={user} />
        </div>
      )}
    </div>
  );
}
