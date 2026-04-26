import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://checkllm.local"),
  title: {
    default: "checkllm | LLM 模型真实性与保真度检测",
    template: "%s | checkllm"
  },
  description:
    "checkllm 用于检测 OpenAI 与 Anthropic 风格接口的真实性、协议一致性与模型保真度，帮助识别套壳、降级与包装层风险。",
  applicationName: "checkllm",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "checkllm | LLM 模型真实性与保真度检测",
    description:
      "提交 base_url、API Key 与目标模型，发起一次异步真实性检测，并浏览公开共享的检测结果。",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "checkllm | LLM 模型真实性与保真度检测",
    description:
      "一个克制、可信的模型真实性检测入口。"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
