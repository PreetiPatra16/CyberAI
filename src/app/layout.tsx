import type { Metadata } from "next";
import "./globals.css";
import { ProgressProvider } from "@/components/progress-provider";

export const metadata: Metadata = {
  title: "CyberAI | Security training that sticks",
  description: "Interactive cybersecurity awareness training for modern teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
