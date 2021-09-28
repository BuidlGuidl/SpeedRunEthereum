const firebaseImplementation = require("./dbFirebase");

// TODO in #47, use one implementation or the other based on .env
const db = firebaseImplementation;

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

const userExists = db.userExists;

module.exports = {
  createUser,
  updateUser,
  findAllUsers,
  findUserByAddress,
  userExists,
};
