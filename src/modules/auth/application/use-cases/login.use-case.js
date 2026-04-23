const AppError = require('../../../../core/errors/app-error');
const { serializeAuthUser } = require('../dto/auth.dto');

async function loginUseCase(dependencies, input) {
  const { userRepository, passwordService, tokenService } = dependencies;

  const user = await userRepository.findByEmail(input.email);

  if (!user) {
    throw new AppError('Invalid credentials.', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account is disabled.', 403);
  }

  const passwordMatches = await passwordService.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError('Invalid credentials.', 401);
  }

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

module.exports = loginUseCase;
