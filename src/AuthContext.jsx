// ------------------ src/AuthContext.jsx ------------------
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (email, password) => {
    if (password === 'admin' ) {
      setUser({ email, role: 'admin' });
      navigate('/dashboard');
      return;
    }
    if (password === 'employee') {
      setUser({ email, role: 'employee' });
      navigate('/inventory');
      return;
    }
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
