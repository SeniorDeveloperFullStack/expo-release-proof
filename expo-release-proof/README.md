# LaunchPilot

LaunchPilot is a polished Expo React Native TypeScript MVP for managing App Store and Google Play release workflows.

The app is designed as a client-ready SaaS/mobile dashboard for developers, founders, and startup teams preparing mobile releases. It tracks Expo/EAS build readiness, store metadata, privacy and policy tasks, RevenueCat subscription setup, review risk, and final submission milestones.

## What It Includes

- Premium dark UI with gradient cards, rounded surfaces, clean spacing, and subtle glass-style panels.
- Mobile-first layout that also works well with `npx expo start --web`.
- Simple in-file tab state for Dashboard, Checklist, Timeline, Premium, and Settings.
- New project modal with app name, platform, and release type controls.
- Local persistence with AsyncStorage for onboarding, saved projects, and checked checklist items.
- Reusable UI components: `StatCard`, `ProjectCard`, `ProgressBar`, `ChecklistSectionCard`, `BottomTabButton`, and `GradientButton`.
- `lucide-react-native` icons and `expo-linear-gradient` styling.

## Screens

- Onboarding welcome screen for LaunchPilot.
- Dashboard with active projects, average readiness, pending tasks, review risk, deadlines, and project cards.
- Checklist detail screen with release sections and clickable checkbox tasks.
- Timeline screen covering code freeze, builds, testing, metadata, review submission, and approval/release.
- Premium screen for the LaunchPilot Pro concept.
- Settings screen with profile, app version, release mode, export, privacy, and support placeholders.

## Release Workflow Covered

- Expo / React Native project audit
- EAS production build configuration
- iOS TestFlight / App Store Connect preparation
- Android AAB / Google Play Console preparation
- Privacy policy, data safety, and review checklist
- RevenueCat products, offerings, and entitlement check
- Final submission and review troubleshooting

## Run Locally

```bash
npm install
npx expo start --web
```

You can also run:

```bash
npm run web
```

## EAS Build Commands

Development builds:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

Preview builds:

```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

Production builds:

```bash
eas build --profile production --platform ios
eas build --profile production --platform android
eas build --profile production --platform all
```

## EAS Submit Commands

```bash
eas submit --profile production --platform ios
eas submit --profile production --platform android
eas submit --profile production --platform all
```

## Notes

LaunchPilot is an MVP workflow manager and portfolio-ready product demo. It does not include fake App Store or Google Play links, does not use fake client names, and does not claim the app is already published.

The Premium screen is a demo payment screen only. No real payment is processed.
