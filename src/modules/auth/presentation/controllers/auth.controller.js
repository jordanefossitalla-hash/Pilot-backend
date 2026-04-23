const prisma = require('../../../../core/database/prisma');
const catchAsync = require('../../../../core/utils/catch-async');
const AppError = require('../../../../core/errors/app-error');
const {
  validateRegisterInput,
  validateLoginInput,
  serializeAuthUser
} = require('../../application/dto/auth.dto');
const registerUseCase = require('../../application/use-cases/register.use-case');
const loginUseCase = require('../../application/use-cases/login.use-case');
const passwordService = require('../../domain/services/password.service');
const tokenService = require('../../domain/services/token.service');
const PrismaUserRepository = require('../../infrastructure/repositories/prisma-user.repository');

const userRepository = new PrismaUserRepository(prisma);

const dependencies = {
  userRepository,
  passwordService,
  tokenService
};

const register = catchAsync(async (req, res) => {
  const input = validateRegisterInput(req.body);
  const result = await registerUseCase(dependencies, input);

  res.status(201).json(result);
});

const login = catchAsync(async (req, res) => {
  const input = validateLoginInput(req.body);
  const result = await loginUseCase(dependencies, input);

  res.status(200).json(result);
});

const me = catchAsync(async (req, res) => {
  const user = await userRepository.findById(req.auth.sub);

  if (!user) {
    throw new AppError('Authenticated user not found.', 404);
  }

  res.status(200).json({
    user: serializeAuthUser(user)
  });
});

module.exports = {
  register,
  login,
  me
};
