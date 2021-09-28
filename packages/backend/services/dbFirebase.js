const firebaseAdmin = require("firebase-admin");
// TODO use an env var for this
const firebaseServiceAccount = require("../firebaseServiceAccountKey.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseServiceAccount),
});
// Docs: https://firebase.google.com/docs/firestore/quickstart#node.js_1
const database = firebaseAdmin.firestore();

const getUserDoc = id => database.collection("users").doc(id);
const getUserSnapshotById = id => getUserDoc(id).get();

const createUser = (userId, userData) => {
  const userDoc = getUserDoc(userId);
  return userDoc.set(userData);
};

const updateUser = (userId, userData) => {
  const userDoc = getUserDoc(userId);
  return userDoc.update(userData);
};

const userExists = async address => {
  const snapshot = await getUserSnapshotById(address);
  return snapshot.exists;
};

const findAllUsers = async () => {
  const buildersSnapshot = await database.collection("users").get();
  return buildersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const findUserByAddress = async builderAddress => {
  const builderSnapshot = await getUserSnapshotById(builderAddress);
  if (!builderSnapshot.exists) {
    return { exists: false };
  }
  return { exists: true, data: { id: builderSnapshot.id, ...builderSnapshot.data() } };
};

module.exports = {
  createUser,
  updateUser,
  findAllUsers,
  findUserByAddress,
  userExists,
};
