require("dotenv").config();

const DB_SERVICES = {
  firebase: "./dbFirebase",
  local: "./dbLocal",
};

const selectedService = process.env.DATABASE_SERVICE ?? "local";
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
 * @returns {{id: string, challenges?: object, isAdmin?: boolean}[]}
 */
const findAllUsers = db.findAllUsers;

/**
 *
 * @param {Address} builderAddress
 * @returns {{
 *  exists: boolean,
 *  data?: {
 *    id: string,
 *    isAdmin?: boolean
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

module.exports = {
  createUser,
  updateUser,
  findAllUsers,
  findUserByAddress,

  createEvent,
  findAllEvents,
  findEventsWhere,
};
