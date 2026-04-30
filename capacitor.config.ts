import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.santos.dailygrid',
  appName: 'DailyGrid',
  webDir: 'dist/app/browser',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // Es el que permite que el backend reciba el idToken
      androidClientId: '805447426865-slahdb4eliejev8btfqa6lr7gjeeaf7k.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
