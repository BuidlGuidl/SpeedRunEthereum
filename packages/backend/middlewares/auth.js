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

  // TODO maybe return a 400 if the address is undefined
  next();
};

/**
 * Middleware to validate role-gated requests.
 *
 * @param role string
 */
const withRole = role => {
  return (req, res, next) => {
    withAddress(req, res, async () => {
      const user = await db.findUserByAddress(req.address);
      // ToDo. Role utils: hasBuilderRoles or atLeastBuilder, etc.
      // For now, bypassing admin
      if (!user.exists || (user.data.role !== "admin" && user.data.role !== role)) {
        return res.status(401).send(`Not a ${role}`);
      }
      next();
    });
  };
};

module.exports = {
  withAddress,
  withRole,
};
