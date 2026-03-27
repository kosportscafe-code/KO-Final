import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'ipl' | 'festival';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isIPLMode: boolean;
  setIsIPLMode: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isIPLMode, setIsIPLModeState] = useState(() => {
    return localStorage.getItem('kos_ipl_mode') === 'true';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('kos_theme') as Theme;
    const isManual = localStorage.getItem('kos_theme_manual') === 'true';
    
    // 1. Manually forced IPL Mode (Event-based)
    if (localStorage.getItem('kos_ipl_mode') === 'true') {
      return 'ipl';
    }

    // 2. User Manual Selection
    if (saved && isManual) {
      return saved;
    }
    
    const hour = new Date().getHours();
    const minutes = new Date().getMinutes();
    const timeInMins = hour * 60 + minutes;

    // 3. Optional: Scheduled Match Window (7:30 PM - 11:30 PM = 1170 - 1410 mins)
    if (timeInMins >= 1170 && timeInMins <= 1410) {
      return 'ipl';
    }

    // 4. Default Day/Night Auto
    return (hour >= 6 && hour < 18) ? 'light' : 'dark';
  });

  const setIsIPLMode = (val: boolean) => {
    setIsIPLModeState(val);
    localStorage.setItem('kos_ipl_mode', val.toString());
    if (val) {
      setThemeState('ipl');
      localStorage.setItem('kos_theme_manual', 'false'); // Reset manual so it can return to auto after IPL
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('kos_theme', newTheme);
    localStorage.setItem('kos_theme_manual', 'true');
    // If user picks something else, turn off forced IPL mode
    if (newTheme !== 'ipl') {
      setIsIPLModeState(false);
      localStorage.setItem('kos_ipl_mode', 'false');
    }
  };

  useEffect(() => {
    // Remove all theme classes
    const body = document.body;
    body.classList.remove('theme-light', 'theme-dark', 'theme-ipl', 'theme-festival');
    
    // Add current theme class (except light which is default :root)
    if (theme !== 'light') {
      body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
