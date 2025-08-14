import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.huntergames.pumpkinpatch',
  appName: 'Pumpkin Farm 3D',
  webDir: 'dist/public',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  ios: {
    scheme: 'Pumpkin Farm 3D'
  }
};

export default config;