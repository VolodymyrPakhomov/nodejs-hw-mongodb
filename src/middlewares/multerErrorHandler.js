import createHttpError from 'http-errors';

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      throw createHttpError(400, 'File too large');
    }
    if (err.message === 'Only image files are allowed') {
      throw createHttpError(400, 'Only image files are allowed');
    }
    if (err.code === 'ENOENT') {
      throw createHttpError(500, 'Upload directory not found');
    }
  }
  next(err);
};