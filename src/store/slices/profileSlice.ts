import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  userApi,
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  ResetPasswordEmailData,
  ResetPasswordData,
} from "../../services/api";
import { logout } from "./authSlice";

export interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
  passwordChangeLoading: boolean;
  passwordChangeError: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
  passwordChangeLoading: false,
  passwordChangeError: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.getProfile();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تحميل الملف الشخصي"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (data: UpdateProfileData, { dispatch, rejectWithValue }) => {
    try {
      // Use PUT method to update profile
      await userApi.updateProfile(data);
      // Fetch updated profile after successful update
      const updatedProfile = await dispatch(fetchProfile()).unwrap();
      return updatedProfile;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تحديث الملف الشخصي"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (data: ChangePasswordData, { rejectWithValue }) => {
    try {
      return await userApi.changePassword(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تغيير كلمة المرور"
      );
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "profile/deleteAccount",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await userApi.deleteAccount();
      dispatch(logout());
      return true;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل حذف الحساب");
    }
  }
);

export const sendResetPasswordEmail = createAsyncThunk(
  "profile/sendResetPasswordEmail",
  async (data: ResetPasswordEmailData, { rejectWithValue }) => {
    try {
      return await userApi.sendResetPasswordEmail(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل إرسال بريد إعادة التعيين"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "profile/resetPassword",
  async (
    {
      uid,
      token,
      data,
    }: { uid: string; token: string; data: ResetPasswordData },
    { rejectWithValue }
  ) => {
    try {
      return await userApi.resetPassword(uid, token, data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل إعادة تعيين كلمة المرور"
      );
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
      state.passwordChangeError = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload; // Set the full updated profile
        state.updateError = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });

    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.passwordChangeLoading = true;
        state.passwordChangeError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordChangeLoading = false;
        state.passwordChangeError = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordChangeLoading = false;
        state.passwordChangeError = action.payload as string;
      });

    // Delete account
    builder
      .addCase(deleteAccount.fulfilled, (state) => {
        state.profile = null;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
