import React, { createContext, useContext, useState } from 'react';

const PrivacyContext = createContext();

export const usePrivacyContext = () => {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacyContext must be used within a PrivacyProvider');
  }
  return context;
};

export const PrivacyProvider = ({ children }) => {
  const [hideAmounts, setHideAmounts] = useState(() => {
    return localStorage.getItem('hideAmounts') === 'true';
  });

  const toggleAmounts = () => {
    const newValue = !hideAmounts;
    setHideAmounts(newValue);
    localStorage.setItem('hideAmounts', newValue.toString());
  };

  const formatAmount = (amount, currency = '€') => {
    if (hideAmounts) {
      return `${currency}***`;
    }
    return `${currency}${amount.toLocaleString('it-IT')}`;
  };

  const value = {
    hideAmounts,
    toggleAmounts,
    formatAmount
  };

  return (
    <PrivacyContext.Provider value={value}>
      {children}
    </PrivacyContext.Provider>
  );
};