const authMiddleware = (req, res, next) => {
  const token = req.body.token;
  if (token) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
