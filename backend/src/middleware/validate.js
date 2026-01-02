import { ZodError } from 'zod';
import { badRequest } from '../utils/httpError.js';

export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.validated = parsed;
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const first = err.issues?.[0];
        return next(badRequest(first?.message ?? 'Invalid request'));
      }
      next(err);
    }
  };
}
