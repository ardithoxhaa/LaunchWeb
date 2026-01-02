import { HttpError } from '../utils/httpError.js';
import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err instanceof HttpError ? err.status : 500;
  const isProd = env.NODE_ENV === 'production';
  const message = err instanceof HttpError ? err.message : isProd ? 'Internal Server Error' : err.message;

  if (!isProd) {
    console.error(err);
  }

  const payload = {
    error: {
      message,
      status,
    },
  };

  if (!isProd && !(err instanceof HttpError)) {
    payload.error.details = {
      code: err.code,
    };
  }

  res.status(status).json(payload);
}
