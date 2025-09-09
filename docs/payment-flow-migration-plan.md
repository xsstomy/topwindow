# 支付流程改造计划（Webhook 主流程 + API 兜底）

本文档用于规划并落地 TopWindow 的支付回调改造：以 Webhook 为事实来源（主流程），并新增服务端 API 确认作为兜底，以提升稳定性与用户体验。包含实施步骤、配置清单、验证方案、回滚与备份指引，便于后续审计与回撤。

## 1. 背景与问题

- Creem 控制台显示 webhook 事件 `checkout.completed` 多次为红叉（非 2xx）。
- 现网代码对 Creem 的回调格式与验签方式不完全兼容：
  - 事件名不同：回调使用 `checkout.completed`，而服务端只处理 `payment.completed`。
  - 验签不符合规范：应使用 Webhook Signing Secret 对“原始请求体 raw body”做 HMAC-SHA256 校验，而不是 API Key/简化散列。
- 成功页轮询 10 次仍 pending，最后触发“手动处理”兜底，体验不理想。

## 2. 目标

- Webhook 回调 2xx 成功率显著提升，事件能正确入库并生成许可证。
- 成功页在回调延迟时可快速“服务端确认”，无需长时间轮询。
- 安全合规：严格验签、常量时间比较，避免被伪造调用。
- 可观测：便于排障与对账。

## 3. 总体方案

- 主流程：Creem Webhook → 服务端验签 → 规范化事件 → 更新 `payments` → 生成 `licenses` → 发确认邮件。
- 兜底流：支付成功跳转 `success_url` 时，前端携带 `checkout_id/order_id/payment_id` → 调用后端“确认接口”
  - 后端使用平台 API + 我们之前创建的内部 `payment_id` 做强校验；成功则补写数据库与许可证。
- 对账：定时任务扫描长时间 `pending` 的订单，调用平台 API 进行补偿处理。

## 4. 变更清单（技术设计）

### 4.1 Webhook 路由（creem）
- 验签：
  - 使用 Webhook Signing Secret 对“原始请求体 raw body”做 `HMAC-SHA256`，输出 hex（或按头部格式匹配）。
  - 支持签名头：`x-creem-signature`、`creem-signature`、`x-signature`、`signature`。
  - 使用常量时间比较（timing-safe equality）。
- 事件标准化：
  - `checkout.completed` → `payment.completed`
  - `checkout.failed|checkout.canceled|checkout.cancelled` → `payment.failed`
- 数据映射：
  - `session_id = object.id`（如 `ch_...`）
  - `payment_id`（我方内部）= `object.metadata.payment_id`
  - `amount = object.order.amount`，`currency = object.order.currency`
  - `customer.email = object.customer.email`
- 幂等：若 `payments.status === 'completed'` 则直接 200 返回（防重放）。
- 日志：打印 `received/verification/event normalized/processing finished` 关键信息（屏蔽敏感数据）。

### 4.2 成功页（/payment/success）
- 轮询策略优化：3s × 4 次；若仍 pending，调用“服务器端确认接口”；仍失败再提示手动处理。
- 文案：pending 显示“Order Time/下单时间”，completed 显示“Completion Time”。

### 4.3 新增服务端“确认接口”（兜底）
- 路由：`POST /api/payments/confirm`
- 入参：`provider, checkout_id, order_id, payment_id, signature(可选)`
- 逻辑：
  1) 根据 `payment_id` 定位我方 `payments` 记录，验证归属用户与 `provider`。
  2) 调用 Creem API（使用 API Key）查询该 `checkout/order`，确认支付状态与金额、币种、产品一致。
  3) 状态为已支付则更新 `payments → completed`，生成 `licenses`，发送邮件。
  4) 全流程幂等；失败返回明确错误码。

### 4.4 定时对账任务（可选，后续版本）
- 扫描 `pending > N 分钟` 的订单，调用平台 API 校验并补回。

## 5. 配置与环境变量

- 基础
  - `NEXT_PUBLIC_APP_URL=https://topwindow.app`
- Creem（生产）
  - `CREEM_SECRET_KEY_PROD`（API Key，用于调用 Creem REST API）
  - `CREEM_WEBHOOK_SECRET_PROD`（Webhook 签名密钥，用于验签）
  - `CREEM_API_URL_PROD`（默认 `https://api.creem.io`）
  - `CREEM_PRODUCT_ID_PROD`
- Creem（测试环境）同理：`*_TEST`

注意：API Key 与 Webhook Signing Secret 为不同用途，严禁混用。

## 6. 实施步骤（分阶段）

### 阶段 A：预发验证（推荐）
1) 在预发/Preview 环境配置上述变量（使用 TEST 组）。
2) 部署改造版代码。
3) 在 Creem 控制台 Webhooks 对最近的 `checkout.completed` 事件点 Resend。
4) 预期：
   - 控制台事件变为绿色（2xx）。
   - 日志显示 `verification: VALID`、`normalized: payment.completed`、`processing finished ...`。
   - Supabase：`payments.status=completed`、`licenses` 生成。
5) /payment/success 页面能在短时间内显示 Completed。

### 阶段 B：生产发布
1) 将生产环境变量设置为 PRODUCTION 组值（不要泄露）。
2) `npm run deploy` 按现有流程发布。
3) Creem 控制台 Resend 最近失败事件；观察变绿。
4) 现场真实支付验证一笔。

## 7. 验证与监控

- 路由健康检查：GET `/api/payments/creem/webhook`（健康响应）。
- 关键日志：`Creem webhook received / verification / normalized / finished`。
- DB 验证：`payments`、`licenses` 记录；完成时间 `completed_at`。
- 前端：成功页状态与时间展示正确。

## 8. 回滚与应急（见文末清单）

- 快速恢复 2xx（临时）：将 `CREEM_WEBHOOK_SECRET_*` 设为包含 `mock` 的占位值（当前代码会跳过验签），用于临时恢复链路（注意安全风险）；修复完后恢复严格验签。
- 完整回滚：使用上一次稳定版镜像/commit 重新发布；保留已生成许可证（幂等）。

## 9. 风险与缓解

- 跨境网络波动：保留 API 兜底与对账任务。
- 签名头格式变化：已兼容多种常见头；同时在日志打印实际收到的头键名（不含值）。
- 幂等与重放：以 `payment_id` 和 `status` 限制重复处理；对相同 `payment_id` 的重复 completed 直接 200 返回。

## 10. 时间线与负责人

- 预发改造与联调：0.5 天
- 生产发布与验证：0.5 天
- 观察期与对账接入：1–2 天

Owner: 开发 @你 / 协作：运营/支持

---

## 附录 A：HMAC-SHA256 验签（示例）

> 说明：Creem 的签名通常使用 Webhook Signing Secret + 原始请求体 raw body 计算。

```ts
import crypto from 'node:crypto'

export function timingSafeEqual(a: string, b: string) {
  const ab = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

export function verifySignature(rawBody: string, signature: string, secret: string) {
  const hex = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')
  const base64 = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')
  return timingSafeEqual(signature, hex) || timingSafeEqual(signature, base64)
}
```

## 附录 B：发布前检查清单（简版）

- [ ] 预发环境变量就绪（TEST 组）。
- [ ] webhook 路由健康检查通过。
- [ ] Resend 事件 2xx；DB 有完成记录和许可证。
- [ ] 成功页完成态展示正确。
- [ ] 生产变量与预发一致性核对（PROD 组）。

## 附录 C：回滚与备份（要点）

- 备份（外部系统/安全库保存，不入库到 Git）：
  - 环境变量快照（.env 清单，不含明文）。
  - Supabase `payments`、`licenses` 最近 7 天快照（用于审计，非必须回滚）。
- 回滚步骤：
  1) 选择上一个稳定版本 Commit/Worker 版本重新部署；
  2) 恢复旧版本环境变量（保留新增变量不影响旧版运行即可）；
  3) 保留已生成的许可证数据（幂等，通常无需回滚数据）。

