const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "privateKey");
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid or expired token" });
  }
};

module.exports = authMiddleware;
