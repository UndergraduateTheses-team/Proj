const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "Unauthorized - User not authenticated!" });
    }

    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Unauthorized - Admin access required!" });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

export default isAdmin;
