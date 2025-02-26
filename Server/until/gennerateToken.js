import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  //create token
  const token = jwt.sign({ userId }, "GOITOILAGI", {
    expiresIn: "20d",
  });

  //set cookies
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15d
    httpOnly: true, //prevent XSS attacks
    sameSite: "strict", //prevent CSRF
    secure: process.env.NODE_ENV !== "Development",
  });
};

export default generateTokenAndSetCookie;
