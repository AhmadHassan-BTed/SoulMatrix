# Behavior Rules

- **CRITICAL**: Never output structural markdown alert blockquotes (such as `> [!NOTE]`, `> [!WARNING]`, `> [!IMPORTANT]`, `> [!CAUTION]`, `> [!TIP]`, etc.) in a response turn if you are about to execute any tool calls in that same turn. This prevents a known UI rendering freeze bug in Antigravity v1.21.6.
