import jwt from "jsonwebtoken";
import User from "../src/models/users.js";

const protectRoute = async (req, res, next) => {
  try {
    //get token from cookies

    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provider !" });
    }

    const decoded = jwt.verify(token, "eMr8rlzs");

    if (!decoded) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provider !" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found !" });
    }
    // console.log("why user not found 404? user: " + user);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export default protectRoute;
