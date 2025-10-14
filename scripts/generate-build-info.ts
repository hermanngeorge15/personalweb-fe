#!/usr/bin/env tsx
/**
 * Generate build information file
 * This helps verify which version is deployed in production
 */

import { writeFileSync } from 'fs'
import { resolve } from 'path'

const buildInfo = {
  buildTime: new Date().toISOString(),
  buildNumber: process.env.GITHUB_RUN_NUMBER || 'local',
  commit: process.env.GITHUB_SHA || 'unknown',
  branch: process.env.GITHUB_REF_NAME || 'unknown',
  nodeVersion: process.version,
  timestamp: Date.now(),
}

const outputPath = resolve(process.cwd(), 'public', 'build-info.json')

writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2))

console.log('✅ Build info generated:', outputPath)
console.log(buildInfo)
