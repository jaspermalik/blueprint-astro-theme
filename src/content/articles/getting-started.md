---
title: 快速开始
description: 了解如何快速上手使用 Blueprint Astro Theme
order: 1
---

## 安装

首先创建一个新的 Astro 项目：

```bash
npm create astro@latest my-docs
cd my-docs
```

然后安装主题依赖：

```bash
npm install blueprint-astro-theme
```

## 配置

在 `astro.config.mjs` 中导入主题：

```js
import { defineConfig } from 'astro/config';
import blueprint from 'blueprint-astro-theme';

export default defineConfig({
  integrations: [blueprint()],
});
```

## 创建内容

将你的 Markdown 文件放入 `src/content/articles/` 目录：

```md
---
title: 我的第一篇文章
description: 这是一篇示例文章
---

## 标题

这是文章内容...
```

## 运行

```bash
npm run dev
```

访问 `http://localhost:4321` 查看你的文档网站。

## 下一步

- [配置选项](/articles/configuration) - 了解所有配置选项
- [自定义样式](/articles/styling) - 如何定制主题样式
