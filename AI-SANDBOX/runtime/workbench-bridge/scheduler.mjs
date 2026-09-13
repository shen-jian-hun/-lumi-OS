#!/usr/bin/env node
/**
 * LumiOS Workbench hourly self-check scheduler.
 * GitHub stores task/state; this local process provides the hourly heartbeat.
 */

import { spawn } from 'node:child_process';

const intervalMs = 60 * 60 * 1000;
const command = process.argv.slice(2);

if (command.length === 0) {
  console.error('Usage: node scheduler.mjs <executable> [args...]');
  process.exit(1);
}

const run = () => {
  const startedAt = new Date().toISOString();
  console.log(`[scheduler] self-check started: ${startedAt}`);
  const [executable, ...args] = command;
  const child = spawn(executable, args, { stdio: 'inherit', shell: false });
  child.on('close', (code) => console.log(`[scheduler] self-check exited: ${code}`));
  child.on('error', (error) => console.error(`[scheduler] failed: ${error.message}`));
};

run();
setInterval(run, intervalMs);
