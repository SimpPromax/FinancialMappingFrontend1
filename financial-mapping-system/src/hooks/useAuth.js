import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('financial_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: 1,
        email,
        password,
        name: 'John Doe'
      };
      setUser(userData);
      localStorage.setItem('financial_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error};
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('financial_user');
  };

  return {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };
};