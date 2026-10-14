const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      mesage: err.mesage,
      stack: err.stack?.replace(/\s*\n\s*/g, ' ').trim(),
    });
  } else if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      mesage: err.mesage,
    });
  } else {
    console.error('UNEXPECTED ERROR:', err);
    res.status(500).json({
      status: 'error',
      mesage: 'Something went very wrong!',
    });
  }
};

export default errorHandler;
