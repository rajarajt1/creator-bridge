import User from '../models/User.model.js';

export const findUserByEmail = (email) => User.findOne({ email });

export const findUserById = (id) => User.findById(id).select('-password');

export const createUser = (data) => User.create(data);

export const updateUserById = (id, data) =>
  User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).select('-password');

export const deleteUserById = (id) => User.findByIdAndDelete(id);
