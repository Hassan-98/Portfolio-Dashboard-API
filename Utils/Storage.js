const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const serviceAccount = require("../Services/service-account.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${process.env.STORAGE_BUCKET}.appspot.com`
});

module.exports = getStorage().bucket();
