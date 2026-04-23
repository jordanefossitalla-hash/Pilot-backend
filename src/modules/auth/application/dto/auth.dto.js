const AppError = require('../../../../core/errors/app-error');

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateRegisterInput(payload) {
  const firstName = normalizeString(payload.firstName);
  const lastName = normalizeString(payload.lastName);
  const email = normalizeString(payload.email).toLowerCase();
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!firstName || !lastName || !email || !password) {
    throw new AppError('firstName, lastName, email and password are required.', 400);
  }

  if (!validateEmail(email)) {
    throw new AppError('Invalid email address.', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must contain at least 8 characters.', 400);
  }

  return {
    firstName,
    lastName,
    email,
    password
  };
}

function validateLoginInput(payload) {
  const email = normalizeString(payload.email).toLowerCase();
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!email || !password) {
    throw new AppError('email and password are required.', 400);
  }

  if (!validateEmail(email)) {
    throw new AppError('Invalid email address.', 400);
  }

  return {
    email,
    password
  };
}

function serializeAuthUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  };
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  serializeAuthUser
};
