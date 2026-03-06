import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./WalletProvider";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "600", "800"] });

export const metadata: Metadata = {
  title: "Payeer — Who's Paying the Bill?",
  description: "A fun and fair way to decide who pays the bill, powered by Stacks blockchain.",
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
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
