# iOS Deployment Guide for Pumpkin Farm 3D

## Option 1: Progressive Web App (PWA) - Recommended 

Your game is now PWA-ready and can be "installed" on iOS devices:

### Steps for users:
1. Open Safari on iPhone/iPad
2. Navigate to your deployed Replit URL
3. Tap the Share button (square with arrow up)
4. Scroll down and tap "Add to Home Screen"
5. Tap "Add" to install the app icon

### Benefits:
- ✅ No App Store approval needed
- ✅ Instant updates when you modify your code
- ✅ Full 3D graphics and touch controls work
- ✅ Works offline with service worker caching
- ✅ Can be distributed immediately

## Option 2: React Native WebView App - For App Store

If you want to publish on the App Store, use the WebView wrapper:

### Setup:
1. Copy files from `react-native-wrapper/` to a new project
2. Install Expo CLI: `npm install -g @expo/eas-cli`
3. Create Expo account and project
4. Update the `GAME_URL` in App.tsx to your deployed Replit URL

### Build and Deploy:
```bash
# Install dependencies
npm install

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Submit to App Store (requires Apple Developer account)
eas submit --platform ios
```

## Option 3: Codemagic CI/CD (Alternative to EAS)

Using the provided `codemagic.yaml`:

### Prerequisites:
- Apple Developer account ($99/year)
- App Store Connect API key
- Apple Team ID

### Setup:
1. Connect your GitHub/GitLab repository to Codemagic
2. Set up "Apple Connect App Mgr" integration in Codemagic dashboard
3. Add the following environment variables in Codemagic:
   - `APP_STORE_CONNECT_ISSUER_ID`
   - `APP_STORE_CONNECT_KEY_ID`
   - `APP_STORE_CONNECT_PRIVATE_KEY`
4. Bundle identifier is configured as: `com.huntergames.pumpkinpatch`
5. Push code to trigger automated build and deployment

## Current App Store Information:
- **App ID**: 6749664824
- **Bundle ID**: com.huntergames.pumpkinpatch
- **Name**: Pumpkin Farm 3D
- **Version**: 3.0.0
- **Build Number**: 21

## Recommended Next Steps:

1. **Start with PWA**: Deploy your current web app and test the PWA installation
2. **Test thoroughly**: Ensure all touch controls and 3D graphics work properly
3. **Gather feedback**: Let users try the PWA version first
4. **Consider App Store**: Only if you need App Store distribution later

## Files Created:
- `app.json` - Expo configuration
- `eas.json` - EAS build configuration  
- `codemagic.yaml` - Codemagic CI/CD pipeline
- `client/public/manifest.json` - PWA manifest
- `client/public/sw.js` - Service worker for caching
- `react-native-wrapper/` - WebView app for App Store

Your farming game is now ready for mobile deployment! The PWA approach will get you live immediately, while the native wrapper provides App Store distribution when needed.