/**
 * AppError
 *
 * Operational errors (bad input, not found, unauthorized) that should produce
 * a structured JSON response.  Thrown from controllers / middleware and caught
 * by the global error handler in app.js.
 *
 * Non-operational errors (programming bugs, DB issues) are NOT AppErrors and
 * will surface with a 500 in the global handler.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode  = statusCode;
    this.isOperational = true;
    // Maintains proper stack trace in V8 (Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
