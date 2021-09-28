const firebaseImplementation = require("./dbFirebase");

// TODO in #47, use one implementation or the other based on .env
const db = firebaseImplementation;

const createUser = db.createUser;

const updateUser = db.updateUser;

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
