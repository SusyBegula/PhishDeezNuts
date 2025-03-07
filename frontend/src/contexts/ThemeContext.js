import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from '../theme';
import '../darkMode.css';

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if theme preference exists in localStorage
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
           (savedTheme === null && 
            window.matchMedia && 
            window.matchMedia('(prefers-color-scheme: dark)').matches);
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme());
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Update localStorage and apply theme classes when theme changes
  useEffect(() => {
    // Update localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update document body classes
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.add('theme-transition');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('theme-transition');
    }
    
    // Update document background color
    document.body.style.backgroundColor = theme.palette.background.default;
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDarkMode ? '#272727' : theme.palette.primary.main);
    }
  }, [isDarkMode, theme]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 