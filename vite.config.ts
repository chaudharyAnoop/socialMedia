import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['vite.svg', 'favicon.ico', 'robots.txt', "icons/*.png"],
    manifest: {
      name: 'Social Media App',
      short_name: 'Social Media',
      description: 'A Progressive Social Media App!',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: 'android/android-launchericon-48-48.png', sizes: '48x48', type: 'image/png' },
        { src: 'android/android-launchericon-72-72.png', sizes: '72x72', type: 'image/png' },
        { src: 'android/android-launchericon-96-96.png', sizes: '96x96', type: 'image/png' },
        { src: 'android/android-launchericon-144-144.png', sizes: '144x144', type: 'image/png' },
        { src: 'android/android-launchericon-192-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'android/android-launchericon-512-512.png', sizes: '512x512', type: 'image/png' },

        { src: 'ios/16.png', sizes: '16x16', type: 'image/png' },
        { src: 'ios/20.png', sizes: '20x20', type: 'image/png' },
        { src: 'ios/29.png', sizes: '29x29', type: 'image/png' },
        { src: 'ios/32.png', sizes: '32x32', type: 'image/png' },
        { src: 'ios/40.png', sizes: '40x40', type: 'image/png' },
        { src: 'ios/50.png', sizes: '50x50', type: 'image/png' },
        { src: 'ios/57.png', sizes: '57x57', type: 'image/png' },
        { src: 'ios/58.png', sizes: '58x58', type: 'image/png' },
        { src: 'ios/60.png', sizes: '60x60', type: 'image/png' },
        { src: 'ios/64.png', sizes: '64x64', type: 'image/png' },
        { src: 'ios/72.png', sizes: '72x72', type: 'image/png' },
        { src: 'ios/76.png', sizes: '76x76', type: 'image/png' },
        { src: 'ios/80.png', sizes: '80x80', type: 'image/png' },
        { src: 'ios/87.png', sizes: '87x87', type: 'image/png' },
        { src: 'ios/100.png', sizes: '100x100', type: 'image/png' },
        { src: 'ios/114.png', sizes: '114x114', type: 'image/png' },
        { src: 'ios/120.png', sizes: '120x120', type: 'image/png' },
        { src: 'ios/128.png', sizes: '128x128', type: 'image/png' },
        { src: 'ios/144.png', sizes: '144x144', type: 'image/png' },
        { src: 'ios/152.png', sizes: '152x152', type: 'image/png' },
        { src: 'ios/167.png', sizes: '167x167', type: 'image/png' },
        { src: 'ios/180.png', sizes: '180x180', type: 'image/png' },
        { src: 'ios/192.png', sizes: '192x192', type: 'image/png' },
        { src: 'ios/256.png', sizes: '256x256', type: 'image/png' },
        { src: 'ios/512.png', sizes: '512x512', type: 'image/png' },
        { src: 'ios/1024.png', sizes: '1024x1024', type: 'image/png' },

        
      
{ src: 'windows/Square44x44Logo.png', sizes: '44x44', type: 'image/png' },
{ src: 'windows/Square44x44Logo.55x55.png', sizes: '55x55', type: 'image/png' },
{ src: 'windows/Square44x44Logo.66x66.png', sizes: '66x66', type: 'image/png' },
{ src: 'windows/Square44x44Logo.88x88.png', sizes: '88x88', type: 'image/png' },
{ src: 'windows/Square44x44Logo.176x176.png', sizes: '176x176', type: 'image/png' },


{ src: 'windows/Square71x71Logo.png', sizes: '71x71', type: 'image/png' },
{ src: 'windows/Square71x71Logo.89x89.png', sizes: '89x89', type: 'image/png' },
{ src: 'windows/Square71x71Logo.107x107.png', sizes: '107x107', type: 'image/png' },
{ src: 'windows/Square71x71Logo.142x142.png', sizes: '142x142', type: 'image/png' },
{ src: 'windows/Square71x71Logo.284x284.png', sizes: '284x284', type: 'image/png' },


{ src: 'windows/Square150x150Logo.png', sizes: '150x150', type: 'image/png' },
{ src: 'windows/Square150x150Logo.188x188.png', sizes: '188x188', type: 'image/png' },
{ src: 'windows/Square150x150Logo.225x225.png', sizes: '225x225', type: 'image/png' },
{ src: 'windows/Square150x150Logo.300x300.png', sizes: '300x300', type: 'image/png' },
{ src: 'windows/Square150x150Logo.600x600.png', sizes: '600x600', type: 'image/png' },


{ src: 'windows/Wide310x150Logo.png', sizes: '310x150', type: 'image/png' },
{ src: 'windows/Wide310x150Logo.388x188.png', sizes: '388x188', type: 'image/png' },
{ src: 'windows/Wide310x150Logo.465x225.png', sizes: '465x225', type: 'image/png' },
{ src: 'windows/Wide310x150Logo.620x300.png', sizes: '620x300', type: 'image/png' },
{ src: 'windows/Wide310x150Logo.1240x600.png', sizes: '1240x600', type: 'image/png' },


{ src: 'windows/Square310x310Logo.png', sizes: '310x310', type: 'image/png' },


{ src: 'windows/StoreLogo.png', sizes: '50x50', type: 'image/png' },
{ src: 'windows/StoreLogo.16x16.png', sizes: '16x16', type: 'image/png' },
{ src: 'windows/StoreLogo.24x24.png', sizes: '24x24', type: 'image/png' },
{ src: 'windows/StoreLogo.32x32.png', sizes: '32x32', type: 'image/png' },
{ src: 'windows/StoreLogo.48x48.png', sizes: '48x48', type: 'image/png' },
{ src: 'windows/StoreLogo.256x256.png', sizes: '256x256', type: 'image/png' },


{ src: 'windows/SplashScreen.png', sizes: '620x300', type: 'image/png' }
      ]
    }
  })],
})
