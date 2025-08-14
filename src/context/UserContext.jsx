import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    name: 'Utente',
    email: '',
    preferences: {
      currency: 'EUR',
      language: 'it-IT',
      notifications: true
    }
  });

  // Load user profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, []);

  // Save user profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const updateProfile = (updates) => {
    setUserProfile(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updatePreferences = (preferences) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...preferences
      }
    }));
  };

  const value = {
    userProfile,
    updateProfile,
    updatePreferences,
    userName: userProfile.name
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};