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
        <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.3)" fontSize="16" fontFamily="Outfit,sans-serif">
          Empty
        </text>
      </svg>
    );
  }

  const sliceAngle = 360 / friends.length;

  function polarToCartesian(angleDeg: number, radius: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function slicePath(startAngle: number, endAngle: number) {
    const start = polarToCartesian(startAngle, r);
    const end = polarToCartesian(endAngle, r);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: `rotate(${rotation}deg)`, transition: "transform 5s cubic-bezier(0.1,0.8,0.1,1)" }}
    >
      {friends.map((friend, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        const midAngle = startAngle + sliceAngle / 2;
        const textPos = polarToCartesian(midAngle, r * 0.65);

        const displayName = friend.name.length > 10 ? friend.name.slice(0, 8) + "…" : friend.name;

        return (
          <g key={friend.id}>
            <path
              d={slicePath(startAngle, endAngle)}
              fill={COLORS[i % COLORS.length]}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1.5"
            />
            <text
              x={textPos.x}
              y={textPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
