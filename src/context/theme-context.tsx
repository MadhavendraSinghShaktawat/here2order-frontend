import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define theme options based on the color palette from the image
type ThemeColorName = 'black' | 'flamingo' | 'supernova' | 'white' | 'capeCod' | 'gunsmoke' | 'tonysPink' | 'hacienda';
type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  cardBackground: string;
  inputBackground: string;
}

interface ThemeContextType {
  colorName: ThemeColorName;
  mode: ThemeMode;
  colors: ThemeColors;
  toggleMode: () => void;
  setColorTheme: (theme: ThemeColorName) => void;
}

// Color palette from the image
const lightThemeColors: Record<ThemeColorName, ThemeColors> = {
  black: {
    primary: '#010101', // Black
    secondary: '#414342', // Cape Cod
    accent: '#fcc809', // Supernova
    background: '#ffffff',
    text: '#010101',
    border: '#e7ac94', // Tonys Pink
    cardBackground: '#ffffff',
    inputBackground: '#ffffff'
  },
  flamingo: {
    primary: '#f06236', // Flamingo
    secondary: '#414342', // Cape Cod
    accent: '#010101', // Black
    background: '#ffffff',
    text: '#010101',
    border: '#f06236', // Flamingo
    cardBackground: '#ffffff',
    inputBackground: '#ffffff'
  },
  supernova: {
    primary: '#fcc809', // Supernova
    secondary: '#414342', // Cape Cod
    accent: '#010101', // Black
    background: '#ffffff',
    text: '#010101',
    border: '#fcc809', // Supernova
    cardBackground: '#ffffff',
    inputBackground: '#ffffff'
  },
  white: {
    primary: '#fdfdfd', // White
    secondary: '#414342', // Cape Cod
    accent: '#f06236', // Flamingo
    background: '#f8f8f8',
    text: '#010101',
    border: '#e7e7e7',
    cardBackground: '#ffffff',
    inputBackground: '#ffffff'
  },
  capeCod: {
    primary: '#414342', // Cape Cod
    secondary: '#f06236', // Flamingo
    accent: '#fcc809', // Supernova
    background: '#ffffff',
    text: '#010101',
    border: '#414342', // Cape Cod
    cardBackground: '#ffffff',
    inputBackground: '#ffffff'
  },
  gunsmoke: {
    primary: '#838888', // Gunsmoke
    secondary: '#414342', // Cape Cod
    accent: '#f06236', // Flamingo
    background: '#ffffff',
    text: '#010101',
    border: '#838888', // Gunsmoke
    cardBackground: '#ffffff',
    inputBackground: '#ffffff'
  },
  tonysPink: {
    primary: '#e7ac94', // Tonys Pink
    secondary: '#414342', // Cape Cod
    accent: '#010101', // Black
    background: '#ffffff',
    text: '#010101',
    border: '#e7ac94', // Tonys Pink
    cardBackground: '#ffffff',
    inputBackground: '#ffffff'
  },
  hacienda: {
    primary: '#8b7813', // Hacienda
    secondary: '#414342', // Cape Cod
    accent: '#fcc809', // Supernova
    background: '#ffffff',
    text: '#010101',
    border: '#8b7813', // Hacienda
    cardBackground: '#ffffff',
    inputBackground: '#ffffff'
  }
};

// Dark mode variants of the same colors
const darkThemeColors: Record<ThemeColorName, ThemeColors> = {
  black: {
    primary: '#010101', // Black
    secondary: '#414342', // Cape Cod
    accent: '#fcc809', // Supernova
    background: '#121212',
    text: '#ffffff',
    border: '#e7ac94', // Tonys Pink
    cardBackground: '#1e1e1e',
    inputBackground: '#2d2d2d'
  },
  flamingo: {
    primary: '#f06236', // Flamingo
    secondary: '#414342', // Cape Cod
    accent: '#010101', // Black
    background: '#121212',
    text: '#ffffff',
    border: '#f06236', // Flamingo
    cardBackground: '#1e1e1e',
    inputBackground: '#2d2d2d'
  },
  supernova: {
    primary: '#fcc809', // Supernova
    secondary: '#414342', // Cape Cod
    accent: '#010101', // Black
    background: '#121212',
    text: '#ffffff',
    border: '#fcc809', // Supernova
    cardBackground: '#1e1e1e',
    inputBackground: '#2d2d2d'
  },
  white: {
    primary: '#fdfdfd', // White
    secondary: '#414342', // Cape Cod
    accent: '#f06236', // Flamingo
    background: '#121212',
    text: '#ffffff',
    border: '#e7e7e7',
    cardBackground: '#1e1e1e',
    inputBackground: '#2d2d2d'
  },
  capeCod: {
    primary: '#414342', // Cape Cod
    secondary: '#f06236', // Flamingo
    accent: '#fcc809', // Supernova
    background: '#121212',
    text: '#ffffff',
    border: '#414342', // Cape Cod
    cardBackground: '#1e1e1e',
    inputBackground: '#2d2d2d'
  },
  gunsmoke: {
    primary: '#838888', // Gunsmoke
    secondary: '#414342', // Cape Cod
    accent: '#f06236', // Flamingo
    background: '#121212',
    text: '#ffffff',
    border: '#838888', // Gunsmoke
    cardBackground: '#1e1e1e',
    inputBackground: '#2d2d2d'
  },
  tonysPink: {
    primary: '#e7ac94', // Tonys Pink
    secondary: '#414342', // Cape Cod
    accent: '#010101', // Black
    background: '#121212',
    text: '#ffffff',
    border: '#e7ac94', // Tonys Pink
    cardBackground: '#1e1e1e',
    inputBackground: '#2d2d2d'
  },
  hacienda: {
    primary: '#8b7813', // Hacienda
    secondary: '#414342', // Cape Cod
    accent: '#fcc809', // Supernova
    background: '#121212',
    text: '#ffffff',
    border: '#8b7813', // Hacienda
    cardBackground: '#1e1e1e',
    inputBackground: '#2d2d2d'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Set default theme to flamingo (orange) from the image
  const [colorName, setColorName] = useState<ThemeColorName>(() => {
    const savedColorName = localStorage.getItem('colorTheme') as ThemeColorName;
    if (savedColorName && savedColorName in lightThemeColors) {
      return savedColorName;
    }
    
    return 'flamingo'; // Default theme (orange)
  });

  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      return savedMode;
    }
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Get the appropriate colors based on the current mode and color theme
  const colors = mode === 'light' ? lightThemeColors[colorName] : darkThemeColors[colorName];

  useEffect(() => {
    // Update CSS variables for the theme
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-card-bg', colors.cardBackground);
    root.style.setProperty('--color-input-bg', colors.inputBackground);
    
    // Add or remove dark class for Tailwind dark mode
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('colorTheme', colorName);
    localStorage.setItem('themeMode', mode);
  }, [colorName, mode, colors]);

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const setColorTheme = (newTheme: ThemeColorName) => {
    setColorName(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ colorName, mode, colors, toggleMode, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 