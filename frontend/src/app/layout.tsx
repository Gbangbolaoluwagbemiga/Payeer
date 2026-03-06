import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./WalletProvider";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "600", "800"] });

export const metadata: Metadata = {
  title: "Payeer — Let the Wheel Decide Who Pays",
  description: "Payeer is a fun, fair, and on-chain bill-splitting dapp built on Stacks. Add your friends, spin the wheel, and let randomness decide who pays — forever recorded on the blockchain.",
  keywords: ["stacks", "blockchain", "bill split", "spinner", "web3", "dapp", "clarity"],
  authors: [{ name: "Payeer" }],
  metadataBase: new URL("https://payeer.vercel.app"),
  openGraph: {
    title: "Payeer — Let the Wheel Decide Who Pays",
    description: "A fair, on-chain bill-splitting app built on the Stacks blockchain.",
    url: "https://payeer.vercel.app",
    siteName: "Payeer",
    images: [{ url: "/logo.png", width: 630, height: 630, alt: "Payeer Logo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Payeer — Let the Wheel Decide Who Pays",
    description: "A fair, on-chain bill-splitting app built on the Stacks blockchain.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
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
