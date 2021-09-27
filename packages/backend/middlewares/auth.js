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

module.exports = {
  withAddress,
};
