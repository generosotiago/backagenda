const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Acesso negado. Necessário ser administrador." });
};

module.exports = verifyAdmin;
