import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(projectRoot, "upwork-screenshots");
const baseUrl = "https://staynest-vacation-rental.vercel.app";

const captions = [
  "01-homepage-hero.png — Elegant vacation rental landing page with strong hero section and booking-focused CTA.",
  "02-property-listings.png — Property listing page showing 4 short-term rental homes with pricing, guests, bedrooms, and bathrooms.",
  "03-property-detail-gallery.png — Detailed rental page with image gallery, amenities, pricing, location, and guest information.",
  "04-booking-api-integration.png — Hostaway-style booking and availability section using mock API data to demonstrate integration readiness.",
  "05-mobile-responsive.png — Responsive mobile layout for smooth browsing on phones and tablets.",
];

const shots = [
  {
    name: "01-homepage-hero.png",
    url: `${baseUrl}/`,
    viewport: { width: 1440, height: 900 },
    waitFor: "main",
  },
  {
    name: "02-property-listings.png",
    url: `${baseUrl}/properties`,
    viewport: { width: 1440, height: 900 },
    waitFor: ".property-card",
  },
  {
    name: "03-property-detail-gallery.png",
    url: `${baseUrl}/properties/casa-alba`,
    viewport: { width: 1440, height: 900 },
    waitFor: ".gallery",
  },
  {
    name: "04-booking-api-integration.png",
    url: `${baseUrl}/properties/casa-alba`,
    viewport: { width: 1440, height: 900 },
    waitFor: ".availability-section, .booking-card, #hostaway-demo",
    scrollTo: "#hostaway-demo",
    requireNoLoadingText: true,
  },
  {
    name: "05-mobile-responsive.png",
    url: `${baseUrl}/properties/casa-alba`,
    viewport: { width: 390, height: 844 },
    waitFor: ".gallery",
  },
];

async function verifyApi(page, url, validate) {
  const response = await page.request.get(url);
  const json = await response.json();
  if (!response.ok()) {
    throw new Error(`${url} returned ${response.status()}: ${JSON.stringify(json)}`);
  }
  validate(json);
  return json;
}

async function waitForBookingData(page) {
  await page.waitForFunction(
    () => !document.body.innerText.includes("Loading booking data"),
    null,
    { timeout: 15000 },
  );
  await page.waitForSelector(".booking-card, .api-error", { timeout: 15000 });
  const hasError = await page.locator(".api-error").count();
  if (hasError > 0) {
    const errorText = await page.locator(".api-error").first().innerText();
    throw new Error(`Booking API error visible on page: ${errorText}`);
  }
}

async function captureShot(browser, shot) {
  const page = await browser.newPage({ viewport: shot.viewport, deviceScaleFactor: 1 });
  await page.goto(shot.url, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForSelector(shot.waitFor, { timeout: 20000 });

  if (shot.requireNoLoadingText) {
    await waitForBookingData(page);
  }

  if (shot.scrollTo) {
    await page.locator(shot.scrollTo).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await waitForBookingData(page);
  }

  await page.screenshot({
    path: path.join(outputDir, shot.name),
    fullPage: false,
  });

  await page.close();
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "captions.txt"), `${captions.join("\n")}\n`, "utf8");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const listings = await verifyApi(page, `${baseUrl}/api/hostaway/listings`, (json) => {
    if (json.count !== 4 || !Array.isArray(json.listings) || json.listings.length !== 4) {
      throw new Error("Listings API did not return exactly 4 mock properties.");
    }
  });

  const availability = await verifyApi(page, `${baseUrl}/api/hostaway/availability?propertySlug=casa-alba`, (json) => {
    if (!json.listing || json.listing.propertySlug !== "casa-alba" || !Array.isArray(json.availability)) {
      throw new Error("Availability API did not return Casa Alba availability JSON.");
    }
  });

  await page.close();

  for (const shot of shots) {
    await captureShot(browser, shot);
    console.log(`Created ${shot.name}`);
  }

  await browser.close();

  console.log("\nFinal checklist");
  console.log(`- screenshots created: ${shots.length}`);
  console.log(`- API listings endpoint works: ${listings.count === 4}`);
  console.log(`- API availability endpoint works: ${availability.listing.propertySlug === "casa-alba"}`);
  console.log("- no \"Loading booking data\" visible in booking screenshot: true");
  console.log(`- screenshot folder location: ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
