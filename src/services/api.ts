// API Base Configuration
const BASE_URL = "https://kokoland.onrender.com";

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  msg?: string;
  error?: string;
}

export interface LoginResponse {
  is_admin: boolean;
  token: {
    access: string;
    refresh: string;
  };
  msg: string;
}

export interface RegisterResponse {
  token: {
    access: string;
    refresh: string;
  };
  msg: string;
}

export interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
  password?: string; // Only in search response
  address?: string;
  payment_info?: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface RegisterData {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
  address?: string;
  payment_info?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  email: string;
  is_admin: boolean;
  first_name: string;
  last_name: string;
  image: string | null;
  address?: string;
  payment_info?: string;
}

export interface UpdateProfileData {
  email?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  payment_info?: string;
}

export interface ResetPasswordEmailData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
  confirm_password: string;
}

export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  image: string | null;
  is_admin: boolean;
}

export interface AddAdminData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  address?: string;
  payment_info?: string;
}

export interface AddUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Book API Types
export interface Book {
  id: number;
  title: string;
  char_name: string;
  price: number;
  category: string;
  age: string;
  gender: string;
  rate: number;
  description: string;
  book_file: string;
  cover_image: string;
  book_file_type: string;
  cover_image_type: string;
}

export interface BookCustomization {
  id: number;
  book: Book;
  child_name: string;
  child_age: string;
  custom_book: string;
  custom_book_type: string;
  child_image: string;
  child_image_type: string;
  user: number;
  created_at: string;
}

export interface CustomizeBookRequest {
  book: number;
  child_name: string;
  child_age: string;
  child_image: File;
}

export interface CustomizeBookResponse {
  success: boolean;
  message: string;
  customization_id: number;
  book_id: number;
  book_title: string;
  child_name: string;
  images_processed: number;
  total_images: number;
  character_replacements: number;
  character_replaced: boolean;
  original_character_name: string;
  custom_book_url: string;
  child_image_url: string;
  ai_processing_used: boolean;
  created_at: string;
}

export interface ListCustomizationsResponse {
  success: boolean;
  count: number;
  customizations: BookCustomization[];
}

export interface GetCustomizationResponse {
  success: boolean;
  customization: BookCustomization;
}

export interface AddBookRequest {
  title: string;
  char_name: string;
  price: number;
  category: string;
  age: string;
  gender: string;
  rate: number;
  description: string;
  book_file: File;
  cover_image: File;
}

export interface AddBookResponse {
  msg: string;
  data: Book;
  book_file_url: string;
  cover_image_url: string;
}

export interface UpdateBookRequest {
  title?: string;
  char_name?: string;
  price?: number;
  category?: string;
  age?: string;
  gender?: string;
  rate?: number;
  description?: string;
}

export interface UpdateBookResponse {
  msg: string;
  data: Book;
}

export interface SearchBooksRequest {
  title?: string;
  category?: string;
  age?: string;
}

// Purchase Request Types
export interface PurchaseRequestData {
  book_id: number;
}

export interface CreatePurchaseRequestResponse {
  message: string;
  request_id: number;
}

export interface PurchaseRequest {
  id: number;
  user: number;
  book: number;
  customization: number | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface ProcessRequestData {
  action: "approve" | "reject";
}

export interface ProcessRequestResponse {
  msg: string;
}

// Library Types
export interface LibraryItem {
  id: number;
  user: number;
  book: Book;
  custom_book: string | null;
  added_at: string;
}

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

// Helper function to set auth tokens
export const setAuthTokens = (access: string, refresh: string): void => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};

// Helper function to clear auth tokens
export const clearAuthTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// API request helper for FormData (for file uploads)
const apiRequestFormData = async <T>(
  endpoint: string,
  formData: FormData,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    method: options.method || "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message ||
        errorData.error ||
        errorData.detail ||
        errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// User API functions
export const userApi = {
  // Register a new user
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    return apiRequest<RegisterResponse>("/user/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Login user
  login: async (data: LoginData): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>("/user/login/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Search users by first name (Admin only)
  searchUser: async (first_name: string): Promise<ApiUser[]> => {
    return apiRequest<ApiUser[]>(
      `/user/searchuser/${encodeURIComponent(first_name)}/`,
      {
        method: "GET",
      }
    );
  },

  // Update user (Admin only)
  updateUser: async (
    id: number,
    data: UpdateUserData
  ): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/user/updateuser/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Change password
  changePassword: async (
    data: ChangePasswordData
  ): Promise<{ msg: string }> => {
    return apiRequest<{ msg: string }>("/user/changepassword/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    return apiRequest<UserProfile>("/user/profile/", {
      method: "GET",
    });
  },

  // Get profile for update
  getProfileForUpdate: async (): Promise<
    Omit<UserProfile, "id" | "is_admin">
  > => {
    return apiRequest<Omit<UserProfile, "id" | "is_admin">>(
      "/user/updateprofile/",
      {
        method: "GET",
      }
    );
  },

  // Update profile (PUT)
  updateProfile: async (
    data: UpdateProfileData
  ): Promise<{ msg: string[] }> => {
    return apiRequest<{ msg: string[] }>("/user/updateprofile/", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Partial update profile (PATCH)
  partialUpdateProfile: async (
    data: UpdateProfileData
  ): Promise<{ msg: string }> => {
    return apiRequest<{ msg: string }>("/user/updateprofile/", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Delete account
  deleteAccount: async (): Promise<{ msg: string }> => {
    return apiRequest<{ msg: string }>("/user/deleteaccount/", {
      method: "DELETE",
    });
  },

  // Send reset password email
  sendResetPasswordEmail: async (
    data: ResetPasswordEmailData
  ): Promise<{ msg: string }> => {
    return apiRequest<{ msg: string }>("/user/sendrestpasswordemail/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Reset password
  resetPassword: async (
    uid: string,
    token: string,
    data: ResetPasswordData
  ): Promise<{ msg: string }> => {
    return apiRequest<{ msg: string }>(`/user/resetpassword/${uid}/${token}/`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // List admins (Admin only)
  listAdmins: async (): Promise<AdminUser[]> => {
    return apiRequest<AdminUser[]>("/user/listadmins/", {
      method: "GET",
    });
  },

  // Add admin (Admin only)
  addAdmin: async (data: AddAdminData): Promise<AdminUser> => {
    return apiRequest<AdminUser>("/user/addadmin/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Add user (Admin only)
  addUser: async (data: AddUserData): Promise<AdminUser> => {
    return apiRequest<AdminUser>("/user/adduser/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // List users (Admin only)
  listUsers: async (): Promise<AdminUser[]> => {
    return apiRequest<AdminUser[]>("/user/listusers/", {
      method: "GET",
    });
  },
};

// Book API functions
export const bookApi = {
  // List all books
  listBooks: async (): Promise<Book[]> => {
    return apiRequest<Book[]>("/books/books/", {
      method: "GET",
    });
  },

  // Get single book
  getBook: async (id: number): Promise<Book> => {
    return apiRequest<Book>(`/books/books/${id}/`, {
      method: "GET",
    });
  },

  // Add book (Admin only)
  addBook: async (data: AddBookRequest): Promise<AddBookResponse> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("char_name", data.char_name);
    formData.append("price", data.price.toString());
    formData.append("category", data.category);
    formData.append("age", data.age);
    formData.append("gender", data.gender);
    formData.append("rate", data.rate.toString());
    formData.append("description", data.description);
    formData.append("book_file", data.book_file);
    formData.append("cover_image", data.cover_image);

    return apiRequestFormData<AddBookResponse>("/books/addbook/", formData, {
      method: "POST",
    });
  },

  // Update book (Admin only)
  updateBook: async (
    id: number,
    data: UpdateBookRequest
  ): Promise<UpdateBookResponse> => {
    return apiRequest<UpdateBookResponse>(`/books/update_book/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  // Delete book (Admin only)
  deleteBook: async (id: number): Promise<{ msg: string }> => {
    return apiRequest<{ msg: string }>(`/books/delete_book/${id}/`, {
      method: "DELETE",
    });
  },

  // Search books
  searchBooks: async (data: SearchBooksRequest): Promise<Book[]> => {
    return apiRequest<Book[]>("/books/search_books/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Customize book
  customizeBook: async (
    data: CustomizeBookRequest
  ): Promise<CustomizeBookResponse> => {
    const formData = new FormData();
    formData.append("book", data.book.toString());
    formData.append("child_name", data.child_name);
    formData.append("child_age", data.child_age);
    formData.append("child_image", data.child_image);

    return apiRequestFormData<CustomizeBookResponse>(
      "/books/customize/",
      formData,
      {
        method: "POST",
      }
    );
  },

  // List customizations
  listCustomizations: async (): Promise<ListCustomizationsResponse> => {
    return apiRequest<ListCustomizationsResponse>(
      "/books/listcustomizations/",
      {
        method: "GET",
      }
    );
  },

  // Get customization
  getCustomization: async (id: number): Promise<GetCustomizationResponse> => {
    return apiRequest<GetCustomizationResponse>(
      `/books/customizations/${id}/`,
      {
        method: "GET",
      }
    );
  },

  // Delete customization
  deleteCustomization: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return apiRequest<{ success: boolean; message: string }>(
      `/books/customizations/${id}/delete/`,
      {
        method: "DELETE",
      }
    );
  },

  // Get custom book file
  getCustomBookFile: async (id: number): Promise<Blob> => {
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${BASE_URL}/books/customizations/${id}/file/`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch custom book file: ${response.statusText}`
      );
    }

    return response.blob();
  },

  // Get child image
  getChildImage: async (id: number): Promise<Blob> => {
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${BASE_URL}/books/customizations/${id}/child-image/`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch child image: ${response.statusText}`);
    }

    return response.blob();
  },

  // Get book file
  getBookFile: async (id: number): Promise<Blob> => {
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/books/bookfile/${id}/`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch book file: ${response.statusText}`);
    }

    return response.blob();
  },

  // Get book cover
  getBookCover: async (id: number): Promise<Blob> => {
    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/books/cover/${id}/`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch book cover: ${response.statusText}`);
    }

    return response.blob();
  },
};

// Purchase API functions
export const purchaseApi = {
  // Create purchase request
  createPurchaseRequest: async (
    data: PurchaseRequestData
  ): Promise<CreatePurchaseRequestResponse> => {
    return apiRequest<CreatePurchaseRequestResponse>("/buy/purrequests/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Admin: List all purchase requests
  listAdminRequests: async (): Promise<PurchaseRequest[]> => {
    return apiRequest<PurchaseRequest[]>("/buy/admin/requests/", {
      method: "GET",
    });
  },

  // Admin: Process purchase request (approve/reject)
  processRequest: async (
    requestId: number,
    data: ProcessRequestData
  ): Promise<ProcessRequestResponse> => {
    return apiRequest<ProcessRequestResponse>(
      `/buy/admin/requests/${requestId}/process/`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },

  // Get user library
  getUserLibrary: async (): Promise<LibraryItem[]> => {
    return apiRequest<LibraryItem[]>("/buy/userlibrary/", {
      method: "GET",
    });
  },
};
