const jwt = require("jsonwebtoken");
const serviceAccount = require("../firebaseServiceAccountKey.json");

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
const userOnly = (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  const addressHeader = req.headers.address;
  if (!tokenHeader) {
    console.log("returning 401, no authorization header");
    res.sendStatus(401);
    return;
  }
  if (!addressHeader) {
    console.log("returning 401, no address header");
    res.sendStatus(401);
    return;
  }
  const token = tokenHeader.replace("token ", "");

  let tokenContents;
  try {
    tokenContents = jwt.verify(token, serviceAccount.private_key, {
      algorithms: ["RS256"],
    });
  } catch (error) {
    console.log("returning 401, invalid token. Error:", error.message);
    res.sendStatus(401);
    return;
  }

  const addressToken = tokenContents.uid;

  if (addressToken !== addressHeader) {
    console.log("returning 401, address mismatch");
    res.sendStatus(401);
    return;
  }

  req.address = addressToken;
  req.isAdmin = tokenContents.claims.isAdmin;

  next();
};

/**
 * Middleware to validate logged in admin requests.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 */
const adminOnly = (req, res, next) => {
  userOnly(req, res, () => {
    // Added by userOnly
    if (!req.isAdmin) {
      console.log("returning 401, Not an admin");
      res.sendStatus(401);
      return;
    }

    next();
  });

};

module.exports = {
  userOnly,
  adminOnly,
};
