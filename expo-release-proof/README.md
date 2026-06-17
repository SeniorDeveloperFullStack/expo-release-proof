# Expo Release Proof

Expo Release Proof is a portfolio proof project for preparing an Expo React Native TypeScript app for App Store Connect and Google Play Console submission.

The app demonstrates a professional release workflow covering project audit, EAS build setup, TestFlight preparation, Android App Bundle preparation, privacy and data safety review, RevenueCat validation, and final submission troubleshooting.

## Run Locally

```bash
npm install
npx expo start --web
```

## EAS Build Commands

Create a local development client build:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

Create internal preview builds:

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

Create production store builds:

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
eas build --profile production --platform all
```

## EAS Submit Commands

Submit the latest production iOS build to App Store Connect:

```bash
eas submit --profile production --platform ios
```

Submit the latest production Android AAB to Google Play Console:

```bash
eas submit --profile production --platform android
```

Submit both platforms:

```bash
eas submit --profile production --platform all
```

## Store Release Checklist

- Confirm the Expo SDK, native permissions, app icons, splash screen, and production environment variables.
- Verify `ios.bundleIdentifier` is `com.nghian.expo.releaseproof`.
- Verify `android.package` is `com.nghian.expo.releaseproof` and `android.versionCode` is incremented for each Play Console upload.
- Prepare screenshots, descriptions, keywords, categories, support URL, marketing URL, and review notes.
- Complete privacy policy, App Store privacy nutrition labels, Google Play Data Safety, app access, content rating, and target audience forms.
- Test fresh install, login, logout, restore purchases, offline states, crash-free launch, and review-account access.

## RevenueCat Checklist

- Create matching products in App Store Connect and Google Play Console.
- Import or configure those products in RevenueCat.
- Attach products to the correct offering, package, and entitlement.
- Confirm entitlement IDs match the app code.
- Test sandbox purchase, restore purchase, cancellation, expiration, and renewal behavior.
- Confirm the paywall copy matches store pricing, trial terms, and subscription duration.

## Release Goal

The goal of this project is to show a clear, repeatable release-preparation workflow for clients who need help publishing an Expo or React Native application to the Apple App Store and Google Play Store.
