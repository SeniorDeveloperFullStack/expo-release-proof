import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

type WorkflowSection = {
  title: string;
  description: string;
  checks: string[];
  accent: string;
};

const workflowSections: WorkflowSection[] = [
  {
    title: 'Expo / React Native Project Audit',
    description:
      'Confirm the app is stable, production-ready, and aligned with store requirements before build setup begins.',
    checks: [
      'Validate Expo SDK, dependencies, TypeScript, assets, and runtime permissions.',
      'Review app icons, splash assets, navigation paths, and release blockers.',
      'Run local smoke tests on web, iOS simulator, and Android emulator where available.',
    ],
    accent: '#60a5fa',
  },
  {
    title: 'EAS Production Build Configuration',
    description:
      'Prepare repeatable build profiles for development QA, preview distribution, and production store binaries.',
    checks: [
      'Configure eas.json profiles for internal, preview, and store-ready builds.',
      'Verify bundle IDs, package names, versioning, credentials, and build numbers.',
      'Document build commands so another developer can reproduce the release.',
    ],
    accent: '#34d399',
  },
  {
    title: 'iOS TestFlight / App Store Connect Preparation',
    description:
      'Package a signed iOS build and prepare App Store Connect metadata for TestFlight and review.',
    checks: [
      'Confirm bundle identifier, Apple team, certificates, and provisioning profile.',
      'Prepare screenshots, age rating, app category, support URL, and privacy answers.',
      'Submit to TestFlight, invite testers, and resolve App Store Connect warnings.',
    ],
    accent: '#f472b6',
  },
  {
    title: 'Android AAB / Google Play Console Preparation',
    description:
      'Generate a production Android App Bundle and prepare Play Console tracks for testing or release.',
    checks: [
      'Confirm application ID, versionCode, signing key, and adaptive icon assets.',
      'Upload the AAB to internal testing, closed testing, or production release tracks.',
      'Complete store listing, content rating, target audience, and app access forms.',
    ],
    accent: '#facc15',
  },
  {
    title: 'Privacy Policy, Data Safety, and Review Checklist',
    description:
      'Reduce review delays by matching app behavior with privacy, permissions, and store disclosure forms.',
    checks: [
      'Prepare privacy policy URL, data collection disclosures, and permission explanations.',
      'Check login requirements, demo account access, subscription terms, and support links.',
      'Review crash-free launch, empty states, offline handling, and restricted content rules.',
    ],
    accent: '#a78bfa',
  },
  {
    title: 'RevenueCat Products, Offerings, and Entitlement Check',
    description:
      'Validate subscriptions and in-app purchases across RevenueCat and both store consoles before review.',
    checks: [
      'Map App Store and Play Console products to RevenueCat products and offerings.',
      'Confirm entitlement identifiers, package selection, trial rules, and paywall copy.',
      'Test sandbox purchases, restore purchases, expiration, cancellation, and access gates.',
    ],
    accent: '#fb7185',
  },
  {
    title: 'Final Submission and Review Troubleshooting',
    description:
      'Submit confidently, monitor review status, and handle rejections with clear technical evidence.',
    checks: [
      'Run final build verification and submit with EAS Submit or store console upload.',
      'Track review messages, metadata issues, missing screenshots, and binary warnings.',
      'Prepare concise fixes and reviewer notes for rejected or delayed submissions.',
    ],
    accent: '#22d3ee',
  },
];

const summaryStats = [
  { label: 'Platforms', value: 'iOS + Android' },
  { label: 'Build System', value: 'EAS' },
  { label: 'Release Mode', value: 'Store Ready' },
];

export default function App() {
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Expo Release Proof</Text>
          </View>
          <Text style={styles.title}>App Store & Google Play Publishing Workflow</Text>
          <Text style={styles.subtitle}>
            A professional release-preparation demo showing how I audit, configure, build,
            submit, and troubleshoot Expo React Native apps for both major stores.
          </Text>

          <View style={styles.statsGrid}>
            {summaryStats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.timeline}>
          {workflowSections.map((section, index) => (
            <View key={section.title} style={styles.sectionCard}>
              <View style={[styles.accentBar, { backgroundColor: section.accent }]} />
              <View style={styles.sectionHeader}>
                <View style={[styles.stepMarker, { borderColor: section.accent }]}>
                  <Text style={[styles.stepNumber, { color: section.accent }]}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View style={styles.sectionTitleGroup}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionDescription}>{section.description}</Text>
                </View>
              </View>

              <View style={styles.checkList}>
                {section.checks.map((check) => (
                  <View key={check} style={styles.checkItem}>
                    <Text style={[styles.checkBullet, { color: section.accent }]}>+</Text>
                    <Text style={styles.checkText}>{check}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footerPanel}>
          <Text style={styles.footerTitle}>Release Outcome</Text>
          <Text style={styles.footerText}>
            Clean production builds, complete store metadata, verified purchases, accurate
            privacy disclosures, and a review-ready submission path for App Store Connect
            and Google Play Console.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#070b14',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },
  hero: {
    gap: 18,
    marginBottom: 28,
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.45)',
    backgroundColor: 'rgba(37, 99, 235, 0.14)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  badgeText: {
    color: '#bfdbfe',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  title: {
    color: '#f8fafc',
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '800',
    letterSpacing: 0,
    maxWidth: 900,
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 820,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  statCard: {
    minWidth: 170,
    flexGrow: 1,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderRadius: 8,
    padding: 16,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
    marginBottom: 6,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  timeline: {
    gap: 14,
  },
  sectionCard: {
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 18,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 14,
  },
  stepMarker: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.7)',
  },
  stepNumber: {
    fontSize: 13,
    fontWeight: '800',
  },
  sectionTitleGroup: {
    flex: 1,
    gap: 7,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
  },
  sectionDescription: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
  },
  checkList: {
    gap: 10,
    marginTop: 16,
    paddingLeft: 60,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },
  checkBullet: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 1,
  },
  checkText: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 21,
  },
  footerPanel: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 238, 0.3)',
    backgroundColor: 'rgba(8, 47, 73, 0.36)',
    borderRadius: 8,
    padding: 18,
  },
  footerTitle: {
    color: '#ecfeff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  footerText: {
    color: '#bae6fd',
    fontSize: 15,
    lineHeight: 23,
  },
});
