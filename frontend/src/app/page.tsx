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
              fontSize={friends.length > 8 ? "10" : "12"}
              fontWeight="700"
              fontFamily="Outfit,sans-serif"
              style={{ pointerEvents: "none", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
              transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
            >
              {displayName}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={14} fill="#1a1a2e" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={7} fill="#00f0ff" opacity="0.8" />
    </svg>
  );
}

export default function Home() {
  const { address, isConnected, connect, disconnect } = useWallet();
  const [friends, setFriends] = useState<{ id: string; name: string }[]>([]);
  const [newName, setNewName] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<{ name: string; index: number } | null>(null);
  const [txId, setTxId] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const addFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === "") return;
    setFriends([...friends, { id: crypto.randomUUID(), name: newName.trim() }]);
    setNewName("");
  };

  const removeFriend = (id: string) => {
    setFriends(friends.filter((f) => f.id !== id));
  };

  const spinWheel = () => {
    if (friends.length < 2 || spinning) return;
    setSpinning(true);
    setWinner(null);
    setTxId(null);

    const spins = 7 + Math.floor(Math.random() * 5);
    const sliceAngle = 360 / friends.length;
    const winnerIdx = Math.floor(Math.random() * friends.length);
    const targetAngle = 360 - (winnerIdx * sliceAngle + sliceAngle / 2);
    const totalRotation = rotation + spins * 360 + (targetAngle - (rotation % 360) + 360) % 360;

    setRotation(totalRotation);

    setTimeout(() => {
      setWinner({ name: friends[winnerIdx].name, index: winnerIdx });
      setSpinning(false);
    }, 5200);
  };

  const recordResult = async () => {
    if (!winner || !isConnected || recording) return;
    setRecording(true);

    try {
      await openContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: "create-session",
        functionArgs: [
          uintCV(0), // amount (free session)
          stringAsciiCV(`Payeer Result: ${winner.name}`) || stringAsciiCV("Payeer Result")
        ],
        network: STACKS_MAINNET,
        onFinish: (data) => {
          console.log("Transaction finished:", data.txId);
          setTxId(data.txId);
          setRecording(false);
        },
        onCancel: () => {
          console.log("Transaction cancelled");
          setRecording(false);
        },
      });
    } catch (e) {
      console.error(e);
      setRecording(false);
    }
  };

  const closeWinner = () => {
    setWinner(null);
    setTxId(null);
  };

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  return (
    <main className="container">
      <div className="header-bar">
        <div className="logo-wrap">
          <div className="logo-spin-wrapper">
            <Image src="/logo.png" alt="Payeer Logo" width={40} height={40} className="logo-img" />
          </div>
          <span className="logo-text">Payeer</span>
        </div>
        <div className="wallet-connect">
          {isConnected ? (
            <div className="wallet-connected">
              <span className="wallet-address">
                <span className="wallet-dot" />
                {shortAddress}
              </span>
              <button className="btn-secondary btn-sm" onClick={disconnect} title="Disconnect">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button className="btn-connect" onClick={connect}>
              <Wallet size={18} />
              Connect Wallet
            </button>
          )}
        </div>
      </div>

      <div className="hero">
        <h1>Who&apos;s Paying?</h1>
        <p>Add your friends and let the wheel decide fairly on-chain.</p>
      </div>

      <div className="main-content">
        <div className="panel">
          <h2>1. Add Friends</h2>
          <form onSubmit={addFriend} style={{ marginTop: "1.5rem" }}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter friend's name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={20}
              />
              <button type="submit">
                <Plus size={20} />
              </button>
            </div>
          </form>

          {friends.length > 0 && (
            <ul className="friends-list">
              {friends.map((friend, idx) => (
                <li key={friend.id} className="friend-item">
                  <div className="friend-name">
                    <span
                      style={{
