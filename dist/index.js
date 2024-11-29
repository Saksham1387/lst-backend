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
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mintTokens_1 = require("./mintTokens");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const VAULT = "6bEWYx8e7KgLHDGg65xfThZeDTBjZjFepnQvVmo6deBi";
const processedTransactions = new Set();
app.post('/helius', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    const firstTransaction = requestBody[0];
    const nativeTransfers = firstTransaction.nativeTransfers;
    // The custom token is higher priced
    const amount = nativeTransfers[0].amount * 2;
    const toAddress = nativeTransfers[0].fromUserAccount;
    const signature = firstTransaction.signature;
    console.log("amount: ", amount);
    console.log("minting to: ", toAddress);
    console.log("signature: ", signature);
    console.log("------------------");
    // Check if the transaction has already been processed
    if (processedTransactions.has(signature)) {
        console.log("Transaction already processed:", signature);
        res.status(200).send('Duplicate transaction, skipped minting.');
        return;
    }
    processedTransactions.add(signature);
    const type = "received_native_sol";
    if (type === "received_native_sol") {
        try {
            yield (0, mintTokens_1.mintTokens)(toAddress, amount);
            console.log("Minting successful for:", toAddress);
        }
        catch (error) {
            console.error("Minting failed:", error);
            res.status(500).send('Minting failed.');
            return;
        }
    }
    res.status(200).send('Transaction successful');
}));
app.post('/healthy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send('The backend is healthy');
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
