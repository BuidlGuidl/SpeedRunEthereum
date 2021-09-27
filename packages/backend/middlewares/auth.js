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
  withAddress(req, res, () => {
    // should be done in #51 https://github.com/moonshotcollective/scaffold-directory/issues/51
    console.log("!! SKIPPING ADMIN CHECKS. THIS SHOULD BE FIXED IN #51");
    next();
  });
};

module.exports = {
  withAddress,
  adminOnly,
};
