const errorHandler = (err, req, res, next) => {
  //  Joi масив помилок
  if (err.status === 400 && err.errors) {
    return res.status(400).json({
      status: 400,
      message: 'Validation error',
      errors: err.errors.map((e) => ({
        message: e.message,
        path: e.path,
        type: e.type,
      })),
    });
  }
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.status ? err.message : 'Something went wrong',
    data: err.message,
  });
};

export default errorHandler;
