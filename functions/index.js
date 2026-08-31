/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/* eslint-disable max-len */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {getFirestore} = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");

admin.initializeApp();
const db = getFirestore();

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

exports.admissionsStatus = onRequest({cors: true}, async (request, response) => {
  if (request.method !== "POST") {
    return response.status(405).json({error: "Method not allowed."});
  }

  const reference = typeof request.body?.reference === "string" ? request.body.reference.trim().toUpperCase() : "";
  const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : "";
  if (!/^DKE-2026-[A-Z0-9]{6}$/.test(reference) || !email || email.length > 160) {
    return response.status(400).json({error: "Enter a valid application reference and email address."});
  }

  try {
    const snapshot = await db.collection("admissionApplications")
        .where("applicationReference", "==", reference)
        .limit(1)
        .get();
    const matchingDoc = snapshot.docs.find((item) => (item.data().email || "").trim().toLowerCase() === email);
    if (!matchingDoc) return response.status(404).json({error: "No matching application was found."});

    const data = matchingDoc.data();
    return response.json({reference, status: data.status || "new", programme: data.program || "", studentName: data.studentName || ""});
  } catch (error) {
    logger.error("Admission status lookup failed", error);
    return response.status(500).json({error: "Status lookup is temporarily unavailable."});
  }
});

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
