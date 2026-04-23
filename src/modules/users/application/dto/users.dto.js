const AppError = require('../../../../core/errors/app-error');

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function serializeUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

function validateUpdateUserInput(payload) {
  const data = {};

  if (payload.firstName !== undefined) {
    const firstName = normalizeString(payload.firstName);

    if (!firstName) {
      throw new AppError('firstName cannot be empty.', 400);
    }

    data.firstName = firstName;
  }

  if (payload.lastName !== undefined) {
    const lastName = normalizeString(payload.lastName);

    if (!lastName) {
      throw new AppError('lastName cannot be empty.', 400);
    }

    data.lastName = lastName;
  }

  if (payload.email !== undefined) {
    const email = normalizeString(payload.email).toLowerCase();

    if (!email || !validateEmail(email)) {
      throw new AppError('Invalid email address.', 400);
    }

    data.email = email;
  }

  if (payload.phone !== undefined) {
    const phone = normalizeString(payload.phone);
    data.phone = phone || null;
  }

  if (Object.keys(data).length === 0) {
    throw new AppError('At least one field must be provided to update the user.', 400);
  }

  return data;
}

function validateUpdateUserStatusInput(payload) {
  if (typeof payload.isActive !== 'boolean') {
    throw new AppError('isActive must be a boolean.', 400);
  }

  return {
    isActive: payload.isActive
  };
}

module.exports = {
  serializeUser,
  validateUpdateUserInput,
  validateUpdateUserStatusInput
};
