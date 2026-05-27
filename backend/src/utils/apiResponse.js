/**
 * successResponse
 *
 * Sends a standardised success envelope.
 *
 * @param {import('express').Response} res
 * @param {object}  data        - Payload to merge into the response body
 * @param {string}  message     - Human-readable message (default 'Success')
 * @param {number}  statusCode  - HTTP status code (default 200)
 */
export const successResponse = (res, data = {}, message = 'Success', statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });

/**
 * errorResponse
 *
 * Sends a standardised error envelope (for cases where you want an inline
 * error without throwing — rare; prefer throwing AppError from controllers).
 *
 * @param {import('express').Response} res
 * @param {string}  message     - Error description (default 'An error occurred')
 * @param {number}  statusCode  - HTTP status code (default 400)
 */
export const errorResponse = (res, message = 'An error occurred', statusCode = 400) =>
  res.status(statusCode).json({
    success: false,
    message,
  });
