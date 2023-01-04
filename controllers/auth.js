const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).send({ user: { name: user.name }, token });
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and passwords");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Please provide credentials");
  }

  const isPwCorrect = await user.comparePassword(password);
  if (!isPwCorrect) {
    throw new UnauthenticatedError("Please provide password");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
