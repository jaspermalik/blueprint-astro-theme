---
title: 高级特性
description: 探索 Blueprint Astro Theme 的高级特性
order: 4
---

## 概述

本文介绍 Blueprint Astro Theme 的高级特性，包括如何使用这些特性来构建更复杂的文档网站。

## 自定义组件

除了内置组件外，你还可以创建自定义组件来扩展主题功能。

### 创建自定义组件

在 `src/components/` 目录下创建新的 `.astro` 或 `.tsx` 文件：

```astro
---
// src/components/MyComponent.astro
const { title } = Astro.props;
---

<div class="my-component">
  <h3>{title}</h3>
  <slot />
</div>
```

### 在 Markdown 中使用

```md
import MyComponent from '../components/MyComponent.astro';

<MyComponent title="示例标题">

这里是组件内容...

</MyComponent>
```

## 样式进阶

### CSS 变量覆盖

主题提供了丰富的 CSS 变量，可以覆盖任何样式：

```css
:root {
  /* 修改主题色 */
  --c-accent: #8b5cf6;

  /* 修改字体 */
  --font-ui: 'SF Pro Display', sans-serif;

  /* 修改侧边栏宽度 */
  --sidebar-width: 320px;
}
```

### 响应式设计

主题内置了响应式断点：

| 断点 | 宽度 | 说明 |
|-----|------|-----|
| 移动端 | < 768px | 侧边栏折叠 |
| 平板 | 768px - 1024px | TOC 隐藏 |
| 桌面 | > 1024px | 完整布局 |

## 部署

### 静态部署

主题输出为纯静态文件，可部署到任何静态托管服务：

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

### 构建优化

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 下一步

- 探索更多[自定义样式](/articles/styling)选项
- 了解[配置选项](/articles/configuration)的完整列表
