import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./WalletProvider";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "600", "800"] });

const domain = "https://payeer-alpha.vercel.app";

export const metadata: Metadata = {
  title: "Payeer — Who's Paying the Bill?",
  description: "A fun and fair way to decide who pays the bill, powered by Stacks blockchain.",
  metadataBase: new URL(domain),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Payeer — Who's Paying the Bill?",
    description: "A fun and fair way to decide who pays the bill, powered by Stacks blockchain.",
    url: domain,
    siteName: "Payeer",
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 1024,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payeer — Who's Paying the Bill?",
    description: "A fun and fair way to decide who pays the bill, powered by Stacks blockchain.",
    images: ["/logo.png"],
  },
  other: {
    "talentapp:project_verification": "7e0fb0c25f67ec416751dee3fdadcce53c19b3b40deaa86e8a33957d688bd0a606e26ac0433302f4c9950cb3525dd2dc71a847d9b6d5f9db84d75733b7fec597"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
