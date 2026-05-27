import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/user.service.js';

const initialState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await userService.getAll();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchUserById = createAsyncThunk('users/fetchById', async (id, { rejectWithValue }) => {
  try {
    return await userService.getById(id);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchUsers.fulfilled, (state, action) => { state.isLoading = false; state.users = action.payload; })
      .addCase(fetchUsers.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      .addCase(fetchUserById.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchUserById.fulfilled, (state, action) => { state.isLoading = false; state.selectedUser = action.payload; })
      .addCase(fetchUserById.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const { clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
