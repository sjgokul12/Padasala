// `npm run dev`: starts the PHP backend (D:\Padasala\backend) and the website together.
// If the backend is already running (e.g. start-backend.bat is open), it is reused.
// Stop both with Ctrl+C.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const backendDir = resolve(root, '..', 'backend');
const PORT = 8787;
const php = process.env.PHP_PATH || (existsSync('D:\\xampp\\php\\php.exe') ? 'D:\\xampp\\php\\php.exe' : 'php');

const portInUse = (port) =>
  new Promise((done) => {
    const socket = net.connect({ host: '127.0.0.1', port }, () => { socket.destroy(); done(true); });
    socket.on('error', () => done(false));
  });

const children = [];
const stopAll = () => { for (const c of children) c.kill(); process.exit(); };
process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);

if (!existsSync(resolve(backendDir, 'router.php'))) {
  console.log(`\n  Backend folder not found at ${backendDir} — starting the website only.\n`);
} else if (await portInUse(PORT)) {
  console.log(`\n  Backend: already running on http://localhost:${PORT} (reusing it)\n`);
} else {
  const backend = spawn(php, ['-S', `localhost:${PORT}`, '-t', backendDir, resolve(backendDir, 'router.php')], { stdio: 'ignore' });
  backend.on('error', (e) => console.log(`\n  Could not start the backend (${e.message}). Start backend\\start-backend.bat yourself.\n`));
  backend.on('exit', (code) => { if (code) console.log(`\n  Backend stopped (exit ${code}). Is MySQL running in XAMPP?\n`); });
  children.push(backend);
  console.log(`\n  Backend: started on http://localhost:${PORT}  (MySQL must be running in XAMPP)\n`);
}

const vite = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vite', ...process.argv.slice(2)], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
children.push(vite);
vite.on('exit', (code) => { for (const c of children) c.kill(); process.exit(code ?? 0); });
