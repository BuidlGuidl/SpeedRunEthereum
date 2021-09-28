const fs = require("fs");

const DATABASE_PATH = "./local_database/local_db.json";

if (!fs.existsSync(DATABASE_PATH)) {
  const file = fs.openSync(DATABASE_PATH, "w");
  fs.writeFileSync(file, "{}");
  fs.closeSync(file);
}

const database = JSON.parse(fs.readFileSync(DATABASE_PATH, "utf8"));

const findUserByAddress = builderAddress => {
  if (!database[builderAddress]) {
    return { exists: false };
  }
  return { exists: true, data: { id: builderAddress, ...database[builderAddress] } };
};

const persist = () => {
  const file = fs.openSync(DATABASE_PATH, "w");
  fs.writeFileSync(file, JSON.stringify(database, null, 2));
  fs.closeSync(file);
};

const createUser = (userId, userData) => {
  database[userId] = userData;
  persist();
};

const updateUser = (userId, userData) => {
  const { id, ...existingUserData } = findUserByAddress(userId).data;

  database[userId] = {
    ...existingUserData,
    ...userData,
  };

  persist();
};

const findAllUsers = () => {
  return Object.entries(database).map(([id, userData]) => ({ id, ...userData }));
};

module.exports = {
  createUser,
  updateUser,
  findAllUsers,
  findUserByAddress,
};
