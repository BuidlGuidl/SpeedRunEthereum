require("dotenv").config();
const firebaseAdmin = require("firebase-admin");

console.log("using firebase");
if (process.env.NODE_ENV === "test") {
  // We won't be using firebase for testing for now. At some point,
  // we might want to run tests against the Staging firebase instance.
  throw new Error(
    `This will connect to the production firestore. Make sure dbFirebase.js is updated before testing against Firebase`,
  );
}

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
  });
} else {
  firebaseAdmin.initializeApp();
}

// Docs: https://firebase.google.com/docs/firestore/quickstart#node.js_1
const database = firebaseAdmin.firestore();

// --- Users
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

// --- Events
const createEvent = event => {
  return database.collection("events").add(event);
};

const findAllEvents = async ({ limit } = {}) => {
  let queryChain = database.collection("events");

  if (limit) {
    queryChain = queryChain.limit(Number(limit));
  }

  // Seems like a good default for now.
  queryChain = queryChain.orderBy("timestamp", "desc");

  const eventsSnapshot = await queryChain.get();
  return eventsSnapshot.docs.map(doc => doc.data());
};

const findEventsWhere = async ({ conditions: conditionsArg, limit } = {}) => {
  let conditionChain = database.collection("events");
  Object.entries(conditionsArg).forEach(([prop, values]) => {
    const valuesArray = values.split(",");
    const propName = prop.replace("/", ".");

    if (valuesArray.length > 1) {
      conditionChain = conditionChain.where(propName, "in", valuesArray);
    } else {
      conditionChain = conditionChain.where(propName, "==", values);
    }
  });

  if (limit) {
    conditionChain = conditionChain.limit(Number(limit));
  }

  const eventsSnapshot = await conditionChain.get();
  return eventsSnapshot.docs.map(doc => doc.data());
};

const createBuild = build => {
  return database.collection("builds").add(build);
};

const findAllBuilds = async (isDraft = false) => {
  const buildsSnapshot = await database.collection("builds").get();
  const allBuilds = buildsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  if (isDraft) {
    return allBuilds.filter(build => build.isDraft);
  }

  return allBuilds;
};

const publishBuild = buildId => {
  const buildRef = database.collection("builds").doc(buildId);
  return buildRef.update({ isDraft: null });
};

const removeBuild = buildId => {
  return database.collection("builds").doc(buildId).delete();
};

module.exports = {
  createUser,
  updateUser,
  findAllUsers,
  findUserByAddress,
  createEvent,
  findAllEvents,
  findEventsWhere,
  createBuild,
  findAllBuilds,
  publishBuild,
  removeBuild,
};
