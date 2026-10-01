/**
 * Subz — Production Packager for Chrome Web Store
 * Creates a clean, stripped-down distribution zip containing ONLY
 * runtime-essential files, validating manifest references.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const STAGING_DIR = path.join(DIST_DIR, 'staging');
const ZIP_PATH = path.join(DIST_DIR, 'subz-v1.0.0-production.zip');

console.log('🚀 Starting Subz Production Build Pipeline...');

// 1. Clean previous dist
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(STAGING_DIR, { recursive: true });

// 2. Helper to recursively copy directories with filters
function copyFolder(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.name.startsWith('.') || entry.name === '__pycache__' || entry.name.endsWith('.pyc')) {
      continue;
    }

    if (entry.isDirectory()) {
      copyFolder(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 3. Copy production assets
console.log('📦 Copying production files to staging...');
fs.copyFileSync(path.join(ROOT_DIR, 'manifest.json'), path.join(STAGING_DIR, 'manifest.json'));
copyFolder(path.join(ROOT_DIR, 'icons'), path.join(STAGING_DIR, 'icons'));
copyFolder(path.join(ROOT_DIR, 'src'), path.join(STAGING_DIR, 'src'));

// 4. Validate Manifest references
console.log('🔍 Validating manifest.json references in staging bundle...');
const manifest = JSON.parse(fs.readFileSync(path.join(STAGING_DIR, 'manifest.json'), 'utf8'));

// Check icon paths
for (const size in manifest.icons) {
  const p = path.join(STAGING_DIR, manifest.icons[size]);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing icon file: ${manifest.icons[size]}`);
  }
}

// Check popup path
if (manifest.action && manifest.action.default_popup) {
  const p = path.join(STAGING_DIR, manifest.action.default_popup);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing popup file: ${manifest.action.default_popup}`);
  }
}

// Check background worker
if (manifest.background && manifest.background.service_worker) {
  const p = path.join(STAGING_DIR, manifest.background.service_worker);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing service worker: ${manifest.background.service_worker}`);
  }
}

// Check content scripts
if (manifest.content_scripts) {
  for (const cs of manifest.content_scripts) {
    if (cs.css) {
      for (const cssFile of cs.css) {
        if (!fs.existsSync(path.join(STAGING_DIR, cssFile))) {
          throw new Error(`Missing content CSS: ${cssFile}`);
        }
      }
    }
    if (cs.js) {
      for (const jsFile of cs.js) {
        if (!fs.existsSync(path.join(STAGING_DIR, jsFile))) {
          throw new Error(`Missing content JS: ${jsFile}`);
        }
      }
    }
  }
}
console.log('✅ All manifest references successfully verified!');

// 5. Compress using PowerShell Compress-Archive
console.log(`🗜️ Compressing staging bundle into ${path.basename(ZIP_PATH)}...`);
const psCommand = `powershell -Command "Compress-Archive -Path '${STAGING_DIR}\\*' -DestinationPath '${ZIP_PATH}' -Force"`;
execSync(psCommand, { stdio: 'inherit' });

// 6. Verify zip output and size
const stats = fs.statSync(ZIP_PATH);
const sizeKB = (stats.size / 1024).toFixed(1);
console.log(`\n🎉 Production build complete!`);
console.log(`📁 File: ${ZIP_PATH}`);
console.log(`📊 Size: ${sizeKB} KB (Lightweight & optimal for Chrome Web Store)`);
