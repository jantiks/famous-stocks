/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import admin = require("firebase-admin");
// import {getFirestore} from "firebase-admin/firestore";
import {v4 as uuidv4} from "uuid";
import cors = require("cors");

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

exports.getTransactions = onRequest({cors: true},
  async (req, res) => {
  //   res.set('Access-Control-Allow-Origin', '*');
    // res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    // res.set('Access-Control-Allow-Headers', 'Content-Type');

    // if (req.method === 'OPTIONS') {
    //   res.status(204).send('');
    //   return;
    // }

    cors()(req, res, async () => {
      try {
        const bucket = admin.storage().bucket();
        const file = bucket.file("trades_20240726.json");
        const [contents] = await file.download();
        const jsonData = JSON.parse(contents.toString());

        const transactions = jsonData.map((item: {
        ticker: string;
        asset_name: string;
        order_type: string;
        tx_amount: string;
        tx_date: string;
        file_date: string;
        first_name: string;
        last_name: string;
      }) => ({
          id: uuidv4(),
          stockTicker: item.ticker,
          stock: item.asset_name,
          action: item.order_type,
          amount: item.tx_amount,
          currency: "USD",
          traded: new Date(item.tx_date),
          filed: new Date(item.file_date),
          politician: {
            firstName: item.first_name,
            lastName: item.last_name,
            party: "",
            state: "",
          },
        }));

        res.status(200).json({data: transactions});
      } catch (error) {
        console.error("Error fetching or processing data:", error);
        res.status(500).send("Error fetching or processing data");
      }
    });
  });
