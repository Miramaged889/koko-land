import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  userApi,
  LoginData,
  RegisterData,
  setAuthTokens,
  clearAuthTokens,
} from "../../services/api";
import { fetchProfile } from "../slices/profileSlice";

export interface AuthState {
  user: {
    id: number | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    isAdmin: boolean;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

// Helper function to parse and translate error messages
const parseErrorMessage = (
  error: unknown,
  type: "login" | "register"
): string => {
  let errorMessage = (error as Error).message || "";

  // Remove field prefixes like "email: " or "password: " if present
  const fieldPrefixMatch = errorMessage.match(
    /^(email|password|password2):\s*/i
  );
  if (fieldPrefixMatch) {
    errorMessage = errorMessage.substring(fieldPrefixMatch[0].length);
  }

  const errorString = errorMessage.toLowerCase().trim();

  if (type === "login") {
    // Check for email not found / doesn't exist
    if (
      errorString.includes("email") &&
      (errorString.includes("does not exist") ||
        errorString.includes("not found") ||
        errorString.includes("no active account") ||
        errorString.includes("invalid") ||
        errorString.includes("not registered"))
    ) {
      return "البريد الإلكتروني غير مسجل في النظام";
    }
    // Check for wrong password
    if (
      errorString.includes("password") ||
      errorString.includes("invalid credentials") ||
      errorString.includes("incorrect") ||
      errorString.includes("wrong") ||
      errorString.includes("authentication failed") ||
      errorString.includes("unauthorized")
    ) {
      return "كلمة المرور غير صحيحة";
    }
    // Generic login error
    if (errorMessage) {
      return errorMessage;
    }
    return "فشل تسجيل الدخول. يرجى التحقق من البيانات وإعادة المحاولة";
  } else {
    // Register errors
    if (
      errorString.includes("email") &&
      (errorString.includes("already exists") ||
        errorString.includes("already registered") ||
        errorString.includes("unique") ||
        errorString.includes("taken") ||
        errorString.includes("user with this email"))
    ) {
      return "هذا البريد الإلكتروني مسجل مسبقاً";
    }
    if (
      errorString.includes("password") &&
      (errorString.includes("match") ||
        errorString.includes("mismatch") ||
        errorString.includes("do not match"))
    ) {
      return "كلمات المرور غير متطابقة";
    }
    // Generic register error
    if (errorMessage) {
      return errorMessage;
    }
    return "فشل إنشاء الحساب. يرجى التحقق من البيانات وإعادة المحاولة";
  }
};

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginData, { dispatch, rejectWithValue }) => {
    try {
      const response = await userApi.login(credentials);
      setAuthTokens(response.token.access, response.token.refresh);
      // Fetch user profile after successful login
      try {
        await dispatch(fetchProfile()).unwrap();
      } catch (profileError) {
        // Profile fetch failed, but login was successful
        console.warn("Failed to fetch profile:", profileError);
      }
      return {
        token: response.token,
        isAdmin: response.is_admin,
        email: credentials.email,
      };
    } catch (error: unknown) {
      const errorMessage = parseErrorMessage(error, "login");
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { dispatch, rejectWithValue }) => {
    try {
      const response = await userApi.register(userData);
      setAuthTokens(response.token.access, response.token.refresh);
      // Fetch user profile after successful registration
      try {
        await dispatch(fetchProfile()).unwrap();
      } catch (profileError) {
        // Profile fetch failed, but registration was successful
        console.warn("Failed to fetch profile:", profileError);
      }
      return {
        token: response.token,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name,
      };
    } catch (error: unknown) {
      const errorMessage = parseErrorMessage(error, "register");
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      clearAuthTokens();
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.token.access;
        state.refreshToken = action.payload.token.refresh;
        state.isAuthenticated = true;
        state.user = {
          id: null, // API doesn't return user ID in login response
          email: action.payload.email,
          firstName: null,
          lastName: null,
          isAdmin: action.payload.isAdmin,
        };
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.token.access;
        state.refreshToken = action.payload.token.refresh;
        state.isAuthenticated = true;
        state.user = {
          id: null,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          isAdmin: false,
        };
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
