// Builds the website, wraps it into an Android APK with Capacitor, and publishes the APK
// to public/downloads so the website's "Download App" button serves it.
//
// Usage: npm run build:apk
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import os from 'node:os';

const root = resolve(import.meta.dirname, '..');
const isWin = process.platform === 'win32';

const env = { ...process.env };
if (!env.JAVA_HOME) {
  const studioJbr = isWin
    ? 'C:\\Program Files\\Android\\Android Studio\\jbr'
    : '/Applications/Android Studio.app/Contents/jbr/Contents/Home';
  if (existsSync(studioJbr)) env.JAVA_HOME = studioJbr;
}
if (!env.ANDROID_HOME && !env.ANDROID_SDK_ROOT) {
  const sdk = isWin
    ? join(env.LOCALAPPDATA ?? '', 'Android', 'Sdk')
    : join(os.homedir(), process.platform === 'darwin' ? 'Library/Android/sdk' : 'Android/Sdk');
  if (existsSync(sdk)) env.ANDROID_HOME = sdk;
}

const run = (cmd, cwd = root) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, env, stdio: 'inherit' });
};

run('npm run build');

// Don't package the APK inside itself.
rmSync(join(root, 'dist', 'downloads'), { recursive: true, force: true });

run('npx cap sync android');
run(isWin ? '.\\gradlew.bat assembleRelease' : './gradlew assembleRelease', join(root, 'android'));

const built = join(root, 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
if (!existsSync(built)) {
  throw new Error(`APK not found at ${built}. Is keystore/keystore.properties present?`);
}

for (const dir of [join(root, 'public', 'downloads'), join(root, 'dist', 'downloads')]) {
  mkdirSync(dir, { recursive: true });
  copyFileSync(built, join(dir, 'padasala.apk'));
}

console.log('\nAPK ready: public/downloads/padasala.apk (also copied into dist/downloads)');
