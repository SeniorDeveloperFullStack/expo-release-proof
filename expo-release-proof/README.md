# LaunchPilot

LaunchPilot is a real Expo React Native TypeScript MVP for managing App Store and Google Play launch workflows.

It helps developers and startup founders track launch readiness across multiple mobile app projects, including Expo project audits, EAS production builds, TestFlight preparation, Android AAB preparation, privacy review, RevenueCat setup, and final submission troubleshooting.

## MVP Features

- Premium dark mobile UI built with Expo and React Native.
- Dashboard with three sample launch projects: Fitness Tracker App, SaaS Mobile App, and E-commerce App.
- Project cards with platform, launch status, and live progress percentage.
- Interactive launch checklist grouped by real App Store and Google Play release stages.
- Clickable checklist rows with custom checkbox controls.
- Local checklist persistence using `@react-native-async-storage/async-storage`.
- Top tab navigation for Dashboard, Checklist, and Premium.
- Premium feature screen for upgrade concepts such as unlimited projects, checklist export, rejection tracking, and team collaboration.

## Run Locally

```bash
npm install
npx expo start --web
```

You can also use the npm script:

```bash
npm run web
```

## EAS Build Commands

Create internal development builds:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

Create preview builds:

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

Create production builds:

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
eas build --profile production --platform all
```

## EAS Submit Commands

Submit a production iOS build to App Store Connect:

```bash
eas submit --profile production --platform ios
```

Submit a production Android AAB to Google Play Console:

```bash
eas submit --profile production --platform android
```

Submit both platforms:

```bash
eas submit --profile production --platform all
```

## RevenueCat Checklist

- Create matching subscription or in-app purchase products in App Store Connect and Google Play Console.
- Add products to RevenueCat and connect them to the correct app.
- Configure offerings, packages, and entitlement IDs.
- Confirm entitlement IDs match the application code.
- Test sandbox purchases, restore purchases, cancellation, expiration, and renewal behavior.
- Verify paywall copy, trial terms, subscription duration, and pricing match store configuration.

## Launch Workflow Covered

- Expo / React Native project audit
- EAS production build configuration
- iOS TestFlight / App Store Connect preparation
- Android AAB / Google Play Console preparation
- Privacy policy, data safety, and review checklist
- RevenueCat products, offerings, and entitlement check
- Final submission and review troubleshooting

LaunchPilot is an MVP workflow manager. It does not include fake App Store or Google Play links and does not claim the app is already published.
