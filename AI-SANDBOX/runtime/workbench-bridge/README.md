# AI Workbench Bridge

本地工作台与 GitHub AI-SANDBOX 之间的最小工具桥。

## 目标

把：

`AI → GitHub → 本地工作台 → GitHub → AI`

变成可以实际运行的闭环。

GitHub 负责持久化、版本、锚点和任务状态；本地 Bridge 负责在用户电脑上执行受控操作。

## 安全边界

- 默认只监听 `127.0.0.1`，不暴露公网。
- 使用本地 bearer token 保护 HTTP API。
- 不提供默认的任意远程 shell 接口。
- `run` 只允许执行配置中的 allowlist 命令。
- Git 凭据不写入配置文件，由本机 Git credential helper / SSH agent 管理。
- Bridge 是本地执行器，不把 GitHub API 当作执行沙箱。

## API

- `GET /health`：健康检查。
- `GET /status`：读取本地工作台状态。
- `POST /run`：执行一个 allowlisted command。
- `POST /git/sync`：在配置的 workspace 执行 `git pull --ff-only`。

请求必须带：

`Authorization: Bearer <token>`

## 配置

复制 `config.example.json` 为本地 `config.json`，不要提交真实 token。

```bash
node AI-SANDBOX/runtime/workbench-bridge/bridge.mjs
```

默认地址：`http://127.0.0.1:48173`

## 下一阶段

1. GitHub task queue → 本地任务领取。
2. 结果写回 GitHub。
3. pending_write 离线队列。
4. heartbeat / online 状态。
5. 与 LumiOS Workbench UI 对接。
