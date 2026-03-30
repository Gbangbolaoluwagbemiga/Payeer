import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "./WalletProvider";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "600", "800"] });
