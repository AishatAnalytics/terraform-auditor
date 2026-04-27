# Terraform Auditor 🔍

Scans Terraform files for security misconfigurations before they reach production.

## The Problem
Teams push Terraform code to production without security checks. Misconfigured S3 buckets, open security groups and unencrypted databases slip through code review all the time.

## What It Does
- Scans all .tf files in your project
- Detects critical security misconfigurations
- Flags severity levels — CRITICAL, HIGH, MEDIUM
- Sends findings to Claude AI for expert analysis
- Suggests exact Terraform fixes with corrected code
- Maps issues to SOC2, HIPAA and PCI-DSS frameworks
- Saves full audit report to JSON

## Issues Detected
- S3 buckets with public ACL
- Security groups open to 0.0.0.0/0
- RDS without encryption
- Publicly accessible databases
- Hardcoded passwords
- IAM AdministratorAccess attachments

## Sample Output
Found 5 security issues:
🔴 CRITICAL: S3 bucket with public ACL
🔴 CRITICAL: Hardcoded password
🔴 CRITICAL: AdministratorAccess attached
🟠 HIGH: Security group open to world
🟠 HIGH: RDS storage not encrypted

## Tech Stack
- Claude API (Anthropic)
- Node.js
- Terraform (.tf file parsing)

## Key Concepts Demonstrated
- Infrastructure as Code security
- Shift-left security practices
- AWS Well-Architected Security Pillar
- SOC2 and PCI-DSS compliance

## Part of my 30 cloud projects in 30 days series
Follow along: https://www.linkedin.com/in/aishatolatunji/