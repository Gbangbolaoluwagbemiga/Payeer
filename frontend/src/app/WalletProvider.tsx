"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { authenticate, UserSession, AppConfig } from "@stacks/connect";

const appConfig = new AppConfig(["store_write", "publish_data"]);

interface WalletContextType {
    address: string | null;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
    address: null,
    isConnected: false,
    connect: () => { },
    disconnect: () => { },
});

export function WalletProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);

    const isConnected = !!address;

    const connect = () => {
        const userSession = new UserSession({ appConfig });
        authenticate(
            {
                appDetails: {
                    name: "Payeer",
                    icon: typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "/logo.png",
                },
                userSession,
                onFinish: () => {
                    try {
                        const userData = userSession.loadUserData();
                        const stxAddress =
                            userData?.profile?.stxAddress?.mainnet ||
                            userData?.profile?.stxAddress?.testnet ||
                            null;
                        setAddress(stxAddress);
                    } catch {
                        console.error("Failed to load user data");
                    }
                },
                onCancel: () => {
                    console.log("Wallet connection cancelled");
                },
            }
        );
    };

    const disconnect = () => {
        setAddress(null);
    };

    return (
        <WalletContext.Provider value={{ address, isConnected, connect, disconnect }}>
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => useContext(WalletContext);
