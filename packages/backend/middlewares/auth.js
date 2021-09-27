/**
 * Middleware to validate any request that needs to be authorized.
 *
 * For the verification to work properly, two headers have to be sent with the request:
 * ```js
 * headers: {
 *   authorization: `token ${token}`, // token being the one generated at `POST /sign`
 *   address, // address being the blockchain address of the user making the request
 * }
 * ```
 *
 * See /packages/react-app/views/JwtTest.jsx for a code example.
 * Testing of the middleware can be done at /jwt-test on the client side
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
