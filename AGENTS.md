<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# 仓库指南（中文）

## 项目结构与模块组织
- 应用代码位于 `src/`：
  - `src/app/` – Next.js App Router 的路由、布局与页面元数据。路由段目录使用 kebab-case（如：`src/app/test-email`）。
  - `src/components/` – 可复用的 React 组件（文件名用 PascalCase，如：`Header.tsx`）。
  - `src/lib/` – 工具库、服务与集成代码（文件名用 camelCase，并按领域归类）。
  - `src/hooks/`、`src/config/`、`src/types/` – 自定义 hooks、运行时配置与共享类型。
- 静态资源在 `public/`。文档在 `docs/`。部署与工具脚本在 `scripts/`。

## 构建、测试与开发命令
- `npm run dev` – 启动 Next.js 开发服务器。
- `npm run build` – 构建 Next.js 应用。
- `npm start` – 本地服务已构建产物。
- `npm run lint` – 通过 Next lint 运行 ESLint。
- `npm run type-check` – 严格的 TypeScript 校验（`--noEmit`）。
- `npm run build:worker` – 使用 OpenNext 为 Cloudflare Workers 打包。
- `npm run preview:worker` – 本地预览 Workers 构建。
- `npm run dev:workers` – 运行 Wrangler 开发（Workers 路由）。
- `npm run deploy` – 预构建 + Workers 构建 + `wrangler deploy`。
- `npm run clean` – 清理构建缓存（`.next`、`.open-next`）。

## 代码风格与命名约定
- 优先使用 TypeScript；缩进 2 空格。遵循仓库中的 ESLint（`eslint-config-next`）与 Prettier 设置。
- 组件：文件名用 PascalCase（如：`PricingSection.tsx`），每个文件一个组件。
- Hooks：命名以 `useX` 开头，放在 `src/hooks/` 下就近维护。
- 工具/服务：位于 `src/lib/`，按领域归类（如：`payment/`、`email/`），文件名用 camelCase。
- 路由与文件夹：在 `src/app/` 下的 URL 段使用 kebab-case。
- 导入：优先使用 `@/` 别名替代 `src/`（在 `tsconfig.json` 中已配置）。

## 测试指南
- 目前尚未配置单元测试运行器。提交变更时至少确保：
  - `npm run type-check` 与 `npm run lint` 通过；
  - `npm run build` 成功；并在 `npm run dev` 下验证关键路由。
- 若新增测试，请使用 `*.test.ts(x)` 或 `__tests__/`，并在 PR 中注明测试框架（Vitest/Jest）。

## 提交与 Pull Request 指南
- 提交要小而清晰（祈使语）。可用英文或中文，优先保证清晰度。
- PR 必须包含：目的、变更范围、测试步骤，以及 UI 的截图/GIF。
- 关联相关 issue。申请评审前确保 lint、type-check 与 build 均通过。

## 安全与配置提示
- 机密信息存放在 `.env.local`（已在 Git 忽略）以及通过 Cloudflare 的 `wrangler secret put` 管理。
- 禁止提交任何 API key 或服务凭据（如 Supabase、Resend）。
- 修改认证或支付相关逻辑时，请审查 `middleware.ts` 和 `src/lib/*` 以避免副作用。
