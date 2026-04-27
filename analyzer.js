require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic();

async function analyzeTerraform(tfFiles, issues) {
  const prompt = `
You are a Terraform security expert specializing in AWS infrastructure security.

I have scanned the following Terraform files and found these security issues:

FILES SCANNED:
${tfFiles.map(f => `\n--- ${f.filename} ---\n${f.content}`).join('\n')}

DETECTED ISSUES:
${JSON.stringify(issues, null, 2)}

For each issue provide:
1. Why this is dangerous in production
2. The exact Terraform fix with corrected code
3. Which compliance framework it violates (SOC2, HIPAA, PCI-DSS)
4. Priority to fix: IMMEDIATE, HIGH, MEDIUM

Also provide:
- Overall security score out of 100
- Top 3 most critical fixes to make right now

Keep response under 500 words. Be specific with code examples.
  `;

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }]
  });

  return message.content[0].text;
}

module.exports = { analyzeTerraform };