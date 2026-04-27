require('dotenv').config();
const { scanTerraformFiles, detectIssues } = require('./scanner');
const { analyzeTerraform } = require('./analyzer');
const fs = require('fs');

async function run() {
  console.log('🔍 Terraform Auditor');
  console.log('====================\n');

  // Step 1 — Scan Terraform files
  console.log('Step 1: Scanning Terraform files...');
  const tfFiles = scanTerraformFiles('./sample-terraform');

  // Step 2 — Detect issues
  console.log('Step 2: Detecting security misconfigurations...');
  const issues = detectIssues(tfFiles);

  if (issues.length === 0) {
    console.log('✅ No issues found!');
    return;
  }

  console.log(`\nFound ${issues.length} security issue(s):\n`);
  issues.forEach(issue => {
    const emoji = issue.severity === 'CRITICAL' ? '🔴' : issue.severity === 'HIGH' ? '🟠' : '🟡';
    console.log(`${emoji} ${issue.severity}: ${issue.issue} in ${issue.file}`);
  });

  // Step 3 — Analyze with Claude
  console.log('\nStep 3: Sending to Claude AI for security analysis...');
  const analysis = await analyzeTerraform(tfFiles, issues);

  console.log('\n=============================');
  console.log('🤖 CLAUDE TERRAFORM ANALYSIS');
  console.log('=============================\n');
  console.log(analysis);

  // Step 4 — Save report
  const report = {
    timestamp: new Date().toISOString(),
    filesScanned: tfFiles.length,
    issuesFound: issues.length,
    issues,
    claudeAnalysis: analysis
  };

  fs.writeFileSync('audit-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Full report saved to audit-report.json');
  console.log('\n✅ Terraform Auditor complete!');
}

run().catch(console.error);