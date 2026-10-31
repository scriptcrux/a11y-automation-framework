import pa11y from 'pa11y';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runPa11yAudit() {
  const reportDir = path.resolve(__dirname, '..', 'test-results', 'pa11y-reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  console.log('='.repeat(70));
  console.log('Starting Automated Pa11y Accessibility Audit Runner');
  console.log('Standard: WCAG2AA (ISO/IEC 40500)');
  console.log('='.repeat(70));

  // Spin up local Vite server programmatically if needed
  let viteServer = null;
  const port = 3000;
  const baseUrl = `http://localhost:${port}`;

  try {
    const isRunning = await fetch(baseUrl).then(() => true).catch(() => false);
    if (!isRunning) {
      console.log('Starting local Vite server on port 3000...');
      viteServer = await createServer({
        configFile: path.resolve(__dirname, '..', 'vite.config.ts'),
        server: { port, strictPort: true }
      });
      await viteServer.listen();
      console.log(`Server listening at ${baseUrl}`);
    } else {
      console.log(`Connected to existing server at ${baseUrl}`);
    }
  } catch (e) {
    console.log(`Proceeding to test against ${baseUrl}...`);
  }

  const routes = [
    { name: 'Dashboard Page', path: '/' }
  ];

  const allResults = [];

  for (const route of routes) {
    const targetUrl = `${baseUrl}${route.path}`;
    console.log(`\nAuditing route [${route.name}] (${targetUrl})...`);

    try {
      const results = await pa11y(targetUrl, {
        standard: 'WCAG2AA',
        timeout: 30000,
        chromeLaunchConfig: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });

      allResults.push({
        route: route.name,
        url: targetUrl,
        issueCount: results.issues.length,
        issues: results.issues
      });

      console.log(`Audit result for ${route.name}: ${results.issues.length} issue(s) reported.`);
      if (results.issues.length === 0) {
        console.log('✓ WCAG2AA Full Compliance achieved!');
      } else {
        results.issues.slice(0, 5).forEach((issue, idx) => {
          console.log(`  ${idx + 1}. [${issue.type.toUpperCase()}] ${issue.message}`);
          console.log(`     Selector: ${issue.selector}`);
        });
      }
    } catch (err) {
      console.error(`Error auditing ${route.name}:`, err.message);
    }
  }

  const outputPath = path.join(reportDir, 'pa11y-audit-summary.json');
  fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2), 'utf-8');
  console.log(`\nPa11y audit complete! Summary saved to: ${outputPath}`);

  if (viteServer) {
    await viteServer.close();
    console.log('Closed local Vite test server.');
  }
}

runPa11yAudit();
