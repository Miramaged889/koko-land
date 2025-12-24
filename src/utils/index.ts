// Date formatting utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Rating utilities
export const renderStars = (
  rating: number,
  size: "sm" | "md" | "lg" = "md"
) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return Array.from({ length: 5 }).map((_, i) => ({
    key: i,
    className: `${sizeClasses[size]} ${
      i < Math.floor(rating) ? "text-accent1 fill-current" : "text-gray-300"
    }`,
  }));
};

// Animation utilities
export const getAnimationDelay = (
  index: number,
  baseDelay: number = 0.1
): number => {
  return index * baseDelay;
};

// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

// File upload utilities
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "نوع الملف غير مدعوم. يرجى رفع صورة بصيغة JPG أو PNG أو GIF",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت",
    };
  }

  return { isValid: true };
};

// Price formatting utilities
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `${numPrice.toFixed(2)} ر.س`;
};

export const calculateTax = (
  subtotal: number,
  taxRate: number = 0.15
): number => {
  return subtotal * taxRate;
};

// Progress utilities
export const getProgressPercentage = (
  current: number,
  total: number
): number => {
  return Math.round((current / total) * 100);
};

// Status utilities
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "processing":
      return "text-yellow-600 bg-yellow-100";
    case "ready":
      return "text-green-600 bg-green-100";
    case "downloaded":
      return "text-blue-600 bg-blue-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "processing":
      return "قيد المعالجة";
    case "ready":
      return "جاهز للتحميل";
    case "downloaded":
      return "تم التحميل";
    default:
      return "غير محدد";
  }
};

// Local storage utilities
export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
};

// Scroll utilities
export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Debounce utility
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
