"use client";

import { useState } from "react";
import { Plus, Trash2, X, RefreshCw, Wallet, LogOut, Sparkles, CheckCircle, ExternalLink } from "lucide-react";
import { useWallet } from "./WalletProvider";
import Image from "next/image";
import { openContractCall } from "@stacks/connect";
import { uintCV, stringAsciiCV, principalCV } from "@stacks/transactions";
import { STACKS_MAINNET } from "@stacks/network";

const CONTRACT_ADDRESS = "SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK";
const CONTRACT_NAME = "payeer";

const COLORS = [
  "#8a2be2", "#ff3b3b", "#00c9c9", "#ff00aa",
  "#ffd700", "#00d48a", "#ff6600", "#5591f5",
];

function SpinnerWheel({
  friends,
  rotation,
}: {
  friends: { id: string; name: string }[];
  rotation: number;
}) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  if (friends.length === 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
