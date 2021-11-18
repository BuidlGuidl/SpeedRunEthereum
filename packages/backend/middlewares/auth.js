const db = require("../services/db");

/**
 * Middleware that adds to the request the address sent in the headers.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
const withAddress = (req, res, next) => {
  const { address } = req.headers;
  req.address = address;

  next();
};

/**
 * Middleware to validate admin requests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
const adminOnly = (req, res, next) => {
  withAddress(req, res, async () => {
    const user = await db.findUserByAddress(req.address);
    // ToDo. Role utils
    if (user.data.role !== "admin") {
      return res.status(401).send("Not an admin");
    }
    next();
  });
};

module.exports = {
  withAddress,
  adminOnly,
};
