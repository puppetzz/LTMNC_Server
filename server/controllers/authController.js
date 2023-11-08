const User = require("../models/User");

const register = async (request, response) => {
  const checkEmailExist = await User.findOne({ email: request.body.email });
  if (checkEmailExist) return response.status(422).send("Email is exist");

  const user = new User({
    email: request.body.email,
    password: request.body.password,
    displayName: request.body.displayName,
  });

  try {
    const newUser = await user.save();
    await response.send(newUser);
  } catch (err) {
    response.status(400).send(err);
  }
};

const login = async (request, response) => {
  const user = await User.findOne({ email: request.body.email });
  if (!user)
    return response.status(422).send("Email or Password is not correct");
  if (request.body.password != user.password)
    return response.status(422).send("Email or Password is not correct");

  await response.send(user);
};

module.exports = {
  register,
  login,
};
