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
// TODO add jsdocs
const createEvent = db.createEvent;
const findAllEvents = db.findAllEvents;
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
