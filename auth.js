const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const secret = "your-secret-key"; // Ensure this is consistent

const generateToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, secret, {
    expiresIn: "1h",
  });
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No token provided");
    return res.status(403).json({ error: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("Malformed token");
    return res.status(403).json({ error: "Malformed token" });
  }

  const token = parts[1];

  console.log("Token:", token); // Log the token
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err); // Log the error
      return res.status(500).json({ error: "Failed to authenticate token" });
    }

    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  });
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 8);
};

const checkPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  checkPassword,
};
