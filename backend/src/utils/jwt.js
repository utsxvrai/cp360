const jwt = require('jsonwebtoken');
const { JWTConfig } = require('../config');

const generateToken = (payload) => {
  // Ensure userId is set (for compatibility)
  const tokenPayload = {
    ...payload,
    userId: payload.userId || payload.id,
  };
  return jwt.sign(tokenPayload, JWTConfig.JWT_SECRET, {
    expiresIn: JWTConfig.JWT_EXPIRY,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWTConfig.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};

