#!/usr/bin/env node

/**
 * One-command automation script compiling and launching the workspace environment
 */
import { spawn } from 'child_process';
import path from 'path';

console.log('[Workspace Builder] Starting up AI Canvas Workspace...');

// Start the Vite react layer
const vite = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });

// NOTE: In a real Tauri environment, this would run `cargo tauri dev`.
// For standard web environments, we only start Vite.
console.log('[Workspace Builder] Vite frontend started.');
