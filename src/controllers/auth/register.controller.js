const { CREATED, BAD_REQUEST } = require("http-status");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET_KEY,
  JWT_ACCESS_TOKEN_EXPIRES,
} = require("../../config/config.development");
const { createUser, getUser } = require("../../services/users.service");
const { errorFormatter } = require("../../utils/errorFormatter");

const registerController = async (req, res, next) => {
  const body = req.body;
  console.log("INFO - Body is valid");
  const email = body.email;
  const username = body.username;
  const password = body.password;

  let userExist = false;
  try {
    const emailExist = await getUser({ email });
    const usernameExist = await getUser({ username });
    userExist = emailExist || usernameExist;
  } catch (err) {
    return next(err);
  }

  if (userExist) {
    const message = "User exist. Please use a different email or username";
    const err = errorFormatter(message, BAD_REQUEST);
    return next(err);
  }

  console.log("INFO - Creating new user");

  let newUser;
  try {
    newUser = await createUser({ email, username, password });
  } catch (err) {
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      },
      JWT_SECRET_KEY,
      { expiresIn: JWT_ACCESS_TOKEN_EXPIRES }
    );
  } catch (err) {
    return next(err);
  }

  returnUser = { username: newUser.username, email: newUser.email };

  return res.status(CREATED).json({ token, user: returnUser });
};

module.exports = { registerController };
