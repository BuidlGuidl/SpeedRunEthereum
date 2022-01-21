require("dotenv").config();

const DB_SERVICES = {
  firebase: "./dbFirebase",
  local: "./dbLocal",
};

// we should probably make a distinction: service could be firebase-staging, firebase, etc.
// This is more "implementation" which is only firebase or local
const isTesting = process.env.NODE_ENV === "test";
const selectedService = isTesting ? "local" : process.env.DATABASE_SERVICE ?? "local";
const dbService = DB_SERVICES[selectedService] ?? DB_SERVICES.local;
// eslint-disable-next-line import/no-dynamic-require
const db = require(dbService);

// --- Users

/**
 *
 * @param {Address} userAddress The user's address
 * @param {object} userData The user's payload
 */
const createUser = db.createUser;

/**
 *
 * @param {Address} userAddress The user's address
 * @param {object} userData The user's payload
 */
const updateUser = db.updateUser;

/**
 *
 * @returns {{id: string, challenges?: object, role?: string}[]}
 */
const findAllUsers = db.findAllUsers;

/**
 *
 * @param {Address} builderAddress
 * @returns {{
 *  exists: boolean,
 *  data?: {
 *    id: string,
 *    role?: string
 *  }
 * }}
 */
const findUserByAddress = db.findUserByAddress;

// --- Events
/**
 *
 * @param {Event} event The event to create (see createEvent in utils/events.js)
 */
const createEvent = db.createEvent;

/**
 *
 * @param {number} limitArg The max number of events to retrieve
 * @returns {Event[]} (see createEvent in utils/events.js)
 */
const findAllEvents = db.findAllEvents;

/**
 *
 * @param {*} conditionsArg Select filter for the events
 * @param {number} limit The max number of events to retrieve
 * @returns {Event[]} (see createEvent in utils/events.js)
 */
const findEventsWhere = db.findEventsWhere;

/**
 *
 * @param {object} buildData The build payload
 * @returns {object} stored build data, including the id
 */
const createBuild = db.createBuild;

/**
 * @param {boolean} isDraft
 * @returns {{name: string, desc: string, branch: string, readMore: string,
 *   image: string}[]}
 */
const findAllBuilds = db.findAllBuilds;

/**
 *
 * @param {string} buildId
 */
const publishBuild = db.publishBuild;

/**
 *
 * @param {string} buildId
 */
const removeBuild = db.removeBuild;

// Shared by implementations.
// ToDo: This is very inefficient,´. We fetch the whole database every time we call this.
// We should create a getChallengesByStatus function that fetches the challenges by status.
// https://github.com/moonshotcollective/scaffold-directory/pull/32#discussion_r711971355
const getAllChallenges = async () => {
  // const usersDocs = (await database.collection("users").get()).docs;
  const usersData = await db.findAllUsers();
  return usersData.reduce((challenges, userData) => {
    const userChallenges = userData.challenges ?? {};
    const userUnpackedChallenges = Object.keys(userChallenges).map(challengeKey => ({
      userAddress: userData.id,
      id: challengeKey,
      ...userChallenges[challengeKey],
    }));
    return challenges.concat(userUnpackedChallenges);
  }, []);
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

  getAllChallenges,

  __internal_database: db.__internal_database, // testing only
};
