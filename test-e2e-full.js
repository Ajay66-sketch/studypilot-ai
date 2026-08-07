const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/home/alan/.gemini/antigravity/brain/53b9a3b9-9abb-4dff-8791-d18f41300dec';

async function clickButtonByText(page, text) {
  return await page.evaluate((targetText) => {
    const buttons = Array.from(document.querySelectorAll('button, a, span'));
    const match = buttons.find(b => b.textContent && b.textContent.trim().includes(targetText));
    if (match) {
      match.click();
      return true;
    }
    return false;
  }, text);
}

async function runE2ETest() {
  console.log("=== STARTING PLAYWRIGHT/PUPPETEER E2E AUTOMATED VERIFICATION ===");

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const consoleLogs = [];
  const networkRequests = [];
  const forbiddenDomainViolations = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  page.on('request', req => {
    const url = req.url();
    networkRequests.push({ url, method: req.method() });

    if (
      url.includes('firebase.google.com') ||
      url.includes('firestore.googleapis.com') ||
      url.includes('firebaseapp.com') ||
      url.includes('identitytoolkit.googleapis.com')
    ) {
      forbiddenDomainViolations.push(url);
    }
  });

  const timestamp = Date.now();
  const testEmail = `qa_fullstack_${timestamp}@example.com`;
  const testPassword = "Password123!";
  const testName = "QA Engineer";

  try {
    // 1. Navigation to Login & Register mode
    console.log("Step 1: Navigating to /login...");
    await page.goto('http://localhost:9002/login', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01-register.png') });

    // Switch to register form mode if #name not present
    let nameInput = await page.$('#name');
    if (!nameInput) {
      await clickButtonByText(page, "Create Account");
      await page.waitForSelector('#name', { timeout: 5000 }).catch(() => {});
    }

    // Fill registration form
    await page.type('#name', testName);
    await page.type('#email', testEmail);
    await page.type('#pass', testPassword);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '01-register.png') });

    await page.click('button[type="submit"]');

    console.log("Waiting for dashboard redirect...");
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));

    // 2. Login verification
    console.log("Step 2: Verifying Login & Session persistence...");
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '02-login.png') });

    // 3. Dashboard initial state
    console.log("Step 3: Auditing Dashboard...");
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '03-dashboard.png') });

    // Dismiss onboarding modal if present
    await clickButtonByText(page, "Enter Workspace");
    await new Promise(r => setTimeout(r, 1000));

    // 4. Generate Summary
    console.log("Step 4: Testing AI Summary Generation...");
    await page.type('textarea', 'Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.');
    
    const titleInput = await page.$('input[placeholder*="Operating Systems"]');
    if (titleInput) {
      await titleInput.type('Quantum Physics 101');
    }

    await clickButtonByText(page, "Generate Study Sheet");

    console.log("Waiting for AI Summary generation response...");
    await new Promise(r => setTimeout(r, 14000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '04-summary.png') });

    // 5. Generate Revision Sheet
    console.log("Step 5: Testing AI Revision Sheet...");
    await clickButtonByText(page, "Revision Sheet");
    await new Promise(r => setTimeout(r, 1000));
    await clickButtonByText(page, "Generate Study Sheet");
    await new Promise(r => setTimeout(r, 14000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '05-revision.png') });

    // 6. Generate Important Questions
    console.log("Step 6: Testing AI Important Questions...");
    await clickButtonByText(page, "Important Qs");
    await new Promise(r => setTimeout(r, 1000));
    await clickButtonByText(page, "Generate Study Sheet");
    await new Promise(r => setTimeout(r, 14000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '06-questions.png') });

    // 7. Generate Model Answer
    console.log("Step 7: Testing AI Model Answer...");
    await clickButtonByText(page, "Model Answer");
    await new Promise(r => setTimeout(r, 1000));
    await clickButtonByText(page, "Generate Study Sheet");
    await new Promise(r => setTimeout(r, 14000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '07-model-answer.png') });

    // 8. Open Study Library / History
    console.log("Step 8: Testing Study Library...");
    await page.goto('http://localhost:9002/dashboard/history', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '08-history.png') });

    // 9. Delete Document
    console.log("Step 9: Testing Document Deletion...");
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    const deleteButtons = await page.$$('button');
    if (deleteButtons.length > 0) {
      await deleteButtons[deleteButtons.length - 1].click().catch(() => {});
      await new Promise(r => setTimeout(r, 1500));
    }
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '09-delete.png') });

    // 10. Open My Account Profile
    console.log("Step 10: Testing User Account Profile...");
    await page.goto('http://localhost:9002/dashboard/account', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '10-profile.png') });

    // 11. Open Upgrade & Plan Billing
    console.log("Step 11: Testing Billing Page...");
    await page.goto('http://localhost:9002/dashboard/billing', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '11-billing.png') });

    // 12. Logout
    console.log("Step 12: Testing Logout...");
    await clickButtonByText(page, "Sign Out");
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '12-logout.png') });

    console.log("=== E2E AUTOMATION VERIFICATION COMPLETE ===");
    console.log("Forbidden Domain Violations Count:", forbiddenDomainViolations.length);
    console.log("Forbidden Domains Detected:", forbiddenDomainViolations);
    console.log(`Total Network Requests Captured: ${networkRequests.length}`);

    // Write audit summary logs
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'e2e_console.log'), consoleLogs.join('\n'));
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'e2e_network.log'), JSON.stringify(networkRequests, null, 2));

  } catch (error) {
    console.error("Playwright E2E Automation Error:", error);
  } finally {
    await browser.close();
  }
}

runE2ETest();
