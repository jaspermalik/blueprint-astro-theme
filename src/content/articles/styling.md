---
title: 自定义样式
description: 如何自定义 Blueprint Astro Theme 的样式
order: 3
---

## 全局样式

所有样式都定义在 `src/styles/global.css` 中。你可以：

1. 直接修改这个文件
2. 或者在你的项目中创建一个新文件并导入

## 覆盖颜色变量

```css
:root {
  /* 修改主题色 */
  --c-accent: #6366f1;
  --c-accent-hover: #818cf8;

  /* 修改背景色 */
  --c-bg: #fafafa;
  --c-canvas: #ffffff;

  /* 修改边框色 */
  --c-border: #e5e7eb;
}

[data-theme="dark"] {
  --c-accent: #818cf8;
  --c-accent-hover: #a5b4fc;
  --c-bg: #0f0f0f;
  --c-canvas: #1a1a1a;
  --c-border: #2d2d2d;
}
```

## 修改字体

```css
:root {
  --font-ui: 'Noto Sans SC', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## 修改侧边栏宽度

```css
:root {
  --sidebar-width: 320px;
}
```

## 添加自定义样式

在 `src/styles/global.css` 底部添加你的自定义样式：

```css
/* Custom styles */
.my-custom-class {
  color: var(--c-accent);
}
```
