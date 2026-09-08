const { generateToken } = require('../utils/helpers');

const buildAuthResponse = (user) => ({
  token: generateToken(user._id),
  user: user.toSafeObject()
});

module.exports = { buildAuthResponse };
