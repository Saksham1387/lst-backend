require("dotenv").config();
import express from "express";
import { burnTokens, mintTokens, sendNativeTokens } from "./mintTokens";

const app = express();
app.use(express.json());
const VAULT = "6bEWYx8e7KgLHDGg65xfThZeDTBjZjFepnQvVmo6deBi";
const processedTransactions = new Set();

app.post('/helius', async (req, res) => {
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
        return res.status(200).send('Duplicate transaction, skipped minting.');
    }

    processedTransactions.add(signature);

    const type = "received_native_sol";

    if (type === "received_native_sol") {
        try {
            await mintTokens(toAddress, amount);
            console.log("Minting successful for:", toAddress);
        } catch (error) {
            console.error("Minting failed:", error);
            return res.status(500).send('Minting failed.');
        }
    }
    res.status(200).send('Transaction successful');
});


app.post('/healthy', async (req, res) => {
    res.status(200).send('The backend is healthy');
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
