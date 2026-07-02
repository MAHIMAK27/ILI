const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`, err.stack);
  
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
