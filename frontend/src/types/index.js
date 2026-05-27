/**
 * @typedef {'user' | 'creator' | 'admin'} UserRole
 *
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} [avatar]
 * @property {string} [bio]
 * @property {boolean} isActive
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} token
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {Array<{msg: string, param: string}>} [errors]
 */
