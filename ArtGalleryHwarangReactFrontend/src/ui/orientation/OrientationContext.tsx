import React, { createContext, useState, useContext } from 'react';

const OrientationContext = createContext();

export const useOrientation = () => useContext(OrientationContext);

export const OrientationProvider = ({ children }) => {
  const [isVertical, setIsVertical] = useState(false);

  const toggleVertical = () => {
    setIsVertical(prev => !prev);
  };

  return (
    <OrientationContext.Provider value={{ isVertical, toggleVertical }}>
      {children}
    </OrientationContext.Provider>
  );
};
