'use client';

import localFont from "next/font/local";
import "./globals.css";
import "./special.css";
import "./roots.css";
import "./appy.css";
import Image from "next/image";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState, createContext, useContext, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { WalletConnectionProvider } from '@/contexts/WalletConnectionProvider';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';



// Create Modal Context
const ModalContext = createContext<{
  isModalOpen: boolean;
  isWalletListOpen: boolean;
  isClaimOpen: boolean;
  openModal: () => void;
  openClaim: () => void;
  closeClaim: () => void;
  closeModal: () => void;
  openWalletList: () => void;
  backToMain: () => void;
}>({
  isModalOpen: false,
  isWalletListOpen: false,
  isClaimOpen: false,
  openModal: () => { },
  openClaim: () => { },
  closeClaim: () => { },
  closeModal: () => { },
  openWalletList: () => { },
  backToMain: () => { },
});

export const useModal = () => useContext(ModalContext);


function WalletSelectionModal() {
  const { isModalOpen, isWalletListOpen, openClaim, closeModal, backToMain } = useModal();
  const { wallets, select, connecting } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');

  const handleWalletSelect = async (walletName: string) => {
    console.log("hello from handleWalletSelect", walletName);
    try {
      const selectedWallet = wallets.find((w) => w.adapter.name === walletName);
      if (selectedWallet) {
        select(selectedWallet.adapter.name);
        await selectedWallet.adapter.connect();
        // Wait a bit for connection

        setTimeout(() => {
          if (selectedWallet.adapter.connected) {
            
            closeModal();
            openClaim();
          }
        }, 500);

      }
    
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };



  if (!isModalOpen) return null;

  return (
    <div id="dynamic-modal" className="dynamic-modal" data-testid="dynamic-modal" style={{ pointerEvents: 'auto' }}>
      <div data-testid="dynamic-modal-shadow" className="dynamic-shadow-dom" style={{ zIndex: 2147483645 }}>
        <div className="dynamic-shadow-dom-content">
          <div style={{ transition: 'opacity 100ms linear', opacity: 1 }}>
            <div data-focus-guard="true" tabIndex={0} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
            <div data-focus-lock-disabled="false" className="modal-component__container">
              <div
                data-testid="portal-backdrop"
                role="button"
                tabIndex={0}
                aria-label="Close modal"
                className="modal-component__backdrop"
                onClick={closeModal}
              ></div>
              <div>
                <div style={{ position: 'relative' }}>
                  <div className="modal">
                    <div style={{ transition: 'opacity 100ms linear', opacity: 1 }}>
                      <div className="modal__items">
                        <div data-testid="dynamic-auth-modal" className="modal-card modal-card--sharp-mobile-bottom-radius modal-card--radius-default">

                          {!isWalletListOpen ? (
                            // Main login view
                            <div className="vertical-accordion__container" data-dynamic-view="login-with-email-or-wallet">
                              <div className="accordion-item accordion-item--full-height" style={{ maxHeight: '463.594px' }}>
                                <div data-testid="accordion-item-curtain" className="accordion-item__curtain"></div>
                                <div>
                                  <div className="layout-header">
                                    <div className="modal-header modal-header--border">
                                      <div className="modal-header__content modal-header__content--align-content-bottom">
                                        <div className="modal-header__content__leading modal-header__content__leading--empty"></div>
                                        <h1 className="typography typography--title  typography--primary  layout-header__typography" data-testid="dynamic-auth-modal-heading">Log in or sign up</h1>
                                        <div className="modal-header__content__trailing">
                                          <button
                                            type="button"
                                            id="close-button"
                                            data-testid="close-button"
                                            className="icon-button layout-header__icon"
                                            onClick={closeModal}
                                          >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path fillRule="evenodd" clipRule="evenodd" d="M4.41 4.41a.833.833 0 0 1 1.18 0L10 8.822l4.41-4.41a.833.833 0 1 1 1.18 1.178L11.178 10l4.41 4.41a.833.833 0 1 1-1.178 1.18L10 11.177 5.588 15.59a.833.833 0 1 1-1.178-1.178L8.82 10l-4.41-4.41a.833.833 0 0 1 0-1.18Z" fill="currentColor"></path>
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <MainLoginView />
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Wallet selection view
                            <div className="vertical-accordion__container" data-dynamic-view="login-with-email-or-wallet-full-wallet-list">
                              <div className="accordion-item accordion-item--full-height" style={{ maxHeight: '459.062px' }}>
                                <div data-testid="accordion-item-curtain" className="accordion-item__curtain"></div>
                                <div>
                                  <div className="layout-header">
                                    <div className="modal-header">
                                      <div className="modal-header__content modal-header__content--align-content-bottom">
                                        <div className="modal-header__content__leading">
                                          <button
                                            type="button"
                                            data-testid="back-button"
                                            className="icon-button layout-header__icon"
                                            onClick={backToMain}
                                          >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path fillRule="evenodd" clipRule="evenodd" d="M10.707 4.293a1 1 0 0 1 0 1.414L5.414 11H21a1 1 0 1 1 0 2H5.414l5.293 5.293a1 1 0 0 1-1.414 1.414l-7-7a1 1 0 0 1 0-1.414l7-7a1 1 0 0 1 1.414 0Z" fill="currentColor"></path>
                                            </svg>
                                          </button>
                                        </div>
                                        <h1 className="typography typography--title  typography--primary  layout-header__typography" data-testid="dynamic-auth-modal-heading">Select your wallet</h1>
                                        <div className="modal-header__content__trailing">
                                          <button
                                            type="button"
                                            data-testid="close-button"
                                            className="icon-button layout-header__icon"
                                            onClick={closeModal}
                                          >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                              <path fillRule="evenodd" clipRule="evenodd" d="M4.41 4.41a.833.833 0 0 1 1.18 0L10 8.822l4.41-4.41a.833.833 0 1 1 1.18 1.178L11.178 10l4.41 4.41a.833.833 0 1 1-1.178 1.18L10 11.177 5.588 15.59a.833.833 0 1 1-1.178-1.178L8.82 10l-4.41-4.41a.833.833 0 0 1 0-1.18Z" fill="currentColor"></path>
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="wallet-list__search-container wallet-list__search-container--scroll">
                                    <label className="search__container">
                                      <div className="search-icon__container">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path fillRule="evenodd" clipRule="evenodd" d="M6.667 2.667a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-5.333 4a5.333 5.333 0 1 1 9.546 3.27l3.592 3.592a.667.667 0 0 1-.943.942L9.937 10.88a5.333 5.333 0 0 1-8.604-4.213Z" fill="currentColor"></path>
                                        </svg>
                                      </div>
                                      <input
                                        placeholder="Search wallets..."
                                        className="search__input"
                                        data-testid="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                      />
                                    </label>
                                  </div>

                                  <div className="wallet-list__scroll-container" data-testid="wallet-list-scroll-container">
                                    {wallets.map((wallet) => (
                                      <button
                                        key={wallet.adapter.name}
                                        data-testid="ListTile"
                                        type="button"
                                        className="wallet-list-item__tile list-tile"
                                        onClick={() => handleWalletSelect(wallet.adapter.name)}
                                        disabled={connecting}
                                      >
                                        <Image
                                          data-testid={`wallet-icon-${wallet.adapter}`}
                                          className="wallet-list-item__leading"
                                          alt={`${wallet.adapter.name} logo`}
                                          src={wallet.adapter.icon || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4IiBoZWlnaHQ9IjEwOCIgdmlld0JveD0iMCAwIDEwOCAxMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDgiIGhlaWdodD0iMTA4IiByeD0iMjYiIGZpbGw9IiNBQjlGRjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik00Ni41MjY3IDY5LjkyMjlDNDIuMDA1NCA3Ni44NTA5IDM0LjQyOTIgODUuNjE4MiAyNC4zNDggODUuNjE4MkMxOS41ODI0IDg1LjYxODIgMTUgODMuNjU2MyAxNSA3NS4xMzQyQzE1IDUzLjQzMDUgNDQuNjMyNiAxOS44MzI3IDcyLjEyNjggMTkuODMyN0M4Ny43NjggMTkuODMyNyA5NCAzMC42ODQ2IDk0IDQzLjAwNzlDOTQgNTguODI1OCA4My43MzU1IDc2LjkxMjIgNzMuNTMyMSA3Ni45MTIyQzcwLjI5MzkgNzYuOTEyMiA2OC43MDUzIDc1LjEzNDIgNjguNzA1MyA3Mi4zMTRDNjguNzA1MyA3MS41NzgzIDY4LjgyNzUgNzAuNzgxMiA2OS4wNzE5IDY5LjkyMjlDNjUuNTg5MyA3NS44Njk5IDU4Ljg2ODUgODEuMzg3OCA1Mi41NzU0IDgxLjM4NzhDNDcuOTkzIDgxLjM4NzggNDUuNjcxMyA3OC41MDYzIDQ1LjY3MTMgNzQuNDU5OEM0NS42NzEzIDcyLjk4ODQgNDUuOTc2OCA3MS40NTU2IDQ2LjUyNjcgNjkuOTIyOVpNODMuNjc2MSA0Mi41Nzk0QzgzLjY3NjEgNDYuMTcwNCA4MS41NTc1IDQ3Ljk2NTggNzkuMTg3NSA0Ny45NjU4Qzc2Ljc4MTYgNDcuOTY1OCA3NC42OTg5IDQ2LjE3MDQgNzQuNjk4OSA0Mi41Nzk0Qzc0LjY5ODkgMzguOTg4NSA3Ni43ODE2IDM3LjE5MzEgNzkuMTg3NSAzNy4xOTMxQzgxLjU1NzUgMzcuMTkzMSA4My42NzYxIDM4Ljk4ODUgODMuNjc2MSA0Mi41Nzk0Wk03MC4yMTAzIDQyLjU3OTVDNzAuMjEwMyA0Ni4xNzA0IDY4LjA5MTYgNDcuOTY1OCA2NS43MjE2IDQ3Ljk2NThDNjMuMzE1NyA0Ny45NjU4IDYxLjIzMyA0Ni4xNzA0IDYxLjIzMyA0Mi41Nzk1QzYxLjIzMyAzOC45ODg1IDYzLjMxNTcgMzcuMTkzMSA2NS43MjE2IDM3LjE5MzFDNjguMDkxNiAzNy4xOTMxIDcwLjIxMDMgMzguOTg4NSA3MC4yMTAzIDQyLjU3OTVaIiBmaWxsPSIjRkZGREY4Ii8+Cjwvc3ZnPgo="}
                                          width={28}
                                          height={28}
                                          style={{ height: '1.75rem', width: '1.75rem' }}
                                        />
                                        <div className="list-tile__children">
                                          <span className="typography typography--body-normal typography--medium typography--primary">
                                            {wallet.adapter.name}
                                          </span>
                                        </div>
                                        <div>
                                          <div className="list-tile-animated-trailing">
                                            <div className="list-tile-animated-trailing__child"></div>
                                            <div className="list-tile-animated-trailing__hover-element">
                                              {connecting ? (
                                                <div className="spinner" style={{ width: '24px', height: '24px' }}>⟳</div>
                                              ) : (
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon--color-text-tertiary icon--size-mini">
                                                  <path fillRule="evenodd" clipRule="evenodd" d="M8.293 19.707a1 1 0 0 1 0-1.414L14.586 12 8.293 5.707a1 1 0 0 1 1.414-1.414l7 7a1 1 0 0 1 0 1.414l-7 7a1 1 0 0 1-1.414 0Z" fill="currentColor"></path>
                                                </svg>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>

                                  <ModalFooter />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-focus-guard="true" tabIndex={0} style={{ width: '1px', height: '0px', padding: '0px', overflow: 'hidden', position: 'fixed', top: '1px', left: '1px' }}></div>
          </div>
        </div>
      </div>
      <div data-testid="dynamic-modal-shadow" className="dynamic-shadow-dom" style={{ zIndex: 2147483643 }}></div>
    </div>
  );
}

function MainLoginView() {
  const { openWalletList } = useModal();

  return (
    <div className="login-view__container">
      <div className="login-view__scroll" data-testid="login-view-scroll">
        <div className="login-view__scroll__section login-view__scroll__section--email">
          <form className="login-with-email-form" data-testid="email-form">
            <div className="input__container input__container--dense">
              <input
                autoComplete="email"
                id="email_field"
                placeholder="Enter your email"
                className="input"
                type="email"
                defaultValue=""
              />
              <label htmlFor="email_field" className="input__label">Enter your email</label>
              <div className="input__suffix"></div>
            </div>
            <button
              type="submit"
              className="button button--expanded button--padding-login-screen-height button--brand-primary login-with-email-form__button"
              disabled={true}
              data-testid="submit_button"
              aria-expanded="true"
            >
              <div className="typography-button__content">
                <span className="typography typography--button-primary  typography--tertiary">Continue</span>
              </div>
            </button>
          </form>
        </div>

        <div className="login-view__scroll__section login-view__scroll__section--separator">
          <div className="divider">
            <div className="divider__dash"></div>
            <p className="typography typography--body-small  typography--secondary  divider__text">OR</p>
            <div className="divider__dash"></div>
          </div>
        </div>

        <div className="login-view__scroll__section login-view__scroll__section--social">
          <div className="social-sign-in" data-testid="dynamic-social-sign-in">
            <button
              data-testid="inline-google"
              type="button"
              className="social-sign-in--tile social-sign-in--tile__full-width icon-list-tile list-tile"
            >
              <div className="list-tile__children">
                <span className="typography typography--body-normal typography--medium typography--primary">
                  <div className="icon-list-tile--children">
                    <div className="icon-with-spinner__container" style={{ height: '2rem', width: '2rem' }}>
                      <div className="icon-with-spinner__icon-container" style={{ height: '1.27273rem', width: '1.27273rem' }}>

                        <img data-testid="iconic-google" alt="Google" src="https://iconic.dynamic-static-assets.com/icons/sprite.svg#google" />
                      </div>
                    </div>
                    <p className="typography typography--button-primary  typography--primary">Continue with Google</p>
                  </div>
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="login-view__scroll__section login-view__scroll__section--separator">
          <div className="divider">
            <div className="divider__dash"></div>
            <p className="typography typography--body-small  typography--secondary  divider__text">OR</p>
            <div className="divider__dash"></div>
          </div>
        </div>

        <div className="login-view__scroll__section login-view__scroll__section--wallet">
          <button
            type="button"
            className="connect-with-wallet-button icon-list-tile list-tile"
            onClick={openWalletList}
          >
            <div className="list-tile__children">
              <span className="typography typography--body-normal typography--medium typography--primary">
                <div className="icon-list-tile--children">
                  <p className="typography typography--button-primary  typography--primary">Continue with a wallet</p>
                </div>
              </span>
            </div>
          </button>
        </div>
      </div>

      <ModalFooter />
    </div>
  );
}

function ModalFooter() {
  return (
    <>
      <div className="tos-and-pp__footer">
        <p className="typography typography--body-small typography--regular typography--primary  tos-and-pp__text" id="custom-tos-and-pp-footer-start" data-testid="custom-tos-and-pp-footer-start"></p>
        <p className="typography typography--body-small typography--regular typography--primary  tos-and-pp__text">
          By logging in, you agree to<br />
          our&nbsp;
          <a className="tos-and-pp__link" href="https://doodles.app/terms" target="_blank" rel="noreferrer">Terms of Service</a>
          &nbsp;&amp;&nbsp;
          <a className="tos-and-pp__link" href="https://doodles.app/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>.
        </p>
        <p className="typography typography--body-small typography--regular typography--primary  tos-and-pp__text" id="custom-tos-and-pp-footer-end" data-testid="custom-tos-and-pp-footer-end"></p>
      </div>
      <div data-testid="dynamic-footer" className="dynamic-footer">
        <a target="_blank" href="https://dynamic.xyz" className="powered-by-dynamic powered-by-dynamic--center" rel="noreferrer">
          <span className="typography typography--body-mini typography--regular typography--tertiary  powered-by-dynamic__text">Powered by</span>
          <svg fill="none" viewBox="0 0 114 21" xmlns="http://www.w3.org/2000/svg" className="powered-by-dynamic__logo">
            <g clipPath="url(#dynamic-logo_svg__a)" fill="currentColor">
              <path d="M10.053 2.002c-.43.4"></path>
            </g>
            <defs>
              <clipPath id="dynamic-logo_svg__a">
                <path transform="translate(0 .5)" fill="#fff" d="M0 0h113.61v20H0z"></path>
              </clipPath>
            </defs>
          </svg>
        </a>
      </div>
    </>
  );
}



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [isWalletListOpen, setIsWalletListOpen] = useState(false);
  const { connected, disconnect, publicKey } = useWallet();

  // Fix 2: Debug logging - Add this to see what's happening
  console.log('Debug:', { connected, publicKey: publicKey?.toString(), isClaimOpen });

  const openModal = () => {
    setIsModalOpen(true);
    setIsWalletListOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsWalletListOpen(false);
  };

  // Fix 3: Actually close the claim modal
  const closeClaim = () => {
     if (connected && disconnect) {
      disconnect();
    }
    setIsClaimOpen(false);
    setIsModalOpen(false);
    setIsWalletListOpen(false);
  };

  const openClaim = () => {
    setIsClaimOpen(true);
    setIsModalOpen(false);
    setIsWalletListOpen(false);
  };

  const openWalletList = () => {
    setIsWalletListOpen(true);
  };

  const backToMain = () => {
    setIsWalletListOpen(false);
  };

  return (
    <AuthProvider>
      <ModalContext.Provider value={{
        isModalOpen,
        isWalletListOpen,
        isClaimOpen,
        openClaim,
        openModal,
        closeModal,
        openWalletList,
        closeClaim,
        backToMain
      }}>
        <WalletConnectionProvider network={WalletAdapterNetwork.Devnet}>
          <html lang="en">
            <body
              className={`funneldisplay_1580b75f-module__7u7IKG__className bg-black text-white`}
            >
              <div data-theme="default">
                <div></div>
                <div id="modal"></div>
                <div className="max-h-screen-safe selection:bg-[#0ad775] safari:bg-black min-h-screen bg-black">
                  <div className="mx-auto w-full max-w-[1728px]">
                    {/* Fix 4: Better conditional rendering */}
                    {children}
                  </div>
                  <div className="dynamic-shadow-dom" style={{ zIndex: 2147483643 }}></div>
                </div>
              </div>
              <WalletSelectionModal />
            </body>
          </html>
        </WalletConnectionProvider>
      </ModalContext.Provider>
    </AuthProvider>
  );
}