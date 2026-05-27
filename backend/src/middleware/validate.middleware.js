import { ZodError } from 'zod';

/**
 * Returns an Express middleware that validates req.body against the
 * provided Zod schema.  On failure it returns a 400 with a structured
 * errors array; on success it replaces req.body with the parsed (and
 * coerced) value and calls next().
 *
 * @param {import('zod').ZodTypeAny} schema
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Replace body with the parsed/coerced value from Zod
  req.body = result.data;
  next();
};
