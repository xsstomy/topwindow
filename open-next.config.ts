import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // 明确指定配置以确保构建成功
  runtime: "node",
  experimental: {
    disableMinification: false,
    disableSourceMaps: false,
  },
  buildCommand: "npm run build",
});