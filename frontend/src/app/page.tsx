"use client";

import { useState } from "react";
import { Plus, Trash2, X, RefreshCw, Wallet, LogOut, Sparkles, CheckCircle, ExternalLink } from "lucide-react";
import { useWallet } from "./WalletProvider";
import Image from "next/image";
import { openContractCall } from "@stacks/connect";
import { uintCV, stringAsciiCV, principalCV } from "@stacks/transactions";
import { STACKS_MAINNET } from "@stacks/network";

const CONTRACT_ADDRESS = "SP3BHPVZEKANVD62KDME41G0E02KGPMKRANWF5PQK";
