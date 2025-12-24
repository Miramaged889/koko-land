import { Routes, Route } from "react-router-dom";
import { AdminLayout, PublicLayout } from "./components/layout";
import { MyLibraryPage, PrivacyPage, TermsPage } from "./pages";
import { HomePage, AboutPage, ContactPage } from "./pages/main";
import { BooksPage, BookDetailsPage } from "./pages/books";
import { CreateStoryPage, CheckoutPage } from "./pages/story";
import { LoginPage, RegisterPage, ProfilePage } from "./pages/auth";
import {
  AdminDashboard,
  AdminBooks,
  AdminOrders,
  AdminUsers,
} from "./pages/admin";

function App() {
  return (
    <Routes>
      {/* Auth Routes (without Header/Footer) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public Routes with Header */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<BooksPage />} />
        <Route path="books/:bookId" element={<BookDetailsPage />} />
        <Route path="create" element={<CreateStoryPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="library" element={<MyLibraryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="books" element={<AdminBooks />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

export default App;
