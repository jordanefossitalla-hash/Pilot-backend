const jwt = require('jsonwebtoken');

const { jwtSecret, jwtExpiresIn } = require('../../../../core/config/env');

const tokenService = {
  sign(payload) {
    return jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiresIn
    });
  }
};

module.exports = tokenService;
