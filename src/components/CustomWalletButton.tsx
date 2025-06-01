'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import Image from 'next/image';

const CustomWalletButton: React.FC = () => {
    const { connected,select, disconnect, wallet, wallets } = useWallet();
    const [showWalletOptions, setShowWalletOptions] = useState(false);

    const handleConnect = async (walletName: string) => {
        try {
            
            const selectedWallet = wallets.find((w) => w.adapter.name === walletName);
            if (selectedWallet) {
                select(selectedWallet.adapter.name);
                await selectedWallet.adapter.connect();
                if (selectedWallet.adapter.connected) {
                    setShowWalletOptions(false);
                }
            }
        } catch (error) {
            console.error("Wallet connection error:", error);
        }
    };

    const handleCloseModal = () => {
        setShowWalletOptions(false);
    };

   


    return (
        <div>
            {connected ? (
                <button type="button" onClick={disconnect} className="chakra-button css-h0ljux">Disconnect from {wallet?.adapter.name}</button>

            ) : (
                <button type="button" onClick={() => setShowWalletOptions(!showWalletOptions)} className="chakra-button css-h0ljux">Connect Wallet</button>

            )}

            {showWalletOptions && (
                <div className="chakra-portal">
                    <div className="chakra-modal__overlay css-s2ka2m" style={{ opacity: 1, willChange: 'auto' }} data-aria-hidden="true"
                        aria-hidden="true"></div>
                    <div data-focus-guard="true" tabIndex={0}
                        style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}
                        data-aria-hidden="true" aria-hidden="true"></div>
                    <div data-focus-lock-disabled="false">
                        <div className="chakra-modal__content-container css-wl0d9u" tabIndex={-1} >
                            <section className="chakra-modal__content css-6vmrx8" role="dialog" id="chakra-modal-:rt:" tabIndex={-1}
                                aria-modal="true" style={{ opacity: 1, willChange: 'auto', transform: 'none', }}
                                aria-describedby="chakra-modal--body-:rt:"><button type="button"  onClick ={handleCloseModal} aria-label="Close"
                                    className="chakra-modal__close-btn css-1ik4h6n"><svg viewBox="0 0 24 24" focusable="false"
                                        className="chakra-icon css-onkibi" aria-hidden="true">
                                        <path fill="currentColor"
                                            d="M.439,21.44a1.5,1.5,0,0,0,2.122,2.121L11.823,14.3a.25.25,0,0,1,.354,0l9.262,9.263a1.5,1.5,0,1,0,2.122-2.121L14.3,12.177a.25.25,0,0,1,0-.354l9.263-9.262A1.5,1.5,0,0,0,21.439.44L12.177,9.7a.25.25,0,0,1-.354,0L2.561.44A1.5,1.5,0,0,0,.439,2.561L9.7,11.823a.25.25,0,0,1,0,.354Z">
                                        </path>
                                    </svg></button>
                                <div className="chakra-stack chakra-modal__body css-48lp9b" id="chakra-modal--body-:rt:">
                                    <h2 className="chakra-heading css-1886hlo">Connect a wallet on Solana to continue</h2></div>
                                <div className="chakra-stack css-1i2407o">
                                    {wallets.map((wallet) => (
                                        <button type="button" className="chakra-button css-1s5cz1i" key={wallet.adapter.name} onClick={() => handleConnect(wallet.adapter.name)}>
                                            <div className="chakra-stack css-1uodvt1">
                                                <div className="chakra-aspect-ratio css-1hwelhq">
                                                    <Image
                                                        alt={`${wallet.adapter.name} logo`}
                                                        src={wallet.adapter.icon || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjEwOCIgdmlld0JveD0iMCAwIDEwOCAxMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9IiNBQjlGRjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni41MjY3IDY5LjkyMjlDNDIuMDA1NCA3Ni44NTA5IDM0LjQyOTIgODUuNjE4MiAyNC4zNDggODUuNjE4MkMxOS41ODI0IDg1LjYxODIgMTUgODMuNjU2MyAxNSA3NS4xMzQyQzE1IDUzLjQzMDUgNDQuNjMyNiAxOS44MzI3IDcyLjEyNjggMTkuODMyN0M4Ny43NjggMTkuODMyNyA5NCAzMC42ODQ2IDk0IDQzLjAwNzlDOTQgNTguODI1OCA4My43MzU1IDc2LjkxMjIgNzMuNTMyMSA3Ni45MTIyQzcwLjI5MzkgNzYuOTEyMiA2OC43MDUzIDc1LjEzNDIgNjguNzA1MyA3Mi4zMTRDNjguNzA1MyA3MS41NzgzIDY4LjgyNzUgNzAuNzgxMiA2OS4wNzE5IDY5LjkyMjlDNjUuNTg5MyA3NS44Njk5IDU4Ljg2ODUgODEuMzg3OCA1Mi41NzU0IDgxLjM4NzhDNDcuOTkzIDgxLjM4NzggNDUuNjcxMyA3OC41MDYzIDQ1LjY3MTMgNzQuNDU5OEM0NS42NzEzIDcyLjk4ODQgNDUuOTc2OCA3MS40NTU2IDQ2LjUyNjcgNjkuOTIyOVpNODMuNjc2MSA0Mi41Nzk0QzgzLjY3NjEgNDYuMTcwNCA4MS41NTc1IDQ3Ljk2NTggNzkuMTg3NSA0Ny45NjU4Qzc2Ljc4MTYgNDcuOTY1OCA3NC42OTg5IDQ2LjE3MDQgNzQuNjk4OSA0Mi41Nzk0Qzc0LjY5ODkgMzguOTg4NSA3Ni43ODE2IDM3LjE5MzEgNzkuMTg3NSAzNy4xOTMxQzgxLjU1NzUgMzcuMTkzMSA4My42NzYxIDM4Ljk4ODUgODMuNjc2MSA0Mi41Nzk0Wk03MC4yMTAzIDQyLjU3OTVDNzAuMjEwMyA0Ni4xNzA0IDY4LjA5MTYgNDcuOTY1OCA2NS43MjE2IDQ3Ljk2NThDNjMuMzE1NyA0Ny45NjU4IDYxLjIzMyA0Ni4xNzA0IDYxLjIzMyA0Mi41Nzk1QzYxLjIzMyAzOC45ODg1IDYzLjMxNTcgMzcuMTkzMSA2NS43MjE2IDM3LjE5MzFDNjguMDkxNiAzNy4xOTMxIDcwLjIxMDMgMzguOTg4NSA3MC4yMTAzIDQyLjU3OTVaIiBmaWxsPSIjRkZGREY4Ii8+Cjwvc3ZnPgo="}
                                                        fill
                                                        decoding="async"
                                                        data-nimg="fill"
                                                        style={{ position: 'absolute', height: '100%', width: '100%', inset: '0px', color: 'transparent' }}
                                                    />
                                                </div>
                                                <p className="chakra-text css-1y7jpv5">{wallet.adapter.name}</p>
                                            </div>
                                            {wallet.readyState === 'Installed' && (
                                                <p className="chakra-text css-1vjfpga">Detected</p>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                    <div data-focus-guard="true" tabIndex={0}
                        style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px', }}
                        data-aria-hidden="true" aria-hidden="true"></div>
                </div>
            )}
        </div>
    );
};

export default CustomWalletButton;

