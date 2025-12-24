import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  userApi,
  UpdateUserData,
  AddAdminData,
  AddUserData,
  AdminUser,
} from "../../services/api";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  address?: string;
  payment_info?: string;
}

export interface UserState {
  users: User[];
  searchResults: User[];
  admins: AdminUser[];
  allUsers: AdminUser[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  addUserLoading: boolean;
  addAdminLoading: boolean;
  listAdminsLoading: boolean;
  listUsersLoading: boolean;
}

const initialState: UserState = {
  users: [],
  searchResults: [],
  admins: [],
  allUsers: [],
  loading: false,
  error: null,
  searchTerm: "",
  addUserLoading: false,
  addAdminLoading: false,
  listAdminsLoading: false,
  listUsersLoading: false,
};

// Async thunks
export const searchUsers = createAsyncThunk(
  "users/search",
  async (first_name: string, { rejectWithValue }) => {
    try {
      const users = await userApi.searchUser(first_name);
      return users.map((user) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_admin: user.is_admin,
        address: user.address,
        payment_info: user.payment_info,
      }));
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل البحث عن المستخدمين"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (
    { id, data }: { id: number; data: UpdateUserData },
    { rejectWithValue }
  ) => {
    try {
      await userApi.updateUser(id, data);
      return { id, data };
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل تحديث المستخدم");
    }
  }
);

export const listAdmins = createAsyncThunk(
  "users/listAdmins",
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.listAdmins();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تحميل قائمة المدراء"
      );
    }
  }
);

export const addAdmin = createAsyncThunk(
  "users/addAdmin",
  async (data: AddAdminData, { rejectWithValue }) => {
    try {
      return await userApi.addAdmin(data);
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل إضافة مدير");
    }
  }
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (data: AddUserData, { rejectWithValue }) => {
    try {
      return await userApi.addUser(data);
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل إضافة مستخدم");
    }
  }
);

export const listUsers = createAsyncThunk(
  "users/listUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.listUsers();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تحميل قائمة المستخدمين"
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchTerm = "";
    },
    clearError: (state) => {
      state.error = null;
    },
    // Update user in local state after successful update
    updateUserLocal: (
      state,
      action: PayloadAction<{ id: number; data: UpdateUserData }>
    ) => {
      const { id, data } = action.payload;
      const userIndex = state.searchResults.findIndex((u) => u.id === id);
      if (userIndex !== -1) {
        state.searchResults[userIndex] = {
          ...state.searchResults[userIndex],
          ...data,
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Search users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.searchResults = [];
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload;
        const userIndex = state.searchResults.findIndex((u) => u.id === id);
        if (userIndex !== -1) {
          state.searchResults[userIndex] = {
            ...state.searchResults[userIndex],
            ...data,
          };
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // List admins
    builder
      .addCase(listAdmins.pending, (state) => {
        state.listAdminsLoading = true;
        state.error = null;
      })
      .addCase(listAdmins.fulfilled, (state, action) => {
        state.listAdminsLoading = false;
        state.admins = action.payload;
        state.error = null;
      })
      .addCase(listAdmins.rejected, (state, action) => {
        state.listAdminsLoading = false;
        state.error = action.payload as string;
      });

    // Add admin
    builder
      .addCase(addAdmin.pending, (state) => {
        state.addAdminLoading = true;
        state.error = null;
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.addAdminLoading = false;
        state.admins.push(action.payload);
        state.error = null;
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.addAdminLoading = false;
        state.error = action.payload as string;
      });

    // Add user
    builder
      .addCase(addUser.pending, (state) => {
        state.addUserLoading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.addUserLoading = false;
        state.allUsers.push(action.payload);
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.addUserLoading = false;
        state.error = action.payload as string;
      });

    // List users
    builder
      .addCase(listUsers.pending, (state) => {
        state.listUsersLoading = true;
        state.error = null;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.listUsersLoading = false;
        state.allUsers = action.payload;
        state.error = null;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.listUsersLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearchTerm,
  clearSearchResults,
  clearError,
  updateUserLocal,
} = userSlice.actions;
export default userSlice.reducer;
