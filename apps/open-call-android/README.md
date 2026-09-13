# Open Call · Android

LumiOS 的 Android 呼叫入口。

## 定位

Open Call 不是 OpenClaw 的 Android 重制版，而是手机侧的能力调用层：

```text
Open Call
   ↓
OpenClaw Gateway / 其他 Work Engine
   ↓
Workbench Bridge
   ↓
本地工作台
   ↓
GitHub AI-SANDBOX
```

## 第一版

- Android + Kotlin + Jetpack Compose
- Gateway 地址配置
- 呼叫输入界面
- 后续接入 WebSocket Gateway
- 后续接入语音输入/输出
- 后续接入 Work Mode
- 后续读取 GitHub Session / Task / Result 状态

## 当前状态

`scaffold-ready`：Android 工程骨架和第一版 UI 已写入 GitHub，尚未声明已经在手机上安装或运行。

官方 Android Compose 文档：
https://developer.android.com/develop/ui/compose/setup
