import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.huntergames.pumpkinpatch',
  appName: 'Pumpkin Farm 3D',
  webDir: 'dist/public',

  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'Pumpkin Farm 3D',
    contentInset: 'automatic',
    allowsLinkPreview: false
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;