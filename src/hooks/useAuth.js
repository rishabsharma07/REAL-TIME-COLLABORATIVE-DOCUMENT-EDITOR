import { useState, useEffect } from 'react';
import { userStorage } from '../lib/storage';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const currentUser = userStorage.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const authenticatedUser = userStorage.authenticate(email, password);
      if (!authenticatedUser) {
        return { error: { message: 'Invalid email or password' } };
      }
      setUser(authenticatedUser);
      userStorage.setCurrentUser(authenticatedUser);
      return { error: null };
    } catch (error) {
      return { error: { message: 'Authentication failed' } };
    }
  };

  const signUp = async (email, password, name) => {
    try {
      // Check if user already exists
      const existingUser = userStorage.findByEmail(email);
      if (existingUser) {
        return { error: { message: 'User with this email already exists' } };
      }
      const newUser = userStorage.register(email, password, name);
      setUser(newUser);
      userStorage.setCurrentUser(newUser);
      return { error: null };
    } catch (error) {
      return { error: { message: 'Registration failed' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    userStorage.setCurrentUser(null);
    return { error: null };
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
