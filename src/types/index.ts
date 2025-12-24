// Navigation Types
export interface NavigationProps {
  onNavigate: (page: string, id?: string) => void;
}

export interface PageProps extends NavigationProps {
  currentPage?: string;
  bookId?: string;
}

// Book Types
export interface Book {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  price: string;
  rating: number;
  reviewsCount?: number;
  color: string;
  emoji: string;
  category: string;
  ageGroup?: string;
  readingTime?: string;
  features?: string[];
  samplePages?: string[];
}

// Story Creation Types
export interface StoryFormData {
  childName: string;
  selectedAge: string;
  selectedTheme: string;
  hasImage: boolean;
}

export interface Theme {
  id: string;
  title: string;
  emoji: string;
  color: string;
}

export interface AgeGroup {
  value: string;
  label: string;
}

// Contact Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactInfo {
  icon: any;
  title: string;
  value: string;
  description: string;
  color: string;
}

// Checkout Types
export interface OrderItem {
  id: number;
  title: string;
  price: number;
  type: string;
  features: string[];
}

export interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}

// Library Types
export interface LibraryItem {
  id: string;
  title: string;
  status: "processing" | "ready" | "downloaded";
  createdAt: string;
  updatedAt: string;
  progress?: number;
}

// Team Member Types
export interface TeamMember {
  name: string;
  role: string;
  emoji: string;
  description: string;
}

// Achievement Types
export interface Achievement {
  number: string;
  label: string;
  icon: string;
}

// Value Types
export interface Value {
  icon: any;
  title: string;
  description: string;
  color: string;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive" | "banned";
}
