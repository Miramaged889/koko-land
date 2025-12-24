import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  purchaseApi,
  PurchaseRequestData,
  ProcessRequestData,
  PurchaseRequest,
  LibraryItem,
} from "../../services/api";

export interface PurchaseState {
  requests: PurchaseRequest[];
  library: LibraryItem[];
  loading: boolean;
  error: string | null;
  createRequestLoading: boolean;
  processRequestLoading: boolean;
  libraryLoading: boolean;
}

const initialState: PurchaseState = {
  requests: [],
  library: [],
  loading: false,
  error: null,
  createRequestLoading: false,
  processRequestLoading: false,
  libraryLoading: false,
};

// Async thunks
export const createPurchaseRequest = createAsyncThunk(
  "purchase/createRequest",
  async (data: PurchaseRequestData, { rejectWithValue }) => {
    try {
      return await purchaseApi.createPurchaseRequest(data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل إنشاء طلب الشراء"
      );
    }
  }
);

export const listAdminRequests = createAsyncThunk(
  "purchase/listAdminRequests",
  async (_, { rejectWithValue }) => {
    try {
      return await purchaseApi.listAdminRequests();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تحميل قائمة الطلبات"
      );
    }
  }
);

export const processRequest = createAsyncThunk(
  "purchase/processRequest",
  async (
    { requestId, data }: { requestId: number; data: ProcessRequestData },
    { rejectWithValue }
  ) => {
    try {
      return await purchaseApi.processRequest(requestId, data);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل معالجة الطلب"
      );
    }
  }
);

export const getUserLibrary = createAsyncThunk(
  "purchase/getUserLibrary",
  async (_, { rejectWithValue }) => {
    try {
      return await purchaseApi.getUserLibrary();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تحميل المكتبة"
      );
    }
  }
);

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create purchase request
    builder
      .addCase(createPurchaseRequest.pending, (state) => {
        state.createRequestLoading = true;
        state.error = null;
      })
      .addCase(createPurchaseRequest.fulfilled, (state) => {
        state.createRequestLoading = false;
        state.error = null;
      })
      .addCase(createPurchaseRequest.rejected, (state, action) => {
        state.createRequestLoading = false;
        state.error = action.payload as string;
      });

    // List admin requests
    builder
      .addCase(listAdminRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listAdminRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
        state.error = null;
      })
      .addCase(listAdminRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Process request
    builder
      .addCase(processRequest.pending, (state) => {
        state.processRequestLoading = true;
        state.error = null;
      })
      .addCase(processRequest.fulfilled, (state, action) => {
        state.processRequestLoading = false;
        // Remove the processed request from the list
        const requestId = action.meta.arg.requestId;
        state.requests = state.requests.filter((r) => r.id !== requestId);
        state.error = null;
      })
      .addCase(processRequest.rejected, (state, action) => {
        state.processRequestLoading = false;
        state.error = action.payload as string;
      });

    // Get user library
    builder
      .addCase(getUserLibrary.pending, (state) => {
        state.libraryLoading = true;
        state.error = null;
      })
      .addCase(getUserLibrary.fulfilled, (state, action) => {
        state.libraryLoading = false;
        state.library = action.payload;
        state.error = null;
      })
      .addCase(getUserLibrary.rejected, (state, action) => {
        state.libraryLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = purchaseSlice.actions;
export default purchaseSlice.reducer;

