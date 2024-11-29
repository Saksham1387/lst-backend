import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TOKEN_2022_PROGRAM_ID,
  mintTo,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { PRIVATE_KEY, TOKEN_MINT_ADDRESS } from "./address";

const connection = new Connection("https://api.devnet.solana.com");

function base58ToKeypair(base58PrivateKey: string): Keypair {
  try {
    const privateKeyBuffer = bs58.decode(base58PrivateKey);
    return Keypair.fromSecretKey(privateKeyBuffer);
  } catch (error) {
    throw new Error("Invalid base58 private key.");
  }
}

const keypair = base58ToKeypair(PRIVATE_KEY!);

export const mintTokens = async (toAddress: string, amount: number) => {
  await real_mintTokens(
    connection,
    keypair,
    new PublicKey(TOKEN_MINT_ADDRESS),
    new PublicKey(toAddress),
    amount
  );
};

const real_mintTokens = async (
  connection: Connection,
  payer: Keypair,
  mintAddress: PublicKey,
  recipientAddress: PublicKey,
  amount: number
) => {
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintAddress,
    recipientAddress
  );
  console.log("minting to: ",recipientTokenAccount.address)

  await mintTo(
    connection,
    payer,
    mintAddress,
    recipientTokenAccount.address,
    payer.publicKey,
    amount
  );

  console.log(`Minted ${amount} tokens to ${recipientAddress.toString()}`);
};



















export const burnTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  console.log("Burning tokens");
};

export const sendNativeTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
) => {
  console.log("Sending native tokens");
};
