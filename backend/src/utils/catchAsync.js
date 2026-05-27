/**
 * catchAsync
 *
 * Wraps an async route handler so you never need try/catch boilerplate.
 * Any rejected promise is forwarded to Express's next(error) middleware.
 *
 * @param {Function} fn - async (req, res, next) => void
 * @returns Express middleware function
 *
 * @example
 *   export const getUser = catchAsync(async (req, res) => {
 *     const user = await User.findById(req.params.id);
 *     res.json({ user });
 *   });
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
