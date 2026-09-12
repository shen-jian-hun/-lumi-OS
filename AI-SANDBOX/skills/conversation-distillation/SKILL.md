# 延续对话蒸馏 Skill

## 目的

把一次长对话中真正需要跨会话延续的工作状态，蒸馏成可检索、可恢复、可验证的外部锚点，而不是保存整段聊天记录。

## 核心原则

1. **状态优先**：保存当前工作状态、目标、决定、约束、未完成事项和下一步，而不是无差别复制聊天。
2. **锚点优先**：每次蒸馏都必须产生明确的恢复入口，例如 `anchor`、`session_state` 或 `manifest`。
3. **事实分层**：严格区分 `confirmed`（已确认）、`inference`（推断）、`hypothesis`（假设）、`pending`（待验证）。
4. **历史不覆盖**：新的蒸馏记录作为新版本保存，保留历史轨迹。
5. **可验证**：重要记录应包含时间、版本、来源路径；必要时记录 SHA-256 和字节大小。
6. **GitHub 是外部知识底座**：优先从 GitHub 搜索已有锚点和项目上下文，再恢复当前工作。
7. **执行与记忆分离**：GitHub 保存状态、知识和代码；实际运行由独立 sandbox/runtime 完成。
8. **不依赖单一 AI 平台**：换模型、换对话、换客户端后，只要能读取外部锚点，就可以继续工作。

## 蒸馏流程

### 1. 定位当前状态

先回答：

- 当前正在做什么？
- 从哪个锚点继续？
- 已经完成什么？
- 当前阻塞在哪里？
- 下一步最小可执行动作是什么？

### 2. 检索外部底座

优先搜索 GitHub：

- `CORE/`
- `KNOWLEDGE/`
- `AI-SANDBOX/`
- 项目上下文文件
- 最近提交
- 相关 Issue / PR

不得因为当前对话缺少历史就重新从零推演；先搜索外部底座。

### 3. 蒸馏

只提取能够帮助未来会话恢复工作的高价值状态：

```yaml
anchor: <当前恢复入口>
state: <当前状态>
objective: <当前目标>
completed:
  - <已完成事项>
decisions:
  - <已经确定的决定>
constraints:
  - <不可违反的约束>
open_items:
  - <尚未完成事项>
next_action: <下一步最小动作>
evidence:
  confirmed:
    - <确认事实>
  inference:
    - <推断>
  hypothesis:
    - <假设>
  pending:
    - <待验证>
source:
  conversation: <当前会话来源>
  github: <相关 GitHub 路径>
version: <版本号>
```

### 4. 写回

将蒸馏结果写入 GitHub 的独立版本文件，不覆盖旧记录。例如：

```text
AI-SANDBOX/
├── skills/
│   └── conversation-distillation/
│       └── SKILL.md
├── CORE/
│   ├── anchors/
│   └── sessions/
├── KNOWLEDGE/
└── manifest/
```

### 5. 恢复

新会话开始时：

```text
用户当前请求
    ↓
搜索 GitHub
    ↓
找到最新 anchor / session_state
    ↓
读取相关项目上下文
    ↓
恢复工作状态
    ↓
继续执行
```

## 禁止事项

- 不把整段聊天原样当作长期记忆。
- 不凭空补齐缺失历史。
- 不把推断写成确认事实。
- 不覆盖旧锚点造成历史丢失。
- 不因为某个第三方连接器不可用就停止工作；优先使用 GitHub 外部底座继续恢复。
- 不把 GitHub API 本身误认为代码执行沙箱。需要执行时调用独立 runtime。

## 输出要求

当用户要求“延续对话蒸馏”时，优先输出一个**可恢复的状态对象**，然后写回 GitHub；不要只给一篇解释性总结。

## 当前架构定位

```text
AI / ChatGPT
    │
    ├── 搜索 → GitHub 外部知识底座
    │              │
    │              ├── Anchor
    │              ├── Session State
    │              ├── Knowledge
    │              └── Project State
    │
    └── 调度 → Sandbox / Runtime
                       │
                       └── 执行结果 → GitHub
```
