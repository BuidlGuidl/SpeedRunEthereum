const firebaseImplementation = require("./dbFirebase");
const localImplementation = require("./dbLocal");

// TODO in #47, use one implementation or the other based on .env
const db = localImplementation;

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

module.exports = {
  createUser,
  updateUser,
  findAllUsers,
  findUserByAddress,
};
