const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
const secret = process.env.JWT_SECRET;

function verifyAdminToken(req, res, next) {
  // check header or url parameters or post parameters for token
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  // Express headers are auto converted to lowercase
  if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length).trimLeft();
  }
  //console.log(token)
  //console.log(req.headers)
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  // verifies secret and checks exp
  jwt.verify(token, secret, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    console.log(decoded.roles);
    if (decoded.roles != null && !decoded.roles == "admin")
      return res
        .status(403)
        .send({ auth: false, message: "No token provided for admin." });
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    req.roles = decoded.roles;
    next();
  });
}

module.exports = verifyAdminToken;
