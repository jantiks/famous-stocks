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
const db = admin.firestore();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

exports.getTransactions = onRequest({cors: true},
  async (req, res) => {
    cors()(req, res, async () => {
      try {
        const {firstName, lastName, ticker} = req.body.data;
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

        let filteredTransactions = transactions;

        if (firstName && (firstName as string).length > 0) {
          filteredTransactions = filteredTransactions.filter( (transaction: any) =>
            transaction.politician.firstName.toLowerCase().includes((firstName as string).toLowerCase())
          );
        }

        if (lastName && (lastName as string).length > 0) {
          filteredTransactions = filteredTransactions.filter( (transaction: any) =>
            transaction.politician.lastName.toLowerCase().includes((lastName as string).toLowerCase())
          );
        }

        if (ticker && (ticker as string).length > 0) {
          filteredTransactions = filteredTransactions.filter((transaction: any) => {
            return transaction.stockTicker.toLowerCase().includes((ticker as string).toLowerCase());
          });
        }

        res.status(200).json({data: filteredTransactions});
      } catch (error) {
        console.error("Error fetching or processing data:", error);
        res.status(500).send("Error fetching or processing data");
      }
    });
  });

  interface RequestBody {
    data: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }

  interface Politician {
    firstName: string;
    lastName: string;
    createdAt: number;
  }

  interface UserData {
    politicians: Politician[];
  }

exports.subscribeForNotifications = onRequest((req, res) => {
  cors()(req, res, async () => {
    try {
      console.log(req.body.data);
      const {firstName, lastName, email}: RequestBody["data"] = req.body.data;

      if (!firstName || !lastName || !email) {
        return res.status(400).json({error: "Missing required fields"});
      }

      const userRef = db.collection("subscriptions").doc(email);
      const userDoc = await userRef.get();

      const politicianData: Politician = {
        firstName,
        lastName,
        createdAt: Date.now(),
      };

      if (userDoc.exists) {
        const userData = userDoc.data() as UserData;
        const politicians = userData.politicians || [];

        const isAlreadySubscribed = politicians.some(
          (politician) => politician.firstName === firstName && politician.lastName === lastName
        );

        if (isAlreadySubscribed) {
          return res.status(409).send(`You are already subscribed to ${firstName} ${lastName}`);
        }
        politicians.push(politicianData);
        await userRef.update({
          politicians: politicians,
        });
      } else {
        await userRef.set({
          politicians: [politicianData],
        });
      }

      return res.status(200).json({data: {success: true}});
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      return res.status(500).send("Error fetching or processing data");
    }
  });
});
