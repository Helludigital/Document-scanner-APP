import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  autoFlash: boolean;
  autoEnhance: boolean;
  highQuality: boolean;
  pdfQuality: 'Standard' | 'High' | 'Maximum';
  autoSaveToGallery: boolean;
  autoDeleteOldFiles: boolean;
  hapticFeedback: boolean;
  darkMode: boolean;
}

const defaultSettings: AppSettings = {
  autoFlash: false,
  autoEnhance: true,
  highQuality: false,
  pdfQuality: 'High',
  autoSaveToGallery: true,
  autoDeleteOldFiles: false,
  hapticFeedback: true,
  darkMode: false,
};

export default function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('@settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem('@settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const resetSettings = () => {
    saveSettings(defaultSettings);
  };

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}
