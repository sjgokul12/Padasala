import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.padasala.app',
  appName: 'Padasala',
  webDir: 'dist',
  android: {
    // The APK is sideloaded from the website, not from the Play Store.
    allowMixedContent: false,
  },
};

export default config;
