import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type TabKey = 'dashboard' | 'checklist' | 'premium';

type LaunchProject = {
  id: string;
  appName: string;
  platform: string;
  status: string;
  accent: string;
};

type ChecklistItem = {
  id: string;
  label: string;
};

type ChecklistSection = {
  id: string;
  title: string;
  description: string;
  accent: string;
  items: ChecklistItem[];
};

type CheckedState = Record<string, boolean>;

const STORAGE_KEY = 'launchpilot.checked-items.v1';

const projects: LaunchProject[] = [
  {
    id: 'fitness-tracker',
    appName: 'Fitness Tracker App',
    platform: 'iOS + Android',
    status: 'Build audit',
    accent: '#60a5fa',
  },
  {
    id: 'saas-mobile',
    appName: 'SaaS Mobile App',
    platform: 'iOS + Android',
    status: 'Store prep',
    accent: '#34d399',
  },
  {
    id: 'ecommerce',
    appName: 'E-commerce App',
    platform: 'iOS + Android',
    status: 'Review ready',
    accent: '#f472b6',
  },
];

const checklistSections: ChecklistSection[] = [
  {
    id: 'project-audit',
    title: 'Expo / React Native Project Audit',
    description: 'Confirm the app is stable and store-ready before release setup.',
    accent: '#60a5fa',
    items: [
      { id: 'sdk-dependencies', label: 'Audit Expo SDK, native dependencies, and TypeScript health.' },
      { id: 'permissions-assets', label: 'Review permissions, icons, splash assets, and app metadata.' },
      { id: 'device-smoke-test', label: 'Run smoke tests across web, iOS simulator, and Android emulator.' },
    ],
  },
  {
    id: 'eas-builds',
    title: 'EAS Production Build Configuration',
    description: 'Prepare repeatable development, preview, and production build profiles.',
    accent: '#34d399',
    items: [
      { id: 'eas-json', label: 'Configure eas.json for development, preview, and production builds.' },
      { id: 'credentials', label: 'Verify credentials, bundle identifiers, package names, and signing.' },
      { id: 'versioning', label: 'Confirm version, build number, versionCode, and auto-increment strategy.' },
    ],
  },
  {
    id: 'ios-store',
    title: 'iOS TestFlight / App Store Connect Preparation',
    description: 'Prepare the iOS release path for TestFlight and App Store review.',
    accent: '#f472b6',
    items: [
      { id: 'ios-build', label: 'Create a production iOS build with the correct bundle identifier.' },
      { id: 'ios-metadata', label: 'Prepare screenshots, categories, review notes, and support details.' },
      { id: 'testflight', label: 'Upload to TestFlight and resolve App Store Connect warnings.' },
    ],
  },
  {
    id: 'android-store',
    title: 'Android AAB / Google Play Console Preparation',
    description: 'Prepare the Android App Bundle and Google Play release track.',
    accent: '#facc15',
    items: [
      { id: 'android-aab', label: 'Generate a signed production Android App Bundle.' },
      { id: 'play-listing', label: 'Complete store listing, content rating, app access, and target audience.' },
      { id: 'play-track', label: 'Upload the AAB to internal testing, closed testing, or production.' },
    ],
  },
  {
    id: 'privacy-review',
    title: 'Privacy Policy, Data Safety, and Review Checklist',
    description: 'Align product behavior with platform privacy and review requirements.',
    accent: '#a78bfa',
    items: [
      { id: 'privacy-policy', label: 'Prepare privacy policy URL and permission explanations.' },
      { id: 'data-safety', label: 'Complete App Store privacy labels and Google Play Data Safety.' },
      { id: 'review-access', label: 'Confirm demo access, login state, support URL, and restricted content rules.' },
    ],
  },
  {
    id: 'revenuecat',
    title: 'RevenueCat Products, Offerings, and Entitlement Check',
    description: 'Validate subscription products and entitlement behavior before submission.',
    accent: '#fb7185',
    items: [
      { id: 'store-products', label: 'Create matching products in App Store Connect and Google Play Console.' },
      { id: 'offerings', label: 'Map products to RevenueCat offerings, packages, and entitlements.' },
      { id: 'purchase-tests', label: 'Test sandbox purchase, restore, cancellation, expiration, and renewals.' },
    ],
  },
  {
    id: 'submission',
    title: 'Final Submission and Review Troubleshooting',
    description: 'Submit builds and track review issues with a clear fix workflow.',
    accent: '#22d3ee',
    items: [
      { id: 'final-qa', label: 'Run final QA on production builds and release notes.' },
      { id: 'submit-builds', label: 'Submit iOS and Android builds through EAS Submit or store consoles.' },
      { id: 'review-response', label: 'Track rejection reasons, warnings, metadata issues, and reviewer replies.' },
    ],
  },
];

const premiumFeatures = [
  'Unlimited launch projects',
  'RevenueCat subscription setup checklist',
  'Export launch checklist',
  'Rejection tracker',
  'Team collaboration',
];

const seededChecks: CheckedState = {
  'fitness-tracker:sdk-dependencies': true,
  'fitness-tracker:permissions-assets': true,
  'fitness-tracker:eas-json': true,
  'fitness-tracker:credentials': true,
  'fitness-tracker:ios-build': true,
  'saas-mobile:sdk-dependencies': true,
  'saas-mobile:permissions-assets': true,
  'saas-mobile:device-smoke-test': true,
  'saas-mobile:eas-json': true,
  'saas-mobile:credentials': true,
  'saas-mobile:versioning': true,
  'saas-mobile:privacy-policy': true,
  'ecommerce:sdk-dependencies': true,
  'ecommerce:permissions-assets': true,
  'ecommerce:device-smoke-test': true,
  'ecommerce:eas-json': true,
  'ecommerce:credentials': true,
  'ecommerce:versioning': true,
  'ecommerce:ios-build': true,
  'ecommerce:ios-metadata': true,
  'ecommerce:android-aab': true,
  'ecommerce:play-listing': true,
  'ecommerce:privacy-policy': true,
  'ecommerce:data-safety': true,
  'ecommerce:store-products': true,
  'ecommerce:offerings': true,
  'ecommerce:final-qa': true,
};

const allChecklistItems = checklistSections.flatMap((section) => section.items);
const totalChecklistItems = allChecklistItems.length;

function getStorageId(projectId: string, itemId: string) {
  return `${projectId}:${itemId}`;
}

function getProgress(projectId: string, checkedState: CheckedState) {
  const completeItems = allChecklistItems.filter(
    (item) => checkedState[getStorageId(projectId, item.id)]
  ).length;

  return Math.round((completeItems / totalChecklistItems) * 100);
}

function getCompletedCount(projectId: string, checkedState: CheckedState) {
  return allChecklistItems.filter((item) => checkedState[getStorageId(projectId, item.id)]).length;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0].id);
  const [checkedState, setCheckedState] = useState<CheckedState>(seededChecks);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0],
    [selectedProjectId]
  );

  const selectedProgress = getProgress(selectedProject.id, checkedState);
  const completedCount = getCompletedCount(selectedProject.id, checkedState);

  useEffect(() => {
    async function loadChecks() {
      try {
        const storedChecks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedChecks) {
          setCheckedState(JSON.parse(storedChecks) as CheckedState);
        }
      } catch {
        setCheckedState(seededChecks);
      } finally {
        setHasLoadedStorage(true);
      }
    }

    loadChecks();
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(checkedState)).catch(() => undefined);
  }, [checkedState, hasLoadedStorage]);

  function selectProject(projectId: string) {
    setSelectedProjectId(projectId);
    setActiveTab('checklist');
  }

  function toggleChecklistItem(itemId: string) {
    const storageId = getStorageId(selectedProject.id, itemId);
    setCheckedState((current) => ({
      ...current,
      [storageId]: !current[storageId],
    }));
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.appShell}>
        <Header progress={selectedProgress} selectedProject={selectedProject} />

        <View style={styles.tabBar}>
          <NavTab label="Dashboard" tabKey="dashboard" activeTab={activeTab} onPress={setActiveTab} />
          <NavTab label="Checklist" tabKey="checklist" activeTab={activeTab} onPress={setActiveTab} />
          <NavTab label="Premium" tabKey="premium" activeTab={activeTab} onPress={setActiveTab} />
        </View>

        {activeTab === 'dashboard' && (
          <DashboardScreen
            checkedState={checkedState}
            onSelectProject={selectProject}
            selectedProjectId={selectedProject.id}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistScreen
            checkedState={checkedState}
            completedCount={completedCount}
            onToggleItem={toggleChecklistItem}
            progress={selectedProgress}
            selectedProject={selectedProject}
          />
        )}

        {activeTab === 'premium' && <PremiumScreen />}
      </View>
    </View>
  );
}

function Header({
  progress,
  selectedProject,
}: {
  progress: number;
  selectedProject: LaunchProject;
}) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.eyebrow}>LaunchPilot</Text>
        <Text style={styles.appTitle}>Mobile launch command center</Text>
      </View>
      <View style={styles.headerPill}>
        <Text style={styles.headerPillLabel}>{selectedProject.appName}</Text>
        <Text style={styles.headerPillValue}>{progress}% ready</Text>
      </View>
    </View>
  );
}

function NavTab({
  activeTab,
  label,
  onPress,
  tabKey,
}: {
  activeTab: TabKey;
  label: string;
  onPress: (tabKey: TabKey) => void;
  tabKey: TabKey;
}) {
  const isActive = activeTab === tabKey;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(tabKey)}
      style={[styles.navTab, isActive && styles.navTabActive]}
    >
      <Text style={[styles.navTabText, isActive && styles.navTabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function DashboardScreen({
  checkedState,
  onSelectProject,
  selectedProjectId,
}: {
  checkedState: CheckedState;
  onSelectProject: (projectId: string) => void;
  selectedProjectId: string;
}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.heroBlock}>
        <Text style={styles.heroTitle}>Launch projects</Text>
        <Text style={styles.heroText}>
          Track store readiness across Expo and React Native launches from audit to review response.
        </Text>
      </View>

      <View style={styles.projectGrid}>
        {projects.map((project) => (
          <ProjectCard
            checkedState={checkedState}
            isSelected={selectedProjectId === project.id}
            key={project.id}
            onPress={() => onSelectProject(project.id)}
            project={project}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function ProjectCard({
  checkedState,
  isSelected,
  onPress,
  project,
}: {
  checkedState: CheckedState;
  isSelected: boolean;
  onPress: () => void;
  project: LaunchProject;
}) {
  const progress = getProgress(project.id, checkedState);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.projectCard,
        isSelected && { borderColor: project.accent, backgroundColor: '#111c31' },
      ]}
    >
      <View style={[styles.projectAccent, { backgroundColor: project.accent }]} />
      <View style={styles.projectCardTop}>
        <View style={styles.projectIcon}>
          <Text style={[styles.projectIconText, { color: project.accent }]}>
            {project.appName.slice(0, 1)}
          </Text>
        </View>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{project.status}</Text>
        </View>
      </View>

      <Text style={styles.projectName}>{project.appName}</Text>
      <Text style={styles.projectPlatform}>{project.platform}</Text>

      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={styles.progressValue}>{progress}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { backgroundColor: project.accent, width: `${progress}%` },
          ]}
        />
      </View>
    </Pressable>
  );
}

function ChecklistScreen({
  checkedState,
  completedCount,
  onToggleItem,
  progress,
  selectedProject,
}: {
  checkedState: CheckedState;
  completedCount: number;
  onToggleItem: (itemId: string) => void;
  progress: number;
  selectedProject: LaunchProject;
}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.checklistSummary}>
        <View>
          <Text style={styles.screenKicker}>Active checklist</Text>
          <Text style={styles.screenTitle}>{selectedProject.appName}</Text>
          <Text style={styles.screenText}>
            {completedCount} of {totalChecklistItems} tasks complete for {selectedProject.platform}.
          </Text>
        </View>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{progress}%</Text>
        </View>
      </View>

      <View style={styles.sectionList}>
        {checklistSections.map((section) => (
          <ChecklistSectionCard
            checkedState={checkedState}
            key={section.id}
            onToggleItem={onToggleItem}
            projectId={selectedProject.id}
            section={section}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function ChecklistSectionCard({
  checkedState,
  onToggleItem,
  projectId,
  section,
}: {
  checkedState: CheckedState;
  onToggleItem: (itemId: string) => void;
  projectId: string;
  section: ChecklistSection;
}) {
  const completeItems = section.items.filter(
    (item) => checkedState[getStorageId(projectId, item.id)]
  ).length;

  return (
    <View style={styles.sectionCard}>
      <View style={[styles.sectionAccent, { backgroundColor: section.accent }]} />
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleGroup}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionDescription}>{section.description}</Text>
        </View>
        <Text style={styles.sectionCount}>
          {completeItems}/{section.items.length}
        </Text>
      </View>

      <View style={styles.itemList}>
        {section.items.map((item) => {
          const isChecked = Boolean(checkedState[getStorageId(projectId, item.id)]);

          return (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              key={item.id}
              onPress={() => onToggleItem(item.id)}
              style={styles.checkItem}
            >
              <View
                style={[
                  styles.checkbox,
                  isChecked && { backgroundColor: section.accent, borderColor: section.accent },
                ]}
              >
                {isChecked && <Text style={styles.checkboxMark}>✓</Text>}
              </View>
              <Text style={[styles.checkText, isChecked && styles.checkTextComplete]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function PremiumScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.premiumHero}>
        <Text style={styles.screenKicker}>LaunchPilot Premium</Text>
        <Text style={styles.premiumTitle}>Scale launch operations without losing the details.</Text>
        <Text style={styles.premiumText}>
          Premium is designed for teams managing multiple store releases, subscription setup,
          reviewer feedback, and launch documentation.
        </Text>
      </View>

      <View style={styles.premiumList}>
        {premiumFeatures.map((feature) => (
          <View key={feature} style={styles.premiumFeature}>
            <View style={styles.premiumFeatureIcon}>
              <Text style={styles.premiumFeatureIconText}>+</Text>
            </View>
            <Text style={styles.premiumFeatureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={styles.notePanel}>
        <Text style={styles.noteTitle}>MVP note</Text>
        <Text style={styles.noteText}>
          This screen outlines realistic upgrade features without claiming store publication or
          linking to live App Store or Google Play listings.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#070b14',
  },
  appShell: {
    flex: 1,
    width: '100%',
    maxWidth: 980,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  eyebrow: {
    color: '#7dd3fc',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 6,
  },
  appTitle: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 34,
  },
  headerPill: {
    borderColor: 'rgba(125, 211, 252, 0.28)',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(14, 116, 144, 0.18)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerPillLabel: {
    color: '#bae6fd',
    fontSize: 12,
    fontWeight: '700',
  },
  headerPillValue: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },
  tabBar: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    padding: 5,
  },
  navTab: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  navTabActive: {
    backgroundColor: '#1d4ed8',
  },
  navTabText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '800',
  },
  navTabTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 34,
  },
  heroBlock: {
    borderColor: 'rgba(96, 165, 250, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#0f172a',
    marginBottom: 14,
    padding: 18,
  },
  heroTitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    marginBottom: 8,
  },
  heroText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 23,
  },
  projectGrid: {
    gap: 14,
  },
  projectCard: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 18,
  },
  projectAccent: {
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  projectCardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  projectIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  projectIconText: {
    fontSize: 20,
    fontWeight: '900',
  },
  statusPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderColor: 'rgba(148, 163, 184, 0.22)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  statusText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '800',
  },
  projectName: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
  },
  projectPlatform: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  progressLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  progressValue: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '900',
  },
  progressTrack: {
    backgroundColor: '#1e293b',
    borderRadius: 999,
    height: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  checklistSummary: {
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 14,
    padding: 18,
  },
  screenKicker: {
    color: '#7dd3fc',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 6,
  },
  screenTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  screenText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  scoreCircle: {
    alignItems: 'center',
    backgroundColor: '#082f49',
    borderColor: 'rgba(125, 211, 252, 0.35)',
    borderRadius: 40,
    borderWidth: 1,
    height: 78,
    justifyContent: 'center',
    width: 78,
  },
  scoreText: {
    color: '#e0f2fe',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionList: {
    gap: 14,
  },
  sectionCard: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 18,
  },
  sectionAccent: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  sectionTitleGroup: {
    flex: 1,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  sectionDescription: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  sectionCount: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '900',
  },
  itemList: {
    gap: 10,
    marginTop: 16,
  },
  checkItem: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(2, 6, 23, 0.38)',
    borderColor: 'rgba(148, 163, 184, 0.13)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#64748b',
    borderRadius: 6,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    marginTop: 1,
    width: 22,
  },
  checkboxMark: {
    color: '#07111f',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 17,
  },
  checkText: {
    color: '#e2e8f0',
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  checkTextComplete: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  premiumHero: {
    backgroundColor: '#111827',
    borderColor: 'rgba(251, 191, 36, 0.24)',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    padding: 20,
  },
  premiumTitle: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
    marginBottom: 10,
  },
  premiumText: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 23,
  },
  premiumList: {
    gap: 10,
  },
  premiumFeature: {
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  premiumFeatureIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(250, 204, 21, 0.14)',
    borderColor: 'rgba(250, 204, 21, 0.35)',
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  premiumFeatureIconText: {
    color: '#facc15',
    fontSize: 18,
    fontWeight: '900',
  },
  premiumFeatureText: {
    color: '#f8fafc',
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  notePanel: {
    backgroundColor: 'rgba(8, 47, 73, 0.36)',
    borderColor: 'rgba(34, 211, 238, 0.24)',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  noteTitle: {
    color: '#ecfeff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },
  noteText: {
    color: '#bae6fd',
    fontSize: 14,
    lineHeight: 21,
  },
});
