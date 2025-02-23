import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {

  const token = jwt.sign({ userId }, "eMr8rlzs", {
    expiresIn: "20d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: false,
  });
  // res.cookie("jwt", token, {
  //   maxAge: 15 * 24 * 60 * 60 * 1000, //15d
  //   httpOnly: true, 
  //   sameSite: "strict", 
  //   secure: process.env.NODE_ENV !== "Development",
  // });
  return token;
};

export default generateTokenAndSetCookie;
