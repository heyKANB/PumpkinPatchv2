import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  aspectRatio: number;
  isSmallScreen: boolean;
  isTablet: boolean;
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    screenWidth: 0,
    screenHeight: 0,
    devicePixelRatio: 1,
    aspectRatio: 1,
    isSmallScreen: false,
    isTablet: false,
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
      
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;
      const aspectRatio = screenWidth / screenHeight;
      
      // Consider screens smaller than 768px as small screens
      const isSmallScreen = screenWidth < 768;
      
      // iPad or large Android tablets
      const isTablet = (isIOS && /ipad/.test(userAgent)) || 
                      (isAndroid && screenWidth >= 768);

      setDeviceInfo({
        isMobile,
        isIOS,
        isAndroid,
        screenWidth,
        screenHeight,
        devicePixelRatio,
        aspectRatio,
        isSmallScreen,
        isTablet,
      });

      console.log('Device Info:', {
        isMobile,
        isIOS,
        isAndroid,
        screenWidth,
        screenHeight,
        devicePixelRatio,
        aspectRatio,
        isSmallScreen,
        isTablet,
        userAgent: navigator.userAgent
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}