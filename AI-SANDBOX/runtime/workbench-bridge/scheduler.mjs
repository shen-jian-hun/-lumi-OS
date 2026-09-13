#!/usr/bin/env node
/**
 * LumiOS Workbench hourly self-check scheduler.
 *
 * This is intentionally a local scheduler. GitHub stores the task/state;
 * this process provides the hourly heartbeat on the workstation.
 */

const intervalMs = 60 * 60 * 1000;
const command = process.argv.slice(2);

if (command.length === 0) {
  console.error('Usage: node scheduler.mjs <self-check command> [args...]');
  process.exit(1);
}

const run = () => {
  const startedAt = new Date().toISOString();
  console.log(`[scheduler] self-check started: ${startedAt}`);

  const child = Bun
    ? Bun.spawn(command, { stdout: 'inherit', stderr: 'inherit' })
    : null;

  if (child) {
    child.exited.then((code) => console.log(`[scheduler] self-check exited: ${code}`));
  }
};

run();
setInterval(run, intervalMs);
