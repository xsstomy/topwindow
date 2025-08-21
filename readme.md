
# TopWindow Website

The official website for TopWindow - the ultimate window management tool for macOS.

## 🚀 Technologies

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages (Static Export)

## 🛠 Development

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Export static site:
```bash
npm run export
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx      # Root layout with SEO
│   ├── page.tsx        # Homepage
│   └── globals.css     # Global styles
├── components/
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── DemoSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── CallToActionSection.tsx
│   └── Footer.tsx
└── lib/
    └── metadata.ts     # SEO configuration
```

## 🎨 Features

- ✅ Responsive design
- ✅ SEO optimized
- ✅ Smooth animations
- ✅ Performance optimized
- ✅ Static site generation
- ✅ Cloudflare Pages ready

## 🚀 Deployment

The site is configured for static export and can be deployed to:

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

For Cloudflare Pages, simply run:
```bash
npm run build
```

The output will be in the `out/` directory.

## 📚 Documentation

Complete project documentation is available in the `/docs` directory:

- **[📋 Implementation Plans](./docs/implementation/)** - Detailed development guides
- **[📖 User Guides](./docs/guides/)** - Operation and maintenance guides  
- **[🔌 API Documentation](./docs/api/)** - API interface documentation
- **[📑 Main Documentation Index](./docs/README.md)** - Complete documentation overview

### Quick Links
- [First Day Implementation Plan](./docs/implementation/DAY1_IMPLEMENTATION_PLAN.md) - Infrastructure setup
- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md) - Complete technical specification

## 🔄 Project Evolution

This project is being upgraded from a static website to a full SaaS application with:
- 🔐 User authentication system
- 🔑 License key management
- 💳 Payment processing
- 👤 User dashboard and device management

App License Key 服务器验证流程
这套流程旨在通过一个轻量级的中心服务器来验证、激活和管理软件的许可证密钥（License Key），以保护软件的付费功能。

一、核心组成部分
整个系统主要由三个部分构成：

你的 App (客户端)： 需要集成验证逻辑的应用程序。用户在这里输入 License Key。

许可证服务器 (后端)： 一个轻量级的 API 服务器，负责处理所有与许可证相关的请求。这是整个系统的核心。

数据库： 用于存储所有 License Key 的信息、状态以及与它们关联的数据。

二、详细工作流程
整个流程可以分为四个主要阶段：生成与分发、首次激活验证、本地状态存储 和 定期复验。

阶段 1：License Key 的生成与分发
这个阶段在用户购买软件后发生。

用户购买与身份验证： 用户通过你的网站、应用商店或其他渠道完成支付。

为了提供更好的用户体验和管理功能，强烈建议在你的网站上集成一个用户身份验证系统。这样，许可证密钥可以与用户的账户（user_id）绑定，便于用户管理自己的购买记录和已激活设备。

推荐方案：使用 Supabase Auth

Supabase Auth 是一个强大的身份验证服务，提供了开箱即用的用户注册、登录、密码重置和社交登录功能。

优点：

安全： 由安全专家维护，处理了所有复杂的安全问题，如密码哈希和令牌管理。

开发速度快： 提供易于集成的 SDK，只需少量代码即可实现完整的用户流程。

多功能： 支持多种登录方式（电子邮件/密码、Google、GitHub 等）。

免费： 对于每月活跃用户数（MAU）低于 50,000 的应用，几乎是免费的，非常适合起步阶段。

网站后端流程（以 Next.js API Routes 和 Supabase 为例）：
当用户完成支付后，你的电商后端服务（例如 Stripe, Paddle 或自建支付系统）会接收到一个成功的支付事件。此时，你可以调用一个内部的 API 接口来生成和分发许可证。这个接口需要：

从支付信息中获取用户 ID： 将支付事件与已登录的 Supabase 用户 ID 关联起来。

生成许可证密钥： 调用一个生成函数，例如使用 uuid 库生成一个 UUID。

保存许可证到数据库： 将新生成的许可证密钥、用户 ID、激活限制等信息存入你的 licenses 表中。

发送确认邮件： 使用 Supabase 或其他邮件服务，将许可证密钥通过邮件发送给用户。

生成密钥： 支付成功后，你的销售系统或后台管理系统调用许可证服务器的一个内部接口。

服务器操作：

生成 License Key 的具体方案

方案一：使用 UUID（通用唯一标识符）
最简单且可靠的方法是生成一个 UUID (Universally Unique Identifier)。UUID 是一种 128 位数字，保证了在全球范围内的唯一性。其优点是无需中心化的协调，几乎可以肯定不会发生冲突。

示例： 9b1de4a1-b049-43c2-8d76-d1891c33f7c1

方案二：结合 UUID 与校验码/产品前缀
为了提高可读性和减少用户输入错误，可以对 UUID 进行格式化，并添加产品前缀或校验码。

示例： PRODUCT-XXXX-XXXX-XXXX-XXXX

优点： 这种格式更友好，并且服务器端可以先通过校验码快速验证密钥格式的合法性，再进行数据库查询，提高效率。

方案三：基于加密签名的密钥
这是一种更复杂的方案，密钥包含一个可公开验证的签名。生成时，使用一个私钥对密钥的某个部分进行签名。验证时，客户端或服务器可以使用公钥验证签名，从而在不查询数据库的情况下验证密钥的合法性（例如用于离线验证）。

优点： 极高的安全性，且支持离线验证，但实现起来较为复杂。

将这个 Key 存入数据库，并记录相关信息，例如：

license_key (主键)

status (状态：active, revoked, expired)

activation_limit (可激活设备数量，例如：3)

activated_devices (已激活设备的唯一标识列表，初始为空)

created_at (创建时间)

expires_at (过期时间，如果是永久许可则为 null)

user_id / email (关联到哪个用户)

发送给用户： 系统通过电子邮件或其他方式，将生成的 License Key 发送给购买用户。

阶段 2：首次激活验证
这是用户第一次在 App 中使用 License Key 的流程。

用户输入： 用户在 App 的激活界面输入收到的 License Key。

客户端准备数据：

获取用户输入的 license_key。

生成一个当前设备的唯一标识符 (Device ID)。这个 ID 应该尽可能稳定，例如可以是硬件哈希、操作系统 UUID 等。对于 macOS 应用，以下是两种推荐的方案：

方案一：使用 IDFV (Identifier for Vendor) + keychain
IDFV 是苹果为每个应用厂商提供的唯一标识符，对于同一家公司发布的多个应用，它在同一台设备上是相同的。它的缺点是如果用户卸载了该厂商的所有应用，IDFV 会被重置。为了解决这个问题，可以将其与 keychain 结合使用。

优点： 易于获取，且在大多数情况下稳定。

实施方式： 在应用启动时，首先尝试从 keychain 中读取保存的 Device ID。如果不存在，则生成一个新的 UUID 并将其存储到 keychain 中，同时使用 IDFV 作为回退方案。

方案二：结合硬件信息生成 ID
这种方法更为稳定，因为它不依赖于应用或厂商。你可以通过调用系统 API 来获取硬件信息，例如：

Mac Pro/iMac: 序列号

MacBook: 硬件 UUID (Hardware UUID)

优点： 即使应用被卸载并重新安装，Device ID 仍然保持不变。

实施方式： 将获取的硬件信息进行哈希处理（例如使用 SHA256），生成一个唯一的、不可逆的 Device ID。这能有效保护用户隐私，同时保证唯一性。

最佳实践： 综合考虑，最可靠的方案是首先尝试使用硬件信息来生成 Device ID。如果由于权限或其他原因无法获取，再使用 keychain 存储的自定义 UUID 作为回退。这样可以最大限度地保证 Device ID 的稳定性和唯一性。

发起 API 请求： App 向你的许可证服务器发起一个 HTTPS POST 请求，例如请求到 https://api.yourdomain.com/v1/licenses/activate。

请求体 (Request Body):

{
  "license_key": "PRODUCT-ABCD-1234-EFGH-5678",
  "device_id": "unique-device-identifier-string"
}


服务器处理验证：

收到请求后，服务器首先查询数据库中是否存在该 license_key。

如果 Key 不存在：返回 404 Not Found 或自定义的错误码，提示“无效的许可证”。

如果 Key 存在，则进行一系列检查：

检查状态： Key 的 status 是否为 active？如果已被吊销 (revoked) 或已过期 (expired)，则拒绝激活。

检查设备数量： activated_devices 列表的长度是否已经达到 activation_limit？

在检查前，需要确认当前 device_id 是否已经存在于 activated_devices 列表中。如果已存在，说明是同一设备重复激活，可以直接返回成功。

如果 device_id 是新的，并且激活数量已满，则拒绝激活。

检查有效期： expires_at 是否早于当前时间？如果是，则更新 Key 状态为 expired 并拒绝激活。

更新数据库并返回结果：

如果所有检查都通过，服务器会：

将新的 device_id 添加到 activated_devices 列表中。

向客户端返回一个成功的响应。

成功响应 (Response Body):

{
  "status": "success",
  "message": "Activation successful.",
  "activated_at": "2023-10-27T10:00:00Z",
  "expires_at": "2024-10-27T10:00:00Z" 
}


失败响应 (Response Body):

{
  "status": "error",
  "message": "Activation limit reached." 
}


阶段 3：客户端本地状态存储
激活成功后，为了避免每次启动 App 都需要联网验证，需要在本地安全地存储激活状态。

接收成功响应： App 接收到服务器的成功响应。

解锁功能： 在当前会话中解锁所有付费功能。

保存凭证： 将激活状态和一个“凭证”写入本地。

阶段 4：定期复验 (可选但推荐)
为了处理用户退款、吊销密钥或更换设备等情况，App 需要定期与服务器通信。

触发时机： 可以设置每隔一段时间（例如 7 天或 30 天）进行一次静默的后台验证。

验证流程： App 向服务器的另一个接口（如 /v1/licenses/validate）发送本地存储的 license_key 和 device_id。服务器检查 Key 的有效性并返回结果。

三、关键技术与最佳实践
通信安全： 客户端与服务器之间的所有通信都必须使用 HTTPS。

设备 ID 的稳定性： 选择一个稳定且唯一的设备标识符非常重要。

用户体验 (UX)： 提供清晰的错误提示、离线宽限期和设备管理功能。

客户端安全： 核心验证逻辑始终在服务器端，这是最安全的保障。

四、具体实施步骤 (Vercel + Supabase)
下面是使用 Vercel 作为服务器、Supabase 作为数据库的具体操作指南。

步骤 1：设置 Supabase 数据库
创建项目： 前往 Supabase.io 注册并创建一个新项目。选择一个离你用户最近的区域，然后等待数据库启动。

创建数据表：

在 Supabase 项目仪表盘中，找到左侧菜单的 “SQL Editor”。

点击 “New query” 并粘贴以下 SQL 代码来创建 licenses 表：

CREATE TABLE licenses (
  license_key TEXT PRIMARY KEY NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL,
  activation_limit INT DEFAULT 1 NOT NULL,
  activated_devices TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ,
  user_id TEXT
);


点击 “RUN” 执行。这张表就创建好了。activated_devices 字段被设计为文本数组，可以直接存储设备 ID 列表。

获取 API 密钥：

在左侧菜单中找到 “Project Settings” -> “API”。

记下你的 Project URL 和 service_role Secret。注意：service_role 密钥拥有最高权限，必须严格保密，绝不能泄露到客户端代码中。 我们将在服务器端使用它。

步骤 2：创建 Vercel 后端服务 (以 Next.js 为例)
我们将使用 Next.js 的 API Routes 功能，因为它能与 Vercel 完美集成。

初始化项目：

在你的电脑上打开终端，运行 npx create-next-app@latest license-server。

进入项目目录：cd license-server。

安装 Supabase 客户端：

运行 npm install @supabase/supabase-js。

创建 API 接口：

在项目 pages/api/ 目录下创建一个新文件 activate.js。

将以下代码粘贴到 activate.js 中。这段代码实现了第二部分描述的激活验证逻辑：

import { createClient } from '@supabase/supabase-js';

// 从环境变量初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
  }

  const { license_key, device_id } = req.body;

  if (!license_key || !device_id) {
    return res.status(400).json({ status: 'error', message: 'License key and device ID are required.' });
  }

  try {
    // 1. 查询 License Key
    const { data: license, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('license_key', license_key)
      .single();

    if (error || !license) {
      return res.status(404).json({ status: 'error', message: 'License key not found.' });
    }

    // 2. 检查状态
    if (license.status !== 'active') {
      return res.status(403).json({ status: 'error', message: `License key is ${license.status}.` });
    }

    // 3. 检查有效期
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return res.status(403).json({ status: 'error', message: 'License key has expired.' });
    }

    const activatedDevices = license.activated_devices || [];

    // 4. 检查设备是否已激活
    if (activatedDevices.includes(device_id)) {
      return res.status(200).json({ status: 'success', message: 'Device already activated.' });
    }

    // 5. 检查激活数量限制
    if (activatedDevices.length >= license.activation_limit) {
      return res.status(403).json({ status: 'error', message: 'Activation limit reached.' });
    }

    // 6. 更新数据库
    const updatedDevices = [...activatedDevices, device_id];
    const { error: updateError } = await supabase
      .from('licenses')
      .update({ activated_devices: updatedDevices })
      .eq('license_key', license_key);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Activation successful.',
      expires_at: license.expires_at,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}


步骤 3：部署到 Vercel
关联 GitHub： 将你的 license-server 项目推送到一个 GitHub（或其他 Git 提供商）仓库。

创建 Vercel 项目：

登录 Vercel，点击 “Add New... -> Project”。

选择你刚刚创建的 Git 仓库并导入。

Vercel 会自动识别出这是个 Next.js 项目。

配置环境变量：

在项目设置页面，找到 “Environment Variables”。

添加两个变量：

NEXT_PUBLIC_SUPABASE_URL：值为你 Supabase 项目的 URL。

SUPABASE_SERVICE_ROLE_KEY：值为你 Supabase 项目的 service_role 密钥。

部署： 点击 “Deploy”。几分钟后，你的 API 就会部署到全球网络上。Vercel 会提供一个 .vercel.app 的域名给你，例如 https://license-server.vercel.app。

步骤 4：客户端集成
现在，你的 App 只需要向部署好的 Vercel API 地址发起 POST 请求即可。

API Endpoint: https://<你的Vercel项目名>.vercel.app/api/activate

请求方法: POST

请求体:

{
  "license_key": "用户输入的密钥",
  "device_id": "客户端生成的设备ID"
}


你的轻量级、高性能且免费的许可证服务器就搭建完成了！