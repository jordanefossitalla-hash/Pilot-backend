const bcrypt = require('bcryptjs');

const passwordService = {
  hash(password) {
    return bcrypt.hash(password, 10);
  },
  compare(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }
};

module.exports = passwordService;
