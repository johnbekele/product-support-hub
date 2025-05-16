// ThomsonReutersThemeContext.js
import React, { createContext, useContext } from 'react';

// Thomson Reuters theme configuration
const thomsonReutersTheme = {
  colors: {
    primary: '#d2a06c', // Orange/light brown - adjust to exact brand color
    white: '#ffffff',
    black: '#000000',
    lightGray: '#f5f5f5',
    mediumGray: '#e0e0e0',
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: {
      small: '0.875rem',
      normal: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
      xxlarge: '2rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
  components: {
    header: {
      backgroundColor: '#F4631E',
      color: '#000000',
    },
    body: {
      backgroundColor: '#ffffff',
      color: '#000000',
    },
    button: {
      primary: {
        backgroundColor: '#FF9B17',
        color: '#000000',
        hoverBackgroundColor: '#c08c58',
      },
      secondary: {
        backgroundColor: '#ffffff',
        color: '#d2a06c',
        border: '1px solid #d2a06c',
        hoverBackgroundColor: '#f5f5f5',
      },
    },
  },
};

// Create the context
const ThomsonReutersThemeContext = createContext(thomsonReutersTheme);

// Provider component
export const ThomsonReutersThemeProvider = ({ children }) => {
  return (
    <ThomsonReutersThemeContext.Provider value={thomsonReutersTheme}>
      {children}
    </ThomsonReutersThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useThomsonReutersTheme = () => {
  const context = useContext(ThomsonReutersThemeContext);
  if (context === undefined) {
    throw new Error(
      'useThomsonReutersTheme must be used within a ThomsonReutersThemeProvider'
    );
  }
  return context;
};

export default thomsonReutersTheme;
