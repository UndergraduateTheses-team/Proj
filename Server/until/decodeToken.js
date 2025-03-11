import jwt from "jsonwebtoken";
import User from "../src/models/users.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provider !" });
    }

    // const decoded = await jwt.verify(token, "GOITOILAGI");
    // Wrap jwt.verify in a Promise
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, "GOITOILAGI", (err, decodedToken) => {
        if (err) {
          reject(err);  // Reject with the error if verification fails
        } else {
          resolve(decodedToken);  // Resolve with the decoded token
        }
      });
    });
    if (!decoded) {
            return res
              .status(401)
              .json({ error: "Unauthorized - No token provider !" });
          }
 
    const user = await User.findById(decoded.userId).select("-password");
    console.log("decoded:",decoded, user);
    if (!user) {
      return res.status(404).json({ error: "User not found !" });
    }
    req.user = user;
    next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};

export default protectRoute;





//add await

//     if (!decoded) {
//       return res
//         .status(401)
//         .json({ error: "Unauthorized - No token provider !" });
//     }

//     const user = await User.findById(decoded.userId).select("-password");

//     if (!user) {
//       return res.status(404).json({ error: "User not found !" });
//     }
//     req.user = user;
//     next();
// } catch (err) {
//   console.log(err);
//   return res.status(500).json({ error: err });
// }