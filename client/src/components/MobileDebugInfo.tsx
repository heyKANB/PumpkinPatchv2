import { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-is-mobile';

export default function MobileDebugInfo() {
  const [debugInfo, setDebugInfo] = useState({
    userAgent: '',
    touchSupported: false,
    pointerSupported: false,
    platform: '',
    standalone: false
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    setDebugInfo({
      userAgent: navigator.userAgent,
      touchSupported: 'ontouchstart' in window,
      pointerSupported: 'onpointerdown' in window,
      platform: navigator.platform,
      standalone: (window.navigator as any).standalone === true
    });
  }, []);

  // Only show debug info in development
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div style={{
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
      <div>Touch: {debugInfo.touchSupported ? 'supported' : 'not supported'}</div>
      <div>Pointer: {debugInfo.pointerSupported ? 'supported' : 'not supported'}</div>
      <div>Platform: {debugInfo.platform}</div>
      <div>Standalone: {debugInfo.standalone ? 'true' : 'false'}</div>
      <div>UA: {debugInfo.userAgent.slice(0, 50)}...</div>
    </div>
  );
}