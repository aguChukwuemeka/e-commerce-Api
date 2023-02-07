const checkIfTheOwnerOrAdmin = (req, res, next) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    return next();
  }
  return res
    .status(403)
    .json({ status: "failed", message: "You're not allowed to that!" });
};

const checkIfAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }
  return res
    .status(403)
    .json({ status: "failed", message: "Only Admin is allowed to this!" });
};

module.exports = {
  checkIfAdmin,
  checkIfTheOwnerOrAdmin,
};
