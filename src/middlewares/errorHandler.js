const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.status ? err.message : 'Something went wrong',
    data: err.message,
  });
};

export default errorHandler;
