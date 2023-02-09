import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // const authHeader = req.headers.token;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      message: "No token provided",
    });
  } else {
    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({
        status: "error",
        message: "You,re not authenticated",
      });
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ status: "error", message: "Token is invalid" });
      req.user = user;
      // console.log("Token verified :", req.user);
      return next();
    });
  }
};

module.exports = {
  verifyToken,
};
