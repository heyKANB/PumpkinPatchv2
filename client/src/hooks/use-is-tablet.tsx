import { useState, useEffect } from 'react';

export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkTablet = () => {
      // Check for iPad specifically and larger screens
      const isIPad = /iPad/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const hasTabletDimensions = window.innerWidth >= 768 && window.innerWidth <= 1024;
      const hasTabletAspectRatio = window.innerWidth / window.innerHeight > 1.2 && window.innerWidth / window.innerHeight < 2;
      
      setIsTablet(isIPad || (hasTabletDimensions && hasTabletAspectRatio));
    };

    checkTablet();
    window.addEventListener('resize', checkTablet);

    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  return isTablet;
}