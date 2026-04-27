require('dotenv').config();
const fs = require('fs');
const path = require('path');

function scanTerraformFiles(directory) {
  console.log(`Scanning Terraform files in ${directory}...\n`);
  
  const files = fs.readdirSync(directory)
    .filter(f => f.endsWith('.tf'));

  if (files.length === 0) {
    console.log('No .tf files found!');
    return [];
  }

  console.log(`Found ${files.length} Terraform file(s): ${files.join(', ')}\n`);

  return files.map(file => ({
    filename: file,
    content: fs.readFileSync(path.join(directory, file), 'utf8')
  }));
}

function detectIssues(tfFiles) {
  const issues = [];

  const patterns = [
    { pattern: /acl\s*=\s*["']public/gi, severity: 'CRITICAL', issue: 'S3 bucket with public ACL' },
    { pattern: /cidr_blocks\s*=\s*\["0\.0\.0\.0\/0"\]/gi, severity: 'HIGH', issue: 'Security group open to world' },
    { pattern: /storage_encrypted\s*=\s*false/gi, severity: 'HIGH', issue: 'RDS storage not encrypted' },
    { pattern: /publicly_accessible\s*=\s*true/gi, severity: 'HIGH', issue: 'RDS publicly accessible' },
    { pattern: /password\s*=\s*["'][^"']{1,12}["']/gi, severity: 'CRITICAL', issue: 'Weak or hardcoded password' },
    { pattern: /AdministratorAccess/gi, severity: 'CRITICAL', issue: 'IAM AdminstratorAccess attached' },
    { pattern: /enabled\s*=\s*false/gi, severity: 'MEDIUM', issue: 'Feature explicitly disabled' },
  ];

  tfFiles.forEach(file => {
    patterns.forEach(({ pattern, severity, issue }) => {
      const matches = file.content.match(pattern);
      if (matches) {
        issues.push({
          file: file.filename,
          severity,
          issue,
          occurrences: matches.length
        });
      }
    });
  });

  return issues;
}

module.exports = { scanTerraformFiles, detectIssues };