# 延续对话蒸馏 Skill

## 目的

把一次长对话中真正需要跨会话延续的工作状态，蒸馏成可检索、可恢复、可验证的外部锚点，而不是保存整段聊天记录。

## 硬规则：每次对话必须写回 GitHub

**每一次对话都必须产生并写入一个可恢复的 Session State。**

这不是“重要时才保存”的可选动作，也不能依赖用户提醒。

对话结束或进入明确阶段性收束时，必须：

1. 蒸馏当前工作状态。
2. 生成唯一 `session_id`。
3. 写入 GitHub 独立 Session 文件。
4. 更新 `LATEST` 恢复索引。
5. 保留历史，不覆盖旧 Session。

如果 GitHub 写入失败，必须把状态标记为 `pending_write`，不得声称已经完成持久化；下一次可写入时优先补写。

## 核心原则

1. **状态优先**：保存当前工作状态、目标、决定、约束、未完成事项和下一步，而不是无差别复制聊天。
2. **锚点优先**：每次蒸馏都必须产生明确的恢复入口，例如 `anchor`、`session_state` 或 `manifest`。
3. **事实分层**：严格区分 `confirmed`（已确认）、`inference`（推断）、`hypothesis`（假设）、`pending`（待验证）。
4. **历史不覆盖**：新的蒸馏记录作为新版本保存，保留历史轨迹。
5. **可验证**：重要记录应包含时间、版本、来源路径；必要时记录 SHA-256 和字节大小。
6. **GitHub 是外部知识底座**：优先从 GitHub 搜索已有锚点和项目上下文，再恢复当前工作。
7. **执行与记忆分离**：GitHub 保存状态、知识和代码；实际运行由独立 sandbox/runtime 完成。
8. **不依赖单一 AI 平台**：换模型、换对话、换客户端后，只要能读取外部锚点，就可以继续工作。
9. **恢复优先级固定**：最新 Session State → 当前 Anchor → Project State → Knowledge → 历史记录。
10. **失败可恢复**：任何一次写入、同步或运行失败，都必须留下可识别的失败状态，而不是静默丢失。

## 标准目录

```text
AI-SANDBOX/
├── sessions/
│   ├── <session_id>.yaml
│   └── ...
├── LATEST.yaml
├── skills/
│   └── conversation-distillation/
│       └── SKILL.md
├── CORE/
│   ├── anchors/
│   └── sessions/
├── KNOWLEDGE/
└── manifest/
```

## Session State 最小结构

```yaml
session_id: <唯一会话ID>
status: completed | active | pending_write | failed
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
timestamp: <时间>
version: <版本号>
```

## LATEST 恢复索引

`AI-SANDBOX/LATEST.yaml` 是跨会话恢复的第一入口，必须指向最新成功写入的 Session State。

```yaml
latest_session_id: <session_id>
latest_session_path: AI-SANDBOX/sessions/<session_id>.yaml
latest_anchor: <anchor>
status: ready | pending_write | recovery_required
timestamp: <时间>
```

`LATEST.yaml` 不能删除历史 Session，只负责告诉下一次会话从哪里恢复。

## 蒸馏流程

### 0. 对话开始：先恢复

```text
新对话
  ↓
读取 AI-SANDBOX/LATEST.yaml
  ↓
读取 latest Session State
  ↓
读取 Anchor / Project State
  ↓
恢复工作上下文
  ↓
继续当前任务
```

不得因为当前对话缺少历史就重新从零推演；先搜索外部底座。

### 1. 定位当前状态

先回答：

- 当前正在做什么？
- 从哪个锚点继续？
- 已经完成什么？
- 当前阻塞在哪里？
- 下一步最小可执行动作是什么？

### 2. 检索外部底座

优先搜索 GitHub：

- `AI-SANDBOX/LATEST.yaml`
- `AI-SANDBOX/sessions/`
- `CORE/`
- `KNOWLEDGE/`
- 项目上下文文件
- 最近提交
- 相关 Issue / PR

### 3. 蒸馏

只提取能够帮助未来会话恢复工作的高价值状态，并生成唯一 `session_id`。

### 4. 写回

将蒸馏结果写入 GitHub 的独立版本文件，不覆盖旧记录。

推荐顺序：

```text
创建 sessions/<session_id>.yaml
        ↓
确认写入成功
        ↓
更新 LATEST.yaml
        ↓
确认 LATEST 指向该 Session
```

如果 Session 写入成功但 LATEST 更新失败，必须将系统状态视为 `recovery_required`，不能假装闭环完成。

### 5. 恢复

```text
用户当前请求
    ↓
读取 LATEST
    ↓
读取最新 Session State
    ↓
读取相关项目上下文
    ↓
恢复工作状态
    ↓
继续执行
```

## 写入完整性要求

每次 Session 写入至少记录：

- `session_id`
- `timestamp`
- `status`
- `anchor`
- `state`
- `objective`
- `completed`
- `decisions`
- `constraints`
- `open_items`
- `next_action`
- `evidence`
- `source`
- `version`

对需要内容完整性校验的记录，可增加：

- `sha256`
- `bytes`
- `commit_sha`

## 禁止事项

- 不把整段聊天原样当作长期记忆。
- 不凭空补齐缺失历史。
- 不把推断写成确认事实。
- 不覆盖旧锚点造成历史丢失。
- 不因为某个第三方连接器不可用就停止工作；优先使用 GitHub 外部底座继续恢复。
- 不把 GitHub API 本身误认为代码执行沙箱。需要执行时调用独立 runtime。
- 不在未成功写入 GitHub 时声称“已经保存”。
- 不让单次会话没有任何持久化记录地正常结束。

## 输出要求

当用户要求“延续对话蒸馏”时，优先输出一个**可恢复的状态对象**，然后写回 GitHub；不要只给一篇解释性总结。

对于普通工作对话，也必须在会话收束时生成 Session State 并写回 GitHub。

## 当前架构定位

```text
AI / ChatGPT
    │
    ├── 对话开始 → LATEST → Session State → Anchor
    │
    ├── 工作 / 工具 / Runtime
    │
    └── 对话收束
             ↓
        Session Distillation
             ↓
        GitHub sessions/<session_id>.yaml
             ↓
        更新 LATEST.yaml
             ↓
        下一次对话恢复
```
