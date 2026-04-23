const AppError = require('./app-error');

function errorHandler(err, req, res, next) {
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: 'A unique field already exists.',
      details: err.meta
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  console.error(err);

  return res.status(500).json({
    message: 'Internal server error'
  });
}

module.exports = errorHandler;
