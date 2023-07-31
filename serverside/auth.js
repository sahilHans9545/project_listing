const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  console.log(process.env.SECRET_KEY);
  try {
    let token = req.headers.authorization;
    // console.log("reqbody is ", req.body);
    // console.log("reqHeaders ", req.headers.token);
    if (token) {
      token = token.split(" ")[1];
      let user = await jwt.verify(token, process.env.SECRET_KEY);
      // console.log("user is ", user);
      req.userId = user.id;
      // console.log("valid user");
    } else {
      res.status(401).json({ message: "hehe Unauthorized User" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized User" });
  }
};

module.exports = auth;
