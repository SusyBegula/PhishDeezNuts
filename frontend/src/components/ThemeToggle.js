import React from 'react';
import { IconButton, Tooltip, useTheme as useMuiTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ sx = {} }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();

  return (
    <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          ml: 1,
          ...sx,
          '&:hover': {
            backgroundColor: isDarkMode 
              ? 'rgba(255, 255, 255, 0.08)' 
              : 'rgba(0, 0, 0, 0.04)',
          },
        }}
        aria-label="toggle theme"
      >
        {isDarkMode ? (
          <Brightness7 
            sx={{ 
              color: muiTheme.palette.common.white,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(30deg)',
              },
            }} 
          />
        ) : (
          <Brightness4 
            sx={{ 
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(30deg)',
              },
            }} 
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 