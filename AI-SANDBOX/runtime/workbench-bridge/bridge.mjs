import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const configPath = process.env.LUMI_BRIDGE_CONFIG || path.join(here, 'config.json');

if (!fs.existsSync(configPath)) {
  console.error(`Missing config: ${configPath}`);
  console.error('Copy config.example.json to config.json and set a local token.');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const host = config.host || '127.0.0.1';
const port = Number(config.port || 48173);
const token = String(config.token || '');
const workspace = path.resolve(config.workspace || process.cwd());
const allowedCommands = config.allowedCommands || {};

if (!token || token === 'CHANGE_ME_LOCAL_TOKEN') {
  console.error('Refusing to start with a default/empty token. Set a private local token in config.json.');
  process.exit(1);
}

function authorized(req) {
  const header = req.headers.authorization || '';
  return header === `Bearer ${token}`;
}

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function runCommand(command) {
  return new Promise((resolve) => {
    const [program, ...args] = command;
    const child = spawn(program, args, {
      cwd: workspace,
      shell: false,
      windowsHide: true,
      env: process.env,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });
    child.on('error', (error) => resolve({ ok: false, error: error.message }));
    child.on('close', (code, signal) => resolve({
      ok: code === 0,
      code,
      signal,
      stdout: stdout.slice(-20000),
      stderr: stderr.slice(-20000),
    }));
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    return send(res, 200, { ok: true, service: 'ai-workbench-bridge', version: 1 });
  }

  if (!authorized(req)) {
    return send(res, 401, { ok: false, error: 'unauthorized' });
  }

  if (req.method === 'GET' && req.url === '/status') {
    return send(res, 200, {
      ok: true,
      workspace,
      pid: process.pid,
      node: process.version,
      allowedCommands: Object.keys(allowedCommands),
    });
  }

  if (req.method === 'POST' && req.url === '/run') {
    try {
      const body = await readBody(req);
      const name = String(body.name || '');
      const command = allowedCommands[name];
      if (!Array.isArray(command) || command.length === 0) {
        return send(res, 400, { ok: false, error: 'command_not_allowed', allowed: Object.keys(allowedCommands) });
      }
      return send(res, 200, await runCommand(command));
    } catch (error) {
      return send(res, 400, { ok: false, error: error.message });
    }
  }

  if (req.method === 'POST' && req.url === '/git/sync') {
    return send(res, 200, await runCommand(['git', 'pull', '--ff-only']));
  }

  return send(res, 404, { ok: false, error: 'not_found' });
});

server.listen(port, host, () => {
  console.log(`AI Workbench Bridge listening on http://${host}:${port}`);
  console.log(`Workspace: ${workspace}`);
});
