import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  // Favorites State
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Compare State
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  // Effect to handle theme class on body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Effects to handle persistence
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleFavorite = (collegeId) => {
    setFavorites((prev) => 
      prev.includes(collegeId) 
        ? prev.filter((id) => id !== collegeId)
        : [...prev, collegeId]
    );
  };

  const toggleCompare = (collegeId) => {
    setCompareList((prev) => {
      if (prev.includes(collegeId)) {
        return prev.filter((id) => id !== collegeId);
      }
      if (prev.length >= 4) {
        alert("You can only compare up to 4 colleges.");
        return prev;
      }
      return [...prev, collegeId];
    });
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      favorites, toggleFavorite,
      compareList, toggleCompare
    }}>
      {children}
    </AppContext.Provider>
  );
};
