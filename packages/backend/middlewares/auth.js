var jwt = require("jsonwebtoken");
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
const jwtAuth = (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  const addressHeader = req.headers.address;
  if (!tokenHeader) {
    console.log("returning 401, no authorization header");
    res.status(401).send("You need to sign to access this resource");
    return;
  }
  if (!addressHeader) {
    console.log("returning 401, no address header");
    res
      .status(401)
      .send("You need to send the user address to access this resource");
    return;
  }
  const token = tokenHeader.replace("token ", "");

  let tokenContents;
  try {
    tokenContents = jwt.verify(token, serviceAccount.private_key, {
      algorithms: ["RS256"],
    });
  } catch (error) {
    console.log("returning 401, invalid token");
    res.status(401).send("invalid token");
    return;
  }

  const addressToken = tokenContents.uid;

  if (addressToken !== addressHeader) {
    console.log("returning 401, address mismatch");
    res.status(401).send("Address mismatch");
    return;
  }

  req.address = addressToken;

  console.log("success!");
  next();
};

module.exports = {
  jwtAuth,
};
