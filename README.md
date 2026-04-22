# Blueprint Astro Theme

一个简洁的文档主题，移植自 Blueprint Docs，专为 Astro 设计。

## 特性

- 简洁的侧边栏导航布局
- 支持亮色/暗色/自动主题切换
- 响应式设计，适配移动端
- 基于 CSS 变量易于定制
- 文章目录 (TOC) 组件支持

## 快速开始

```bash
# 创建新项目
npm create astro@latest my-docs -- --template minimal

# 进入目录
cd my-docs

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 项目结构

```
src/
├── components/
│   ├── Sidebar.astro         # 侧边栏组件
│   ├── ThemeToggle.tsx       # 主题切换组件
│   ├── BackToTop.astro      # 回到顶部按钮
│   └── TableOfContents.astro # 目录组件
├── layouts/
│   └── BaseLayout.astro      # 基础布局
├── pages/
│   ├── index.astro          # 首页
│   └── articles/
│       └── [...slug].astro  # 文章页
├── styles/
│   └── global.css           # 全局样式
└── content/
    ├── config.ts            # Content Collections 配置
    └── articles/           # 文章目录
```

## 样式定制

主题使用 CSS 变量来控制颜色。在你的全局样式中覆盖这些变量：

```css
:root {
  --c-accent: #1B365D;
  --c-accent-hover: #2a4a7a;
  --sidebar-width: 280px;
}
```

### 可用变量

| 变量 | 说明 | 默认值 |
|-----|------|-------|
| `--c-bg` | 页面背景色 | `#f8fafc` |
| `--c-canvas` | 卡片/内容背景 | `#ffffff` |
| `--c-border` | 边框色 | `#cbd5e1` |
| `--c-text-main` | 主文本色 | `#0f172a` |
| `--c-text-sub` | 次要文本色 | `#64748b` |
| `--c-accent` | 主题色/链接色 | `#1B365D` |
| `--c-accent-hover` | 链接悬停色 | `#2a4a7a` |
| `--c-code-bg` | 代码背景色 | `#f1f5f9` |
| `--sidebar-width` | 侧边栏宽度 | `280px` |

## 主题切换

主题支持三种模式：

- `light` - 亮色模式
- `dark` - 暗色模式
- `auto` - 跟随系统设置

点击侧边栏底部的图标切换主题。

## 内容管理

使用 Astro Content Collections 来管理文章：

```md
---
title: 我的文章
description: 文章描述
date: 2024-01-01
order: 1
---

## 标题

内容...
```

## 构建

```bash
npm run build
```

预览构建结果：

```bash
npm run preview
```

## License

MIT
