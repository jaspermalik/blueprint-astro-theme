---
title: 配置选项
description: Blueprint Astro Theme 的所有配置选项
order: 2
---

## 主题配置

主题通过 `astro.config.mjs` 进行配置：

```js
export default defineConfig({
  integrations: [
    blueprint({
      // 侧边栏标题
      title: '我的文档',
      // 侧边栏副标题
      subtitle: '文档说明',
    }),
  ],
});
```

## CSS 变量

主题使用 CSS 变量来控制颜色。你可以在全局样式中覆盖这些变量：

```css
:root {
  --c-accent: #1B365D;
  --c-accent-hover: #2a4a7a;
  --sidebar-width: 280px;
}
```

## 暗色模式

主题支持三种主题模式：

- `light` - 亮色模式
- `dark` - 暗色模式
- `auto` - 跟随系统设置

用户可以通过点击主题切换按钮来切换模式。
