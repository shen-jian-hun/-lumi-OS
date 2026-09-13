#!/usr/bin/env node
/**
 * Hourly self-check entry point.
 * Keeps the check deterministic and local: inspect repository state and
 * produce a candidate iteration note. AI reasoning can consume the result.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const now = new Date().toISOString();

const git = (args) => {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return `ERROR: ${error.message}`;
  }
};

const status = git(['status', '--short']);
const recent = git(['log', '-5', '--oneline']);

const result = {
  checked_at: now,
  workspace: root,
  git_status: status,
  recent_commits: recent,
  iteration_prompt: '检查当前工作状态、未完成任务、阻塞点和最近变化，提出最值得落地的下一项迭代。区分 confirmed / inference / hypothesis / pending。',
};

const outDir = join(root, 'AI-SANDBOX', 'runtime', 'self-check');
mkdirSync(outDir, { recursive: true });
const out = join(outDir, 'LATEST.json');
writeFileSync(out, JSON.stringify(result, null, 2) + '\n', 'utf8');

console.log(JSON.stringify(result, null, 2));
console.log(`Self-check written to ${out}`);
