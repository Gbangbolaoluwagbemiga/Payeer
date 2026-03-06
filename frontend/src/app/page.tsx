"use client";

import { useState } from "react";
import { Plus, Trash2, X, RefreshCw, Wallet, LogOut, Sparkles, CheckCircle } from "lucide-react";
import { useWallet } from "./WalletProvider";
import Image from "next/image";

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
        const textPos = polarToCartesian(midAngle, r * 0.62);

        // Clamp text: max 8 chars per line
        const displayName = friend.name.length > 9 ? friend.name.slice(0, 8) + "…" : friend.name;

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
              fontSize={friends.length > 6 ? "11" : "13"}
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
      {/* Center hub */}
      <circle cx={cx} cy={cy} r={14} fill="#1a1a2e" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={7} fill="var(--accent, #00f0ff)" opacity="0.8" />
    </svg>
  );
}

export default function Home() {
  const { address, isConnected, connect, disconnect } = useWallet();
  const [friends, setFriends] = useState<{ id: string; name: string }[]>([]);
  const [newName, setNewName] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

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

    const spins = 5 + Math.floor(Math.random() * 5);
    const sliceAngle = 360 / friends.length;
    // Pick a random winner first, then calculate degree to land on that slice
    const winnerIdx = Math.floor(Math.random() * friends.length);
    // Land on the middle of the winning slice
    const targetAngle = 360 - (winnerIdx * sliceAngle + sliceAngle / 2);
    const totalRotation = rotation + spins * 360 + targetAngle - (rotation % 360);

    setRotation(totalRotation);

    setTimeout(() => {
      setWinner(friends[winnerIdx].name);
      setSpinning(false);
    }, 5200);
  };

  const closeWinner = () => setWinner(null);

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null;

  return (
    <main className="container">
      {/* Header */}
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

      {/* Hero */}
      <div className="hero">
        <h1>Who&apos;s Paying?</h1>
        <p>Add your friends, spin the wheel, and let fate decide — recorded forever on Stacks.</p>
      </div>

      <div className="main-content">
        {/* Friends Panel */}
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
                        width: 12, height: 12, borderRadius: "50%",
                        backgroundColor: COLORS[idx % COLORS.length],
                        display: "inline-block", flexShrink: 0,
                      }}
                    />
                    {friend.name}
                  </div>
                  <button className="btn-danger" onClick={() => removeFriend(friend.id)} type="button">
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {friends.length < 2 && (
            <div className="hint-text">Add at least 2 friends to spin the wheel</div>
          )}
        </div>

        {/* Spinner Panel */}
        <div className="panel">
          <h2>2. Spin The Wheel</h2>
          <div className="spinner-container" style={{ marginTop: "1.5rem" }}>
            {/* Pointer */}
            <div className="wheel-pointer" />
            {/* SVG wheel — no manual overflow wrapper needed */}
            <div className="wheel-frame" style={{ overflow: "visible", border: "none", background: "none" }}>
              <SpinnerWheel friends={friends} rotation={rotation} />
            </div>

            <button
              className={`btn-spin ${!spinning && friends.length >= 2 ? "pulse-animation" : ""}`}
              onClick={spinWheel}
              disabled={friends.length < 2 || spinning}
            >
              {spinning ? (
                <><RefreshCw size={20} className="spin-icon" /> Spinning...</>
              ) : (
                <><Sparkles size={20} /> Let&apos;s Spin!</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <div className={`winner-overlay ${winner ? "show" : ""}`}>
        <div className="winner-card">
          <div className="winner-emoji">🎉</div>
          <h2>Time to pay up!</h2>
          <div className="winner-name">{winner}</div>
          <p style={{ margin: "0 0 2rem", color: "rgba(255,255,255,0.7)" }}>
            Selected fairly by the Payeer wheel
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={closeWinner}><X size={18} /> Close</button>
            {isConnected && (
              <button className="btn-secondary"><CheckCircle size={18} /> Record on Stacks</button>
            )}
          </div>
          {!isConnected && (
            <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)" }}>
              Connect your wallet to record this result on-chain
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
