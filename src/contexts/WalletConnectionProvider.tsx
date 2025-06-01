'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
  CoinbaseWalletAdapter,
  Coin98WalletAdapter,
  BitpieWalletAdapter,
  BitgetWalletAdapter,
  TrustWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

interface WalletConnectionContextType {
  network: WalletAdapterNetwork;
  endpoint: string;
}

const WalletConnectionContext = createContext<WalletConnectionContextType | undefined>(undefined);

export const useWalletConnection = () => {
  const context = useContext(WalletConnectionContext);
  if (!context) {
    throw new Error('useWalletConnection must be used within a WalletConnectionProvider');
  }
  return context;
};

interface WalletConnectionProviderProps {
  children: React.ReactNode;
  network?: WalletAdapterNetwork;
}

export function WalletConnectionProvider({ 
  children, 
  network = WalletAdapterNetwork.Mainnet 
}: WalletConnectionProviderProps) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet) {
      return clusterApiUrl('devnet');
    } else if (network === WalletAdapterNetwork.Testnet) {
      return clusterApiUrl('testnet');
    } else {
      return clusterApiUrl('mainnet-beta');
    }
  }, [network]);

  // Configure supported wallets
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new Coin98WalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new BitpieWalletAdapter(),
      new BitgetWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    []
  );

  const contextValue = useMemo(() => ({
    network,
    endpoint,
  }), [network, endpoint]);

  return (
    <WalletConnectionContext.Provider value={contextValue}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider 
          wallets={wallets} 
          autoConnect={false}
          onError={(error) => {
            console.error('Wallet connection error:', error);
          }}
        >
          {children}
        </WalletProvider>
      </ConnectionProvider>
    </WalletConnectionContext.Provider>
  );
}