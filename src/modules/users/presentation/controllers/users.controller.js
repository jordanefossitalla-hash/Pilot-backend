const prisma = require('../../../../core/database/prisma');
const catchAsync = require('../../../../core/utils/catch-async');
const AppError = require('../../../../core/errors/app-error');
const {
  serializeUser,
  validateUpdateUserInput,
  validateUpdateUserStatusInput
} = require('../../application/dto/users.dto');
const PrismaUsersRepository = require('../../infrastructure/repositories/prisma-users.repository');

const usersRepository = new PrismaUsersRepository(prisma);

const listUsers = catchAsync(async (req, res) => {
  const users = await usersRepository.findAll();

  res.status(200).json({
    users: users.map(serializeUser)
  });
});

const getUserById = catchAsync(async (req, res) => {
  const user = await usersRepository.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  res.status(200).json({
    user: serializeUser(user)
  });
});

const updateUser = catchAsync(async (req, res) => {
  const existingUser = await usersRepository.findById(req.params.id);

  if (!existingUser) {
    throw new AppError('User not found.', 404);
  }

  const data = validateUpdateUserInput(req.body);

  if (data.email && data.email !== existingUser.email) {
    const userWithSameEmail = await usersRepository.findByEmail(data.email);

    if (userWithSameEmail) {
      throw new AppError('An account already exists with this email.', 409);
    }
  }

  const user = await usersRepository.update(req.params.id, data);

  res.status(200).json({
    user: serializeUser(user)
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const existingUser = await usersRepository.findById(req.params.id);

  if (!existingUser) {
    throw new AppError('User not found.', 404);
  }

  const data = validateUpdateUserStatusInput(req.body);
  const user = await usersRepository.update(req.params.id, data);

  res.status(200).json({
    user: serializeUser(user)
  });
});

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  updateUserStatus
};
