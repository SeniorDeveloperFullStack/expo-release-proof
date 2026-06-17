import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState, type ComponentType } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  AlertTriangle,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Crown,
  Download,
  LayoutDashboard,
  ListChecks,
  Mail,
  Plus,
  Rocket,
  Settings,
  ShieldCheck,
  Smartphone,
  Store,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react-native';

type TabKey = 'dashboard' | 'checklist' | 'timeline' | 'premium' | 'settings';
type PlatformOption = 'iOS' | 'Android' | 'Both';
type ReleaseType = 'New App' | 'Update' | 'Subscription Launch';
type ProjectStatus = 'In Progress' | 'Review Ready' | 'Needs Attention';
type TimelineStatus = 'Done' | 'Current' | 'Pending';
type GradientColors = [string, string, ...string[]];
type IconComponent = ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;

type Project = {
  id: string;
  appName: string;
  platform: PlatformOption;
  releaseType: ReleaseType;
  status: ProjectStatus;
  deadline: string;
  gradient: GradientColors;
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
  icon: IconComponent;
  accent: string;
  items: ChecklistItem[];
};

type TimelineItem = {
  id: string;
  title: string;
  description: string;
  status: TimelineStatus;
};

type CheckedState = Record<string, boolean>;

const PROJECTS_KEY = 'launchpilot.projects.v2';
const CHECKS_KEY = 'launchpilot.checks.v2';
const ONBOARDING_KEY = 'launchpilot.onboarding.v2';

const platformLabels: Record<PlatformOption, string> = {
  iOS: 'iOS',
  Android: 'Android',
  Both: 'iOS + Android',
};

const defaultProjects: Project[] = [
  {
    id: 'fitness-tracker',
    appName: 'Fitness Tracker App',
    platform: 'Both',
    releaseType: 'New App',
    status: 'In Progress',
    deadline: 'Jul 12, 2026',
    gradient: ['#0f172a', '#1d4ed8', '#0e7490'],
    accent: '#60a5fa',
  },
  {
    id: 'saas-mobile',
    appName: 'SaaS Mobile App',
    platform: 'Both',
    releaseType: 'Subscription Launch',
    status: 'Needs Attention',
    deadline: 'Jul 05, 2026',
    gradient: ['#111827', '#7f1d1d', '#be123c'],
    accent: '#fb7185',
  },
  {
    id: 'ecommerce',
    appName: 'E-commerce App',
    platform: 'Both',
    releaseType: 'Update',
    status: 'Review Ready',
    deadline: 'Jun 28, 2026',
    gradient: ['#0f172a', '#166534', '#0f766e'],
    accent: '#34d399',
  },
];

const checklistSections: ChecklistSection[] = [
  {
    id: 'project-audit',
    title: 'Expo / React Native Project Audit',
    description: 'Confirm the app is stable, testable, and ready for release setup.',
    icon: ClipboardCheck,
    accent: '#60a5fa',
    items: [
      { id: 'sdk-dependencies', label: 'Audit Expo SDK, native dependencies, TypeScript, and package health.' },
      { id: 'permissions-assets', label: 'Review permissions, app icon, splash screen, and app metadata.' },
      { id: 'device-smoke-test', label: 'Run smoke tests on web, iOS simulator, and Android emulator.' },
    ],
  },
  {
    id: 'eas-builds',
    title: 'EAS Production Build Configuration',
    description: 'Set up repeatable build profiles for QA, preview, and store submission.',
    icon: Rocket,
    accent: '#22d3ee',
    items: [
      { id: 'eas-json', label: 'Configure eas.json development, preview, and production profiles.' },
      { id: 'credentials', label: 'Verify signing credentials, bundle identifier, and Android package name.' },
      { id: 'versioning', label: 'Confirm app version, build number, versionCode, and auto-increment rules.' },
    ],
  },
  {
    id: 'ios-store',
    title: 'iOS TestFlight / App Store Connect Preparation',
    description: 'Prepare the iOS binary, metadata, and TestFlight review path.',
    icon: Store,
    accent: '#a78bfa',
    items: [
      { id: 'ios-build', label: 'Create a production iOS build with the correct bundle identifier.' },
      { id: 'ios-metadata', label: 'Prepare screenshots, category, age rating, support details, and notes.' },
      { id: 'testflight', label: 'Upload to TestFlight and resolve App Store Connect warnings.' },
    ],
  },
  {
    id: 'android-store',
    title: 'Android AAB / Google Play Console Preparation',
    description: 'Prepare a signed Android App Bundle and Play Console release track.',
    icon: Smartphone,
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
    description: 'Align app behavior with store privacy and policy requirements.',
    icon: ShieldCheck,
    accent: '#38bdf8',
    items: [
      { id: 'privacy-policy', label: 'Prepare privacy policy URL and permission explanations.' },
      { id: 'data-safety', label: 'Complete App Store privacy labels and Google Play Data Safety.' },
      { id: 'review-access', label: 'Confirm demo access, login flows, support URL, and restricted content rules.' },
    ],
  },
  {
    id: 'revenuecat',
    title: 'RevenueCat Products, Offerings, and Entitlement Check',
    description: 'Validate subscription setup before review begins.',
    icon: Crown,
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
    description: 'Submit the release and track review issues through resolution.',
    icon: CheckCircle2,
    accent: '#34d399',
    items: [
      { id: 'final-qa', label: 'Run final QA on production builds, release notes, and reviewer access.' },
      { id: 'submit-builds', label: 'Submit iOS and Android builds through EAS Submit or store consoles.' },
      { id: 'review-response', label: 'Track rejection reasons, metadata issues, binary warnings, and replies.' },
    ],
  },
];

const allChecklistItems = checklistSections.flatMap((section) => section.items);
const totalChecklistItems = allChecklistItems.length;

const defaultCheckedState: CheckedState = buildDefaultCheckedState();

const releaseTypes: ReleaseType[] = ['New App', 'Update', 'Subscription Launch'];
const platformOptions: PlatformOption[] = ['iOS', 'Android', 'Both'];

function buildDefaultCheckedState() {
  const checked: CheckedState = {};
  const seedCounts: Record<string, number> = {
    'fitness-tracker': 11,
    'saas-mobile': 14,
    ecommerce: 18,
  };

  defaultProjects.forEach((project) => {
    allChecklistItems.slice(0, seedCounts[project.id]).forEach((item) => {
      checked[getStorageId(project.id, item.id)] = true;
    });
  });

  return checked;
}

function getStorageId(projectId: string, itemId: string) {
  return `${projectId}:${itemId}`;
}

function getCompletedCount(projectId: string, checkedState: CheckedState) {
  return allChecklistItems.filter((item) => checkedState[getStorageId(projectId, item.id)]).length;
}

function getProgress(projectId: string, checkedState: CheckedState) {
  return Math.round((getCompletedCount(projectId, checkedState) / totalChecklistItems) * 100);
}

function getAverageReadiness(projects: Project[], checkedState: CheckedState) {
  if (projects.length === 0) {
    return 0;
  }

  const total = projects.reduce((sum, project) => sum + getProgress(project.id, checkedState), 0);
  return Math.round(total / projects.length);
}

function getPendingTaskCount(projects: Project[], checkedState: CheckedState) {
  return projects.reduce(
    (sum, project) => sum + totalChecklistItems - getCompletedCount(project.id, checkedState),
    0
  );
}

function getDefaultDeadline() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function getTimelineItems(progress: number): TimelineItem[] {
  const steps = [
    {
      id: 'code-freeze',
      title: 'Code freeze',
      description: 'Feature scope is locked and release QA begins.',
    },
    {
      id: 'build-generated',
      title: 'Build generated',
      description: 'Production EAS builds are created for both platforms.',
    },
    {
      id: 'internal-testing',
      title: 'Internal testing',
      description: 'QA validates core flows, purchases, login, and restore behavior.',
    },
    {
      id: 'metadata-ready',
      title: 'Store metadata ready',
      description: 'Screenshots, descriptions, privacy forms, and review notes are prepared.',
    },
    {
      id: 'submitted-review',
      title: 'Submitted for review',
      description: 'Builds are submitted to App Store Connect and Google Play Console.',
    },
    {
      id: 'approved-released',
      title: 'Approved / released',
      description: 'Release is approved and scheduled or published by the owner.',
    },
  ];

  const currentIndex = Math.min(steps.length - 1, Math.floor(progress / 18));

  return steps.map((step, index) => ({
    ...step,
    status: index < currentIndex ? 'Done' : index === currentIndex ? 'Current' : 'Pending',
  }));
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(defaultProjects[0].id);
  const [checkedState, setCheckedState] = useState<CheckedState>(defaultCheckedState);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? projects[0],
    [projects, selectedProjectId]
  );

  const selectedProgress = selectedProject ? getProgress(selectedProject.id, checkedState) : 0;
  const averageReadiness = getAverageReadiness(projects, checkedState);
  const pendingTaskCount = getPendingTaskCount(projects, checkedState);
  const reviewRiskCount = projects.filter((project) => project.status === 'Needs Attention').length;

  useEffect(() => {
    async function loadStoredData() {
      try {
        const [storedProjects, storedChecks, storedOnboarding] = await Promise.all([
          AsyncStorage.getItem(PROJECTS_KEY),
          AsyncStorage.getItem(CHECKS_KEY),
          AsyncStorage.getItem(ONBOARDING_KEY),
        ]);

        if (storedProjects) {
          const parsedProjects = JSON.parse(storedProjects) as Project[];
          if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
            setProjects(parsedProjects);
            setSelectedProjectId(parsedProjects[0].id);
          }
        }

        if (storedChecks) {
          setCheckedState(JSON.parse(storedChecks) as CheckedState);
        }

        setOnboardingCompleted(storedOnboarding === 'true');
      } finally {
        setIsLoading(false);
      }
    }

    loadStoredData();
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)).catch(() => undefined);
  }, [isLoading, projects]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    AsyncStorage.setItem(CHECKS_KEY, JSON.stringify(checkedState)).catch(() => undefined);
  }, [checkedState, isLoading]);

  async function completeOnboarding() {
    setOnboardingCompleted(true);
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  }

  function openProject(projectId: string) {
    setSelectedProjectId(projectId);
    setActiveTab('checklist');
  }

  function toggleChecklistItem(itemId: string) {
    if (!selectedProject) {
      return;
    }

    const storageId = getStorageId(selectedProject.id, itemId);
    setCheckedState((current) => ({
      ...current,
      [storageId]: !current[storageId],
    }));
  }

  function createProject(appName: string, platform: PlatformOption, releaseType: ReleaseType) {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      appName,
      platform,
      releaseType,
      status: 'In Progress',
      deadline: getDefaultDeadline(),
      gradient: ['#111827', '#4338ca', '#7c3aed'],
      accent: '#a78bfa',
    };

    setProjects((current) => [newProject, ...current]);
    setSelectedProjectId(newProject.id);
    setActiveTab('checklist');
    setIsNewProjectOpen(false);
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <StatusBar style="light" />
        <View style={styles.loadingShell}>
          <Rocket color="#7dd3fc" size={34} strokeWidth={2.3} />
          <Text style={styles.loadingText}>Preparing LaunchPilot...</Text>
        </View>
      </View>
    );
  }

  if (!onboardingCompleted) {
    return (
      <OnboardingScreen onOpenDashboard={completeOnboarding} />
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.appShell}>
        <View style={styles.contentFrame}>
          {activeTab === 'dashboard' && (
            <DashboardScreen
              averageReadiness={averageReadiness}
              checkedState={checkedState}
              onNewProject={() => setIsNewProjectOpen(true)}
              onSelectProject={openProject}
              pendingTaskCount={pendingTaskCount}
              projects={projects}
              reviewRiskCount={reviewRiskCount}
              selectedProjectId={selectedProject?.id}
            />
          )}

          {activeTab === 'checklist' && selectedProject && (
            <ChecklistScreen
              checkedState={checkedState}
              onToggleItem={toggleChecklistItem}
              progress={selectedProgress}
              project={selectedProject}
            />
          )}

          {activeTab === 'timeline' && selectedProject && (
            <TimelineScreen progress={selectedProgress} project={selectedProject} />
          )}

          {activeTab === 'premium' && <PremiumScreen />}

          {activeTab === 'settings' && <SettingsScreen selectedProject={selectedProject} />}
        </View>

        <View style={styles.bottomTabBar}>
          <BottomTabButton
            activeTab={activeTab}
            icon={LayoutDashboard}
            label="Home"
            onPress={setActiveTab}
            tabKey="dashboard"
          />
          <BottomTabButton
            activeTab={activeTab}
            icon={ListChecks}
            label="Checklist"
            onPress={setActiveTab}
            tabKey="checklist"
          />
          <BottomTabButton
            activeTab={activeTab}
            icon={Clock3}
            label="Timeline"
            onPress={setActiveTab}
            tabKey="timeline"
          />
          <BottomTabButton
            activeTab={activeTab}
            icon={Crown}
            label="Pro"
            onPress={setActiveTab}
            tabKey="premium"
          />
          <BottomTabButton
            activeTab={activeTab}
            icon={Settings}
            label="Settings"
            onPress={setActiveTab}
            tabKey="settings"
          />
        </View>
      </View>

      <NewProjectModal
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={createProject}
        visible={isNewProjectOpen}
      />
    </View>
  );
}

function OnboardingScreen({ onOpenDashboard }: { onOpenDashboard: () => void }) {
  const benefits = [
    { icon: Rocket, title: 'Store-ready release workflow' },
    { icon: ClipboardCheck, title: 'App Store & Google Play checklist' },
    { icon: Crown, title: 'RevenueCat subscription readiness' },
  ];

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <LinearGradient colors={['#020617', '#0f172a', '#172554']} style={styles.onboarding}>
        <View style={styles.brandMark}>
          <Rocket color="#ffffff" size={34} strokeWidth={2.3} />
        </View>
        <Text style={styles.onboardingTitle}>LaunchPilot</Text>
        <Text style={styles.onboardingTagline}>Launch mobile apps with confidence.</Text>
        <Text style={styles.onboardingText}>
          Manage release tasks, store readiness, subscription setup, and review risks in one
          polished mobile-first workspace.
        </Text>

        <View style={styles.benefitList}>
          {benefits.map((benefit) => (
            <View key={benefit.title} style={styles.benefitCard}>
              <benefit.icon color="#7dd3fc" size={22} strokeWidth={2.2} />
              <Text style={styles.benefitText}>{benefit.title}</Text>
            </View>
          ))}
        </View>

        <GradientButton
          icon={LayoutDashboard}
          label="Open Dashboard"
          onPress={onOpenDashboard}
          style={styles.onboardingButton}
        />
      </LinearGradient>
    </View>
  );
}

function DashboardScreen({
  averageReadiness,
  checkedState,
  onNewProject,
  onSelectProject,
  pendingTaskCount,
  projects,
  reviewRiskCount,
  selectedProjectId,
}: {
  averageReadiness: number;
  checkedState: CheckedState;
  onNewProject: () => void;
  onSelectProject: (projectId: string) => void;
  pendingTaskCount: number;
  projects: Project[];
  reviewRiskCount: number;
  selectedProjectId?: string;
}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#0f172a', '#1e3a8a', '#0e7490']} style={styles.dashboardHero}>
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.kicker}>LaunchPilot</Text>
            <Text style={styles.dashboardTitle}>Ready to launch, Nghia?</Text>
            <Text style={styles.dashboardSubtitle}>
              Track App Store and Google Play readiness from build setup to review response.
            </Text>
          </View>
          <View style={styles.heroIcon}>
            <Zap color="#ffffff" size={26} strokeWidth={2.4} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsGrid}>
        <StatCard icon={Smartphone} label="Active projects" value={String(projects.length)} tone="#60a5fa" />
        <StatCard icon={Target} label="Average readiness" value={`${averageReadiness}%`} tone="#34d399" />
        <StatCard icon={ListChecks} label="Pending tasks" value={String(pendingTaskCount)} tone="#facc15" />
        <StatCard icon={AlertTriangle} label="Review Risks" value={String(reviewRiskCount)} tone="#fb7185" />
      </View>

      <View style={styles.sectionHeadingRow}>
        <View>
          <Text style={styles.sectionEyebrow}>Projects</Text>
          <Text style={styles.sectionHeading}>Launch dashboard</Text>
        </View>
        <GradientButton icon={Plus} label="New Project" onPress={onNewProject} compact />
      </View>

      <View style={styles.projectList}>
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

function ChecklistScreen({
  checkedState,
  onToggleItem,
  progress,
  project,
}: {
  checkedState: CheckedState;
  onToggleItem: (itemId: string) => void;
  progress: number;
  project: Project;
}) {
  const completeCount = getCompletedCount(project.id, checkedState);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={project.gradient} style={styles.detailHero}>
        <View style={styles.detailHeaderRow}>
          <View style={styles.detailCopy}>
            <Text style={styles.kicker}>Selected project</Text>
            <Text style={styles.detailTitle}>{project.appName}</Text>
            <Text style={styles.detailMeta}>
              {platformLabels[project.platform]} / {project.releaseType} / {project.deadline}
            </Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeValue}>{progress}%</Text>
            <Text style={styles.progressBadgeLabel}>ready</Text>
          </View>
        </View>
        <ProgressBar progress={progress} color={project.accent} />
        <Text style={styles.detailFooter}>
          {completeCount} of {totalChecklistItems} release tasks complete.
        </Text>
      </LinearGradient>

      <View style={styles.checklistStack}>
        {checklistSections.map((section) => (
          <ChecklistSectionCard
            checkedState={checkedState}
            key={section.id}
            onToggleItem={onToggleItem}
            projectId={project.id}
            section={section}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function TimelineScreen({ progress, project }: { progress: number; project: Project }) {
  const timelineItems = getTimelineItems(progress);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.screenHeader}>
        <Text style={styles.sectionEyebrow}>Release timeline</Text>
        <Text style={styles.screenTitle}>{project.appName}</Text>
        <Text style={styles.screenDescription}>
          A practical release path from code freeze through final approval.
        </Text>
      </View>

      <View style={styles.timelinePanel}>
        {timelineItems.map((item, index) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.timelineRail}>
              <View
                style={[
                  styles.timelineDot,
                  item.status === 'Done' && styles.timelineDotDone,
                  item.status === 'Current' && styles.timelineDotCurrent,
                ]}
              >
                {item.status === 'Done' && <Check color="#07111f" size={13} strokeWidth={3} />}
              </View>
              {index < timelineItems.length - 1 && <View style={styles.timelineLine} />}
            </View>
            <View style={styles.timelineCard}>
              <View style={styles.timelineTitleRow}>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                <Text
                  style={[
                    styles.timelineStatus,
                    item.status === 'Done' && styles.timelineStatusDone,
                    item.status === 'Current' && styles.timelineStatusCurrent,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
              <Text style={styles.timelineDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function PremiumScreen() {
  const features = [
    'Unlimited launch projects',
    'RevenueCat subscription setup checklist',
    'Export launch checklist',
    'Review rejection tracker',
    'Team collaboration',
    'Priority release support',
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={['#18181b', '#581c87', '#7f1d1d']} style={styles.premiumCard}>
        <View style={styles.planBadge}>
          <Crown color="#facc15" size={18} strokeWidth={2.4} />
          <Text style={styles.planBadgeText}>LaunchPilot Pro</Text>
        </View>
        <Text style={styles.priceText}>$9/month</Text>
        <Text style={styles.premiumLead}>
          Advanced launch operations for founders and teams preparing serious mobile releases.
        </Text>
        <GradientButton
          colors={['#f59e0b', '#f97316']}
          icon={Crown}
          label="Upgrade to Pro"
          onPress={() => undefined}
          style={styles.upgradeButton}
        />
      </LinearGradient>

      <View style={styles.featureStack}>
        {features.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Check color="#07111f" size={16} strokeWidth={3} />
            </View>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>Demo payment screen only</Text>
        <Text style={styles.noteText}>No real payment is processed.</Text>
      </View>
    </ScrollView>
  );
}

function SettingsScreen({ selectedProject }: { selectedProject?: Project }) {
  const settingsRows = [
    { icon: Smartphone, label: 'App version', value: '1.0.0' },
    { icon: Rocket, label: 'Release mode', value: 'Preparing for production' },
    { icon: Download, label: 'Export checklist', value: 'CSV export coming soon' },
    { icon: ShieldCheck, label: 'Privacy policy', value: 'Add your policy URL before launch' },
    { icon: Mail, label: 'Support email', value: 'Add your support inbox before launch' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <LinearGradient colors={['#2563eb', '#7c3aed']} style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>N</Text>
        </LinearGradient>
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>Nghia</Text>
          <Text style={styles.profileMeta}>Founder / mobile release owner</Text>
          {selectedProject && (
            <Text style={styles.profileProject}>Current project: {selectedProject.appName}</Text>
          )}
        </View>
      </View>

      <View style={styles.settingsList}>
        {settingsRows.map((row) => (
          <View key={row.label} style={styles.settingsRow}>
            <View style={styles.settingsIcon}>
              <row.icon color="#7dd3fc" size={19} strokeWidth={2.2} />
            </View>
            <View style={styles.settingsCopy}>
              <Text style={styles.settingsLabel}>{row.label}</Text>
              <Text style={styles.settingsValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function NewProjectModal({
  onClose,
  onCreateProject,
  visible,
}: {
  onClose: () => void;
  onCreateProject: (appName: string, platform: PlatformOption, releaseType: ReleaseType) => void;
  visible: boolean;
}) {
  const [appName, setAppName] = useState('');
  const [platform, setPlatform] = useState<PlatformOption>('Both');
  const [releaseType, setReleaseType] = useState<ReleaseType>('New App');

  function submitProject() {
    const trimmedName = appName.trim();
    if (!trimmedName) {
      return;
    }

    onCreateProject(trimmedName, platform, releaseType);
    setAppName('');
    setPlatform('Both');
    setReleaseType('New App');
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalKicker}>New launch project</Text>
              <Text style={styles.modalTitle}>Create project</Text>
            </View>
            <Pressable
              accessibilityLabel="Close new project modal"
              accessibilityRole="button"
              onPress={onClose}
              style={styles.iconButton}
            >
              <X color="#cbd5e1" size={21} strokeWidth={2.3} />
            </Pressable>
          </View>

          <Text style={styles.inputLabel}>App name</Text>
          <TextInput
            onChangeText={setAppName}
            placeholder="Example: Habit Tracker"
            placeholderTextColor="#64748b"
            style={styles.textInput}
            value={appName}
          />

          <OptionGroup
            label="Platform"
            options={platformOptions}
            selectedOption={platform}
            onSelect={setPlatform}
          />

          <OptionGroup
            label="Release type"
            options={releaseTypes}
            selectedOption={releaseType}
            onSelect={setReleaseType}
          />

          <GradientButton
            disabled={!appName.trim()}
            icon={Plus}
            label="Save Project"
            onPress={submitProject}
            style={styles.modalButton}
          />
        </View>
      </View>
    </Modal>
  );
}

function OptionGroup<T extends string>({
  label,
  onSelect,
  options,
  selectedOption,
}: {
  label: string;
  onSelect: (option: T) => void;
  options: T[];
  selectedOption: T;
}) {
  return (
    <View style={styles.optionGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.optionRow}>
        {options.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.optionPill, isSelected && styles.optionPillSelected]}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function StatCard({
  icon: Icon,
  label,
  tone,
  value,
}: {
  icon: IconComponent;
  label: string;
  tone: string;
  value: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: `${tone}22`, borderColor: `${tone}55` }]}>
        <Icon color={tone} size={19} strokeWidth={2.4} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  project: Project;
}) {
  const progress = getProgress(project.id, checkedState);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.projectPressable}>
      <LinearGradient
        colors={project.gradient}
        style={[styles.projectCard, isSelected && { borderColor: project.accent }]}
      >
        <View style={styles.projectCardHeader}>
          <View style={styles.projectIconBadge}>
            <Smartphone color="#ffffff" size={20} strokeWidth={2.3} />
          </View>
          <StatusBadge status={project.status} />
        </View>

        <Text style={styles.projectName}>{project.appName}</Text>
        <Text style={styles.projectMeta}>{platformLabels[project.platform]}</Text>

        <View style={styles.cardInfoRow}>
          <View style={styles.cardInfoPill}>
            <CalendarDays color="#bfdbfe" size={15} strokeWidth={2.3} />
            <Text style={styles.cardInfoText}>{project.deadline}</Text>
          </View>
          <Text style={styles.projectProgressText}>{progress}%</Text>
        </View>

        <ProgressBar color={project.accent} progress={progress} />
      </LinearGradient>
    </Pressable>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const statusColor = {
    'In Progress': '#60a5fa',
    'Review Ready': '#34d399',
    'Needs Attention': '#fb7185',
  }[status];

  return (
    <View style={[styles.statusBadge, { borderColor: `${statusColor}66` }]}>
      <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      <Text style={styles.statusBadgeText}>{status}</Text>
    </View>
  );
}

function ProgressBar({ color, progress }: { color: string; progress: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { backgroundColor: color, width: `${progress}%` }]} />
    </View>
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
    <View style={styles.checklistCard}>
      <View style={styles.checklistHeader}>
        <View style={[styles.checklistIcon, { backgroundColor: `${section.accent}22` }]}>
          <section.icon color={section.accent} size={21} strokeWidth={2.3} />
        </View>
        <View style={styles.checklistTitleGroup}>
          <Text style={styles.checklistTitle}>{section.title}</Text>
          <Text style={styles.checklistDescription}>{section.description}</Text>
        </View>
        <Text style={styles.checklistCount}>
          {completeItems}/{section.items.length}
        </Text>
      </View>

      <View style={styles.checkItems}>
        {section.items.map((item) => {
          const isChecked = Boolean(checkedState[getStorageId(projectId, item.id)]);

          return (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              key={item.id}
              onPress={() => onToggleItem(item.id)}
              style={[styles.checkItem, isChecked && styles.checkItemDone]}
            >
              <View
                style={[
                  styles.checkbox,
                  isChecked && { backgroundColor: section.accent, borderColor: section.accent },
                ]}
              >
                {isChecked && <Check color="#07111f" size={15} strokeWidth={3.2} />}
              </View>
              <Text style={[styles.checkText, isChecked && styles.checkTextDone]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BottomTabButton({
  activeTab,
  icon: Icon,
  label,
  onPress,
  tabKey,
}: {
  activeTab: TabKey;
  icon: IconComponent;
  label: string;
  onPress: (tabKey: TabKey) => void;
  tabKey: TabKey;
}) {
  const isActive = activeTab === tabKey;

  return (
    <Pressable
      accessibilityLabel={`${label} tab`}
      accessibilityRole="button"
      onPress={() => onPress(tabKey)}
      style={[styles.bottomTabButton, isActive && styles.bottomTabButtonActive]}
    >
      <Icon color={isActive ? '#ffffff' : '#94a3b8'} size={19} strokeWidth={2.4} />
      <Text style={[styles.bottomTabLabel, isActive && styles.bottomTabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function GradientButton({
  colors = ['#2563eb', '#06b6d4'],
  compact,
  disabled,
  icon: Icon,
  label,
  onPress,
  style,
}: {
  colors?: GradientColors;
  compact?: boolean;
  disabled?: boolean;
  icon?: IconComponent;
  label: string;
  onPress: () => void;
  style?: object;
}) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={style}>
      <LinearGradient
        colors={disabled ? ['#334155', '#1f2937'] : colors}
        style={[styles.gradientButton, compact && styles.gradientButtonCompact]}
      >
        {Icon && <Icon color="#ffffff" size={compact ? 16 : 19} strokeWidth={2.5} />}
        <Text style={[styles.gradientButtonText, compact && styles.gradientButtonTextCompact]}>
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingShell: {
    alignItems: 'center',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '800',
  },
  onboarding: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 22,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 28,
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    marginBottom: 22,
    width: 70,
  },
  onboardingTitle: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 50,
    textAlign: 'center',
  },
  onboardingTagline: {
    color: '#bae6fd',
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 28,
    marginTop: 10,
    textAlign: 'center',
  },
  onboardingText: {
    color: '#cbd5e1',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 14,
    maxWidth: 560,
    textAlign: 'center',
  },
  benefitList: {
    gap: 12,
    marginTop: 28,
    maxWidth: 560,
    width: '100%',
  },
  benefitCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderColor: 'rgba(148, 163, 184, 0.22)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 15,
  },
  benefitText: {
    color: '#f8fafc',
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  onboardingButton: {
    marginTop: 30,
    width: '100%',
    maxWidth: 560,
  },
  appShell: {
    alignSelf: 'center',
    flex: 1,
    maxWidth: 1040,
    paddingHorizontal: 16,
    paddingTop: 44,
    width: '100%',
  },
  contentFrame: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  dashboardHero: {
    borderColor: 'rgba(125, 211, 252, 0.18)',
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
    padding: 22,
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 18,
    justifyContent: 'space-between',
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 19,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  kicker: {
    color: '#bae6fd',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 8,
  },
  dashboardTitle: {
    color: '#ffffff',
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 37,
  },
  dashboardSubtitle: {
    color: '#dbeafe',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    maxWidth: 620,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
    borderColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 20,
    borderWidth: 1,
    flexGrow: 1,
    minWidth: 150,
    padding: 15,
  },
  statIcon: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    marginBottom: 13,
    width: 36,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionEyebrow: {
    color: '#7dd3fc',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  sectionHeading: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  projectList: {
    gap: 14,
  },
  projectPressable: {
    borderRadius: 24,
  },
  projectCard: {
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 18,
  },
  projectCardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  projectIconBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 17,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  statusBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.42)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  statusDot: {
    borderRadius: 5,
    height: 8,
    width: 8,
  },
  statusBadgeText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '900',
  },
  projectName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  projectMeta: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 4,
  },
  cardInfoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  cardInfoPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.46)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  cardInfoText: {
    color: '#dbeafe',
    fontSize: 12,
    fontWeight: '800',
  },
  projectProgressText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  progressTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    height: 9,
    marginTop: 13,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 999,
    height: '100%',
  },
  detailHero: {
    borderColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 15,
    padding: 20,
  },
  detailHeaderRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
  },
  detailCopy: {
    flex: 1,
  },
  detailTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  detailMeta: {
    color: '#dbeafe',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    marginTop: 8,
  },
  detailFooter: {
    color: '#e0f2fe',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
  },
  progressBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.42)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 82,
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  progressBadgeValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  progressBadgeLabel: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },
  checklistStack: {
    gap: 13,
  },
  checklistCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  checklistHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  checklistIcon: {
    alignItems: 'center',
    borderRadius: 15,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  checklistTitleGroup: {
    flex: 1,
  },
  checklistTitle: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 23,
  },
  checklistDescription: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 5,
  },
  checklistCount: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '900',
  },
  checkItems: {
    gap: 9,
    marginTop: 15,
  },
  checkItem: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(2, 6, 23, 0.4)',
    borderColor: 'rgba(148, 163, 184, 0.13)',
    borderRadius: 17,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  checkItemDone: {
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#64748b',
    borderRadius: 8,
    borderWidth: 2,
    height: 23,
    justifyContent: 'center',
    marginTop: 1,
    width: 23,
  },
  checkText: {
    color: '#e2e8f0',
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
  checkTextDone: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  screenHeader: {
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
    borderColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 14,
    padding: 18,
  },
  screenTitle: {
    color: '#f8fafc',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
  },
  screenDescription: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  timelinePanel: {
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineRail: {
    alignItems: 'center',
    width: 26,
  },
  timelineDot: {
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderColor: '#475569',
    borderRadius: 13,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  timelineDotDone: {
    backgroundColor: '#34d399',
    borderColor: '#34d399',
  },
  timelineDotCurrent: {
    backgroundColor: '#2563eb',
    borderColor: '#7dd3fc',
  },
  timelineLine: {
    backgroundColor: '#334155',
    flex: 1,
    minHeight: 58,
    width: 2,
  },
  timelineCard: {
    backgroundColor: 'rgba(2, 6, 23, 0.38)',
    borderColor: 'rgba(148, 163, 184, 0.13)',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    marginBottom: 12,
    padding: 14,
  },
  timelineTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  timelineTitle: {
    color: '#f8fafc',
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
  },
  timelineStatus: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '900',
  },
  timelineStatusDone: {
    color: '#34d399',
  },
  timelineStatusCurrent: {
    color: '#7dd3fc',
  },
  timelineDescription: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },
  premiumCard: {
    borderColor: 'rgba(250, 204, 21, 0.2)',
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
    padding: 22,
  },
  planBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(2, 6, 23, 0.45)',
    borderColor: 'rgba(250, 204, 21, 0.28)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  planBadgeText: {
    color: '#fef3c7',
    fontSize: 13,
    fontWeight: '900',
  },
  priceText: {
    color: '#ffffff',
    fontSize: 46,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 54,
    marginTop: 24,
  },
  premiumLead: {
    color: '#e5e7eb',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },
  upgradeButton: {
    marginTop: 24,
  },
  featureStack: {
    gap: 10,
  },
  featureRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  featureIcon: {
    alignItems: 'center',
    backgroundColor: '#34d399',
    borderRadius: 12,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  featureText: {
    color: '#f8fafc',
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  noteCard: {
    backgroundColor: 'rgba(8, 47, 73, 0.42)',
    borderColor: 'rgba(125, 211, 252, 0.22)',
    borderRadius: 18,
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
    fontWeight: '700',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    borderColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
    padding: 18,
  },
  profileAvatar: {
    alignItems: 'center',
    borderRadius: 25,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  profileInitial: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  profileCopy: {
    flex: 1,
  },
  profileName: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
  },
  profileMeta: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
  },
  profileProject: {
    color: '#7dd3fc',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
  },
  settingsList: {
    gap: 10,
  },
  settingsRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.86)',
    borderColor: 'rgba(148, 163, 184, 0.16)',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  settingsIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(14, 165, 233, 0.12)',
    borderRadius: 14,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  settingsCopy: {
    flex: 1,
  },
  settingsLabel: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '900',
  },
  settingsValue: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
  },
  bottomTabBar: {
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 25,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    marginBottom: 14,
    padding: 7,
  },
  bottomTabButton: {
    alignItems: 'center',
    borderRadius: 19,
    flex: 1,
    gap: 3,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 4,
  },
  bottomTabButtonActive: {
    backgroundColor: '#2563eb',
  },
  bottomTabLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '900',
  },
  bottomTabLabelActive: {
    color: '#ffffff',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#0f172a',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    borderRadius: 26,
    borderWidth: 1,
    maxWidth: 520,
    padding: 18,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  modalKicker: {
    color: '#7dd3fc',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalTitle: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#111827',
    borderColor: 'rgba(148, 163, 184, 0.18)',
    borderRadius: 15,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  inputLabel: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#020617',
    borderColor: 'rgba(148, 163, 184, 0.24)',
    borderRadius: 16,
    borderWidth: 1,
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    minHeight: 50,
    paddingHorizontal: 14,
  },
  optionGroup: {
    marginTop: 16,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    backgroundColor: '#020617',
    borderColor: 'rgba(148, 163, 184, 0.22)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  optionPillSelected: {
    backgroundColor: '#1d4ed8',
    borderColor: '#60a5fa',
  },
  optionText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '900',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  modalButton: {
    marginTop: 20,
  },
  gradientButton: {
    alignItems: 'center',
    borderRadius: 18,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  gradientButtonCompact: {
    borderRadius: 16,
    minHeight: 42,
    paddingHorizontal: 13,
  },
  gradientButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  gradientButtonTextCompact: {
    fontSize: 13,
  },
});
