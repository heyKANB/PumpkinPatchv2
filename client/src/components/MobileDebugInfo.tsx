import { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-is-mobile';

export default function MobileDebugInfo() {
  const [debugInfo, setDebugInfo] = useState({
    userAgent: '',
    touchSupported: false,
    pointerSupported: false,
    platform: '',
    standalone: false,
    devicePixelRatio: 1,
    aspectRatio: 1
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    setDebugInfo({
      userAgent: navigator.userAgent,
      touchSupported: 'ontouchstart' in window,
      pointerSupported: 'onpointerdown' in window,
      platform: navigator.platform,
      standalone: (window.navigator as any).standalone === true,
      devicePixelRatio: window.devicePixelRatio || 1,
      aspectRatio: window.innerWidth / window.innerHeight
    });
  }, []);

  // Only show debug info in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div 
      className="safe-area-top safe-area-left"
      style={{
        position: 'fixed',
        top: 10,
        left: 10,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px'
      }}>
      <div>isMobile: {isMobile ? 'true' : 'false'}</div>
      <div>Screen: {window.innerWidth}x{window.innerHeight}</div>
      <div>DPR: {debugInfo.devicePixelRatio}</div>
      <div>Aspect: {debugInfo.aspectRatio.toFixed(2)}</div>
      <div>Touch: {debugInfo.touchSupported ? 'supported' : 'not supported'}</div>
      <div>Platform: {debugInfo.platform}</div>
      <div>Standalone: {debugInfo.standalone ? 'true' : 'false'}</div>
    </div>
  );
}