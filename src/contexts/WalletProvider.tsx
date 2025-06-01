
'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { FC, ReactNode } from 'react';
import * as web3 from '@solana/web3.js';

import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
    children: ReactNode;
}

const WalletConnectionProvider: FC<WalletProviderProps> = ({ children }) => {
    // const network = WalletAdapterNetwork.Devnet;
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // // const wallets = useMemo(
    // //     () => [ new SolflareWalletAdapter({ network })],
    // //     [network]
    // // );

    const endpoint = web3.clusterApiUrl('devnet');
    const wallets = [
        new walletAdapterWallets.PhantomWalletAdapter(),
        new walletAdapterWallets.SolflareWalletAdapter(),
        new walletAdapterWallets.BitgetWalletAdapter(),
        new walletAdapterWallets.WalletConnectWalletAdapter({
            network: WalletAdapterNetwork.Mainnet, // or 'devnet', 'testnet'
            options: {
                relayUrl: 'https://relay.walletconnect.org', // Default WalletConnect relay server
                projectId: 'your_project_id', // Optional, if you have a WalletConnect project ID
            },
        }),
    ];

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} >
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default WalletConnectionProvider;
