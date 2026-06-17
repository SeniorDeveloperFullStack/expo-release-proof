const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const baseUrl = process.env.LAUNCHPILOT_URL || 'http://localhost:8082';
const screenshotDir = path.join(__dirname, '..', 'screenshots');
const waitAfterClickMs = 650;

const screenshots = {
  dashboard: path.join(screenshotDir, 'launchpilot-dashboard.png'),
  newProject: path.join(screenshotDir, 'launchpilot-new-project.png'),
  checklist: path.join(screenshotDir, 'launchpilot-checklist.png'),
  timeline: path.join(screenshotDir, 'launchpilot-timeline.png'),
  premium: path.join(screenshotDir, 'launchpilot-premium.png'),
  settings: path.join(screenshotDir, 'launchpilot-settings.png'),
};

async function clickFirstVisible(page, candidates, description) {
  for (const candidate of candidates) {
    const locator =
      candidate.type === 'role'
        ? page.getByRole(candidate.role, { name: candidate.name })
        : page.getByText(candidate.text, { exact: candidate.exact ?? true });

    const count = await locator.count();
    for (let index = 0; index < count; index += 1) {
      const item = locator.nth(index);
      if (await item.isVisible().catch(() => false)) {
        await item.click();
        await page.waitForTimeout(waitAfterClickMs);
        return;
      }
    }
  }

  throw new Error(`Could not find a visible control for ${description}.`);
}

async function saveScreenshot(page, filePath) {
  await page.screenshot({ path: filePath, fullPage: false });
  console.log(`Saved ${path.relative(process.cwd(), filePath)}`);
}

async function dismissOnboardingIfNeeded(page) {
  const onboardingButton = page.getByRole('button', { name: /open dashboard/i });
  if ((await onboardingButton.count()) > 0 && (await onboardingButton.first().isVisible())) {
    await onboardingButton.first().click();
    await page.waitForTimeout(waitAfterClickMs);
  }
}

async function main() {
  fs.mkdirSync(screenshotDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  try {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => undefined);
    await page.waitForTimeout(1000);
    await dismissOnboardingIfNeeded(page);
    await page.getByText(/LaunchPilot/i).first().waitFor({ state: 'visible', timeout: 30000 });

    await saveScreenshot(page, screenshots.dashboard);

    await clickFirstVisible(
      page,
      [
        { type: 'role', role: 'button', name: /new project/i },
        { type: 'text', text: 'New Project' },
        { type: 'text', text: 'Create project' },
      ],
      'New Project'
    );
    await page.getByText(/Create project/i).first().waitFor({ state: 'visible', timeout: 10000 });
    await saveScreenshot(page, screenshots.newProject);

    await clickFirstVisible(
      page,
      [
        { type: 'role', role: 'button', name: /close new project modal/i },
        { type: 'role', role: 'button', name: /close/i },
      ],
      'close modal'
    );

    await clickFirstVisible(
      page,
      [
        { type: 'role', role: 'button', name: /checklist tab/i },
        { type: 'role', role: 'button', name: /checklist/i },
        { type: 'text', text: 'Checklist' },
        { type: 'text', text: 'Fitness Tracker App' },
      ],
      'Checklist tab'
    );
    await page.getByText(/Expo \/ React Native Project Audit/i).waitFor({
      state: 'visible',
      timeout: 10000,
    });
    await saveScreenshot(page, screenshots.checklist);

    await clickFirstVisible(
      page,
      [
        { type: 'role', role: 'button', name: /timeline tab/i },
        { type: 'role', role: 'button', name: /timeline/i },
        { type: 'text', text: 'Timeline' },
      ],
      'Timeline tab'
    );
    await page.getByText(/Release timeline/i).waitFor({ state: 'visible', timeout: 10000 });
    await saveScreenshot(page, screenshots.timeline);

    await clickFirstVisible(
      page,
      [
        { type: 'role', role: 'button', name: /pro tab/i },
        { type: 'role', role: 'button', name: /premium/i },
        { type: 'text', text: 'Pro' },
        { type: 'text', text: 'LaunchPilot Pro' },
      ],
      'Pro tab'
    );
    await page.getByText(/LaunchPilot Pro/i).waitFor({ state: 'visible', timeout: 10000 });
    await saveScreenshot(page, screenshots.premium);

    await clickFirstVisible(
      page,
      [
        { type: 'role', role: 'button', name: /settings tab/i },
        { type: 'role', role: 'button', name: /settings/i },
        { type: 'text', text: 'Settings' },
      ],
      'Settings tab'
    );
    await page.getByText(/App version/i).waitFor({ state: 'visible', timeout: 10000 });
    await saveScreenshot(page, screenshots.settings);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
