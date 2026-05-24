# App Icon Setup Guide

## App Name
✅ **Already Updated**: Changed from "adr" to **"ADR Reporter"**

## App Icon Setup

### Option 1: Use Online Icon Generator (Recommended)

1. **Generate Icons**:
   - Go to: https://www.appicon.co/ or https://icon.kitchen/
   - Upload your icon image (1024x1024px PNG recommended)
   - Download the generated Android icon set

2. **Place Icons**:
   - Extract the downloaded zip file
   - Copy the `mipmap-*` folders to: `android/app/src/main/res/`
   - You should have these folders:
     - `mipmap-mdpi/ic_launcher.png` (48x48px)
     - `mipmap-hdpi/ic_launcher.png` (72x72px)
     - `mipmap-xhdpi/ic_launcher.png` (96x96px)
     - `mipmap-xxhdpi/ic_launcher.png` (144x144px)
     - `mipmap-xxxhdpi/ic_launcher.png` (192x192px)
   - Also copy `ic_launcher_round.png` files to each folder (for round icons)

### Option 2: Manual Setup

1. **Create Icon Directories**:
   ```
   android/app/src/main/res/
   ├── mipmap-mdpi/
   ├── mipmap-hdpi/
   ├── mipmap-xhdpi/
   ├── mipmap-xxhdpi/
   └── mipmap-xxxhdpi/
   ```

2. **Create Icons** (use any image editor):
   - **mdpi**: 48x48px
   - **hdpi**: 72x72px
   - **xhdpi**: 96x96px
   - **xxhdpi**: 144x144px
   - **xxxhdpi**: 192x192px

3. **Save as**:
   - `ic_launcher.png` (square icon)
   - `ic_launcher_round.png` (round icon - optional)

### Option 3: Use React Native Icon Generator Tool

Run this command in your project root:
```bash
npx react-native-asset
```

Then follow the prompts to generate icons from a single image.

## After Adding Icons

1. **Rebuild the app**:
   ```bash
   npx react-native run-android
   ```

2. **Verify**:
   - Uninstall the old app from your device/emulator
   - Install the new build
   - Check the app name shows as "ADR Reporter"
   - Check the icon appears correctly

## Current Configuration

- **App Name**: ADR Reporter
- **Package Name**: com.adr (in `android/app/build.gradle`)
- **Icon Reference**: `@mipmap/ic_launcher` (in `AndroidManifest.xml`)

## iOS Icon Setup (if needed later)

For iOS, you'll need to:
1. Add icons to `ios/YourApp/Images.xcassets/AppIcon.appiconset/`
2. Sizes needed: 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5, 1024x1024
