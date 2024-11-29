"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNativeTokens = exports.burnTokens = exports.mintTokens = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const address_1 = require("./address");
const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
function base58ToKeypair(base58PrivateKey) {
    try {
        const privateKeyBuffer = bs58_1.default.decode(base58PrivateKey);
        return web3_js_1.Keypair.fromSecretKey(privateKeyBuffer);
    }
    catch (error) {
        throw new Error("Invalid base58 private key.");
    }
}
const keypair = base58ToKeypair(address_1.PRIVATE_KEY);
const mintTokens = (toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    yield real_mintTokens(connection, keypair, new web3_js_1.PublicKey(address_1.TOKEN_MINT_ADDRESS), new web3_js_1.PublicKey(toAddress), amount);
});
exports.mintTokens = mintTokens;
const real_mintTokens = (connection, payer, mintAddress, recipientAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const recipientTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(connection, payer, mintAddress, recipientAddress);
    console.log("minting to: ", recipientTokenAccount.address);
    yield (0, spl_token_1.mintTo)(connection, payer, mintAddress, recipientTokenAccount.address, payer.publicKey, amount);
    console.log(`Minted ${amount} tokens to ${recipientAddress.toString()}`);
});
const burnTokens = (fromAddress, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Burning tokens");
});
exports.burnTokens = burnTokens;
const sendNativeTokens = (fromAddress, toAddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Sending native tokens");
});
exports.sendNativeTokens = sendNativeTokens;
