import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the settings interface
interface Settings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  animationsEnabled: boolean;
  darkModeEnabled: boolean;
}

// Define the context interface
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  toggleSetting: (setting: keyof Settings) => void;
}

// Create the context with default values
const SettingsContext = createContext<SettingsContextType>({
  settings: {
    soundEnabled: true,
    notificationsEnabled: true,
    animationsEnabled: true,
    darkModeEnabled: true
  },
  updateSettings: () => {},
  toggleSetting: () => {}
});

// Settings provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    notificationsEnabled: true,
    animationsEnabled: true,
    darkModeEnabled: true
  });

  // Update settings
  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      return updated;
    });
  };

  // Toggle a single setting
  const toggleSetting = (setting: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Export the context value
  const contextValue: SettingsContextType = {
    settings,
    updateSettings,
    toggleSetting
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
