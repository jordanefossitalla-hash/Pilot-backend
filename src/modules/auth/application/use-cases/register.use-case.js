const AppError = require('../../../../core/errors/app-error');
const { serializeAuthUser } = require('../dto/auth.dto');

async function registerUseCase(dependencies, input) {
  const { userRepository, passwordService, tokenService } = dependencies;

  const existingUser = await userRepository.findByEmail(input.email);

  if (existingUser) {
    throw new AppError('An account already exists with this email.', 409);
  }

  const passwordHash = await passwordService.hash(input.password);

  const user = await userRepository.create({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    passwordHash
  });

  const token = tokenService.sign({
    sub: user.id,
    role: user.role,
    email: user.email
  });

  return {
    token,
    user: serializeAuthUser(user)
  };
}

module.exports = registerUseCase;
