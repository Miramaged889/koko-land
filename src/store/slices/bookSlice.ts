import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  bookApi,
  Book,
  AddBookRequest,
  UpdateBookRequest,
  SearchBooksRequest,
  CustomizeBookRequest,
  BookCustomization,
} from "../../services/api";

export interface BookState {
  books: Book[];
  book: Book | null;
  customizations: BookCustomization[];
  loading: boolean;
  error: string | null;
  addBookLoading: boolean;
  updateBookLoading: boolean;
  deleteBookLoading: boolean;
  customizeBookLoading: boolean;
  customizationsLoading: boolean;
  deleteCustomizationLoading: boolean;
}

const initialState: BookState = {
  books: [],
  book: null,
  customizations: [],
  loading: false,
  error: null,
  addBookLoading: false,
  updateBookLoading: false,
  deleteBookLoading: false,
  customizeBookLoading: false,
  customizationsLoading: false,
  deleteCustomizationLoading: false,
};

// Async thunks
export const listBooks = createAsyncThunk(
  "books/listBooks",
  async (_, { rejectWithValue }) => {
    try {
      return await bookApi.listBooks();
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تحميل قائمة الكتب"
      );
    }
  }
);

export const getBook = createAsyncThunk(
  "books/getBook",
  async (id: number, { rejectWithValue }) => {
    try {
      return await bookApi.getBook(id);
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تحميل تفاصيل الكتاب"
      );
    }
  }
);

export const addBook = createAsyncThunk(
  "books/addBook",
  async (data: AddBookRequest, { rejectWithValue }) => {
    try {
      const response = await bookApi.addBook(data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل إضافة الكتاب");
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async (
    { id, data }: { id: number; data: UpdateBookRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await bookApi.updateBook(id, data);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل تحديث الكتاب");
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id: number, { rejectWithValue }) => {
    try {
      await bookApi.deleteBook(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل حذف الكتاب");
    }
  }
);

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (data: SearchBooksRequest, { rejectWithValue }) => {
    try {
      return await bookApi.searchBooks(data);
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل البحث عن الكتب");
    }
  }
);

export const customizeBook = createAsyncThunk(
  "books/customizeBook",
  async (data: CustomizeBookRequest, { rejectWithValue }) => {
    try {
      return await bookApi.customizeBook(data);
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل تخصيص الكتاب");
    }
  }
);

export const listCustomizations = createAsyncThunk(
  "books/listCustomizations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookApi.listCustomizations();
      return response.customizations;
    } catch (error: unknown) {
      return rejectWithValue(
        (error as Error).message || "فشل تحميل قائمة التخصيصات"
      );
    }
  }
);

export const deleteCustomization = createAsyncThunk(
  "books/deleteCustomization",
  async (id: number, { rejectWithValue }) => {
    try {
      await bookApi.deleteCustomization(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || "فشل حذف التخصيص");
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearBook: (state) => {
      state.book = null;
    },
    clearBooks: (state) => {
      state.books = [];
    },
  },
  extraReducers: (builder) => {
    // List books
    builder
      .addCase(listBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
        state.error = null;
      })
      .addCase(listBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get book
    builder
      .addCase(getBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
        state.error = null;
      })
      .addCase(getBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add book
    builder
      .addCase(addBook.pending, (state) => {
        state.addBookLoading = true;
        state.error = null;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.addBookLoading = false;
        state.books.push(action.payload);
        state.error = null;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.addBookLoading = false;
        state.error = action.payload as string;
      });

    // Update book
    builder
      .addCase(updateBook.pending, (state) => {
        state.updateBookLoading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.updateBookLoading = false;
        const index = state.books.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        if (state.book?.id === action.payload.id) {
          state.book = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.updateBookLoading = false;
        state.error = action.payload as string;
      });

    // Delete book
    builder
      .addCase(deleteBook.pending, (state) => {
        state.deleteBookLoading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.deleteBookLoading = false;
        state.books = state.books.filter((b) => b.id !== action.payload);
        if (state.book?.id === action.payload) {
          state.book = null;
        }
        state.error = null;
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.deleteBookLoading = false;
        state.error = action.payload as string;
      });

    // Search books
    builder
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
        state.error = null;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Customize book
    builder
      .addCase(customizeBook.pending, (state) => {
        state.customizeBookLoading = true;
        state.error = null;
      })
      .addCase(customizeBook.fulfilled, (state) => {
        state.customizeBookLoading = false;
        state.error = null;
      })
      .addCase(customizeBook.rejected, (state, action) => {
        state.customizeBookLoading = false;
        state.error = action.payload as string;
      });

    // List customizations
    builder
      .addCase(listCustomizations.pending, (state) => {
        state.customizationsLoading = true;
        state.error = null;
      })
      .addCase(listCustomizations.fulfilled, (state, action) => {
        state.customizationsLoading = false;
        state.customizations = action.payload;
        state.error = null;
      })
      .addCase(listCustomizations.rejected, (state, action) => {
        state.customizationsLoading = false;
        state.error = action.payload as string;
      });

    // Delete customization
    builder
      .addCase(deleteCustomization.pending, (state) => {
        state.deleteCustomizationLoading = true;
        state.error = null;
      })
      .addCase(deleteCustomization.fulfilled, (state, action) => {
        state.deleteCustomizationLoading = false;
        state.customizations = state.customizations.filter(
          (c) => c.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCustomization.rejected, (state, action) => {
        state.deleteCustomizationLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearBook, clearBooks } = bookSlice.actions;
export default bookSlice.reducer;
