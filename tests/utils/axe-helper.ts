import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';
import fs from 'fs';
import path from 'path';

export const WCAG_TAGS = {
  WCAG_2_0_A: 'wcag2a',
  WCAG_2_0_AA: 'wcag2aa',
  WCAG_2_1_A: 'wcag21a',
  WCAG_2_1_AA: 'wcag21aa',
  WCAG_2_2_AA: 'wcag22aa',
  BEST_PRACTICE: 'best-practice'
} as const;

export const STANDARD_WCAG_AA_TAGS = [
  WCAG_TAGS.WCAG_2_0_A,
  WCAG_TAGS.WCAG_2_0_AA,
  WCAG_TAGS.WCAG_2_1_A,
  WCAG_TAGS.WCAG_2_1_AA,
  WCAG_TAGS.WCAG_2_2_AA
];

export interface AxeAuditOptions {
  tags?: string[];
  include?: string | string[];
  exclude?: string | string[];
  rules?: Record<string, { enabled: boolean }>;
  reportName?: string;
  generateHtmlReport?: boolean;
}

export async function runAxeAudit(page: Page, options: AxeAuditOptions = {}) {
  const {
    tags = STANDARD_WCAG_AA_TAGS,
    include,
    exclude,
    rules,
    reportName = `a11y-audit-${Date.now()}`,
    generateHtmlReport = true
  } = options;

  let builder = new AxeBuilder({ page }).withTags(tags);

  if (include) {
    const includes = Array.isArray(include) ? include : [include];
    for (const inc of includes) {
      builder = builder.include(inc);
    }
  }

  if (exclude) {
    const excludes = Array.isArray(exclude) ? exclude : [exclude];
    for (const exc of excludes) {
      builder = builder.exclude(exc);
    }
  }

  if (rules) {
    for (const [ruleId, config] of Object.entries(rules)) {
      if (config.enabled) {
        builder = builder.withRules([ruleId]);
      } else {
        builder = builder.disableRules([ruleId]);
      }
    }
  }

  const results = await builder.analyze();

  if (generateHtmlReport) {
    const reportRelativeDir = 'test-results/a11y-reports';
    const reportDir = path.resolve(process.cwd(), reportRelativeDir);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    // Save JSON results
    const jsonPath = path.join(reportDir, `${reportName}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8');

    // Generate HTML Report
    try {
      createHtmlReport({
        results,
        options: {
          projectKey: 'APEX_PORTAL',
          outputDir: reportRelativeDir,
          reportFileName: `${reportName}.html`
        }
      });
    } catch (err) {
      console.warn(`HTML report generation notice: ${err}`);
    }
  }

  return results;
}

export function formatAxeViolations(violations: any[]) {
  if (violations.length === 0) return 'No accessibility violations found.';

  return violations
    .map((v, i) => {
      const targets = v.nodes.map((n: any) => n.target.join(' ')).join('\n      ');
      return `\n  ${i + 1}. [${v.impact?.toUpperCase()}] ${v.id}: ${v.help}
      Help URL: ${v.helpUrl}
      Tags: ${v.tags.join(', ')}
      Impacted Elements:
      ${targets}`;
    })
    .join('\n');
}

