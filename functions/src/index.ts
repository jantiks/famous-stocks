/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions/v2";
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
    });
  });

  interface Politician {
    firstName: string;
    lastName: string;
    createdAt: number;
  }

  interface SubscribeRequestData {
    firstName: string;
    lastName: string;
  }

  interface UserData {
    notifications: Politician[];
  }

exports.subscribeForNotifications = functions.https.onCall(async (request: functions.https.CallableRequest<SubscribeRequestData>) => {
  const userId = request.auth?.uid;
  if (!userId) {
    throw new functions.https.HttpsError("unauthenticated", "Missing authorization");
  }

  const {firstName, lastName} = request.data;

  if (!firstName || !lastName) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
  }

  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  const politicianData: Politician = {
    firstName,
    lastName,
    createdAt: Date.now(),
  };

  if (userDoc.exists) {
    const userData = userDoc.data() as UserData;
    const notifications = userData.notifications || [];

    const isAlreadySubscribed = notifications.some(
      (politician) => politician.firstName === firstName && politician.lastName === lastName
    );

    if (isAlreadySubscribed) {
      throw new functions.https.HttpsError("already-exists", `You are already subscribed to ${firstName} ${lastName}`);
    }

    notifications.push(politicianData);
    await userRef.update({notifications});
  } else {
    await userRef.set({notifications: [politicianData]});
  }

  return {success: true};
});

export const getNotifications = functions.https.onCall(async (request: functions.https.CallableRequest<unknown>) => {
  const userId = request.auth?.uid;
  if (!userId) {
    throw new functions.https.HttpsError("unauthenticated", "Missing authorization");
  }

  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new functions.https.HttpsError("not-found", "User data not found");
  }

  const userData = userDoc.data() as UserData;
  const notifications = userData.notifications || [];

  return {notifications};
});

export const deleteNotification = functions.https.onCall(async (request: functions.https.CallableRequest<SubscribeRequestData>) => {
  const userId = request.auth?.uid;
  if (!userId) {
    throw new functions.https.HttpsError("unauthenticated", "Missing authorization");
  }

  const {firstName, lastName} = request.data;

  if (!firstName || !lastName) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields");
  }

  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const userData = userDoc.data() as UserData;
    let notifications = userData.notifications || [];

    notifications = notifications.filter((item) => !(item.firstName === firstName && item.lastName === lastName));

    await userRef.update({notifications});
  } else {
    throw new functions.https.HttpsError("not-found", "Politician not in the list");
  }

  return {success: true};
});
