import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Loader2,
  AlertCircle,
  BookOpen,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  listBooks,
  addBook,
  updateBook,
  deleteBook,
  searchBooks,
  clearError,
} from "../../store/slices/bookSlice";
import {
  Book,
  AddBookRequest,
  UpdateBookRequest,
  bookApi,
} from "../../services/api";

const AdminBooks: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    books,
    loading,
    error,
    addBookLoading,
    updateBookLoading,
    deleteBookLoading,
  } = useAppSelector((state) => state.books);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    char_name: "",
    price: "",
    category: "",
    age: "",
    gender: "unisex",
    rate: "",
    description: "",
  });
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [coverImages, setCoverImages] = useState<Record<number, string>>({});
  const [loadingCovers, setLoadingCovers] = useState<Record<number, boolean>>(
    {}
  );
  const modalRef = useRef<HTMLDivElement>(null);

  // Load books on mount
  useEffect(() => {
    dispatch(listBooks());
  }, [dispatch]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(
          searchBooks({
            title: searchTerm,
          })
        );
      } else {
        dispatch(listBooks());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Load cover images
  useEffect(() => {
    const loadCoverImages = async () => {
      for (const book of books) {
        if (!coverImages[book.id] && !loadingCovers[book.id]) {
          setLoadingCovers((prev) => ({ ...prev, [book.id]: true }));
          try {
            const blob = await bookApi.getBookCover(book.id);
            const url = URL.createObjectURL(blob);
            setCoverImages((prev) => ({ ...prev, [book.id]: url }));
          } catch (error) {
            console.error(`Failed to load cover for book ${book.id}:`, error);
          } finally {
            setLoadingCovers((prev) => ({ ...prev, [book.id]: false }));
          }
        }
      }
    };

    if (books.length > 0) {
      loadCoverImages();
    }

    // Cleanup URLs on unmount
    return () => {
      Object.values(coverImages).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleAddBook = () => {
    setEditingBook(null);
    setFormData({
      title: "",
      char_name: "",
      price: "",
      category: "",
      age: "",
      gender: "unisex",
      rate: "",
      description: "",
    });
    setBookFile(null);
    setCoverImage(null);
    setCoverImagePreview(null);
    setShowModal(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      char_name: book.char_name,
      price: book.price.toString(),
      category: book.category,
      age: book.age,
      gender: book.gender,
      rate: book.rate.toString(),
      description: book.description,
    });
    setBookFile(null);
    setCoverImage(null);
    // Set preview from URL if editing
    if (book.cover_image) {
      setCoverImagePreview(book.cover_image);
    }
    setShowModal(true);
  };

  const handleDeleteBook = async (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الكتاب؟")) {
      try {
        await dispatch(deleteBook(id)).unwrap();
        alert("تم حذف الكتاب بنجاح");
      } catch (err: unknown) {
        alert((err as Error).message || "فشل حذف الكتاب");
      }
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "book" | "cover"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "book") {
        setBookFile(file);
      } else {
        setCoverImage(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingBook) {
      // Update book
      if (
        !formData.title.trim() ||
        !formData.char_name.trim() ||
        !formData.price.trim() ||
        !formData.category.trim() ||
        !formData.age.trim() ||
        !formData.rate.trim() ||
        !formData.description.trim()
      ) {
        alert("جميع الحقول مطلوبة");
        return;
      }

      const updateData: UpdateBookRequest = {
        title: formData.title.trim(),
        char_name: formData.char_name.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        age: formData.age.trim(),
        gender: formData.gender,
        rate: parseFloat(formData.rate),
        description: formData.description.trim(),
      };

      try {
        await dispatch(
          updateBook({ id: editingBook.id, data: updateData })
        ).unwrap();
        alert("تم تحديث الكتاب بنجاح");
        setShowModal(false);
        dispatch(listBooks());
      } catch (err: unknown) {
        alert((err as Error).message || "فشل تحديث الكتاب");
      }
    } else {
      // Add book
      if (
        !formData.title.trim() ||
        !formData.char_name.trim() ||
        !formData.price.trim() ||
        !formData.category.trim() ||
        !formData.age.trim() ||
        !formData.rate.trim() ||
        !formData.description.trim() ||
        !bookFile ||
        !coverImage
      ) {
        alert("جميع الحقول والملفات مطلوبة");
        return;
      }

      const addData: AddBookRequest = {
        title: formData.title.trim(),
        char_name: formData.char_name.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim(),
        age: formData.age.trim(),
        gender: formData.gender,
        rate: parseFloat(formData.rate),
        description: formData.description.trim(),
        book_file: bookFile,
        cover_image: coverImage,
      };

      try {
        await dispatch(addBook(addData)).unwrap();
        alert("تم إضافة الكتاب بنجاح");
        setShowModal(false);
        dispatch(listBooks());
      } catch (err: unknown) {
        alert((err as Error).message || "فشل إضافة الكتاب");
      }
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.char_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-reem font-bold text-gray-800 mb-2">
            إدارة الكتب
          </h1>
          <p className="text-gray-600 font-tajawal">
            إدارة وإضافة وتعديل الكتب المتاحة
          </p>
        </div>
        <Button onClick={handleAddBook} icon={<Plus />}>
          إضافة كتاب جديد
        </Button>
      </motion.div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="ابحث عن كتاب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-12"
          />
        </div>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-600 font-tajawal text-sm">{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="mr-auto text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
          <span className="mr-3 font-tajawal text-gray-600">
            جاري التحميل...
          </span>
        </div>
      )}

      {/* Books Grid */}
      {!loading && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-shadow">
                {/* Cover Image */}
                <div className="w-full h-48 rounded-xl bg-gray-100 mb-4 overflow-hidden flex items-center justify-center relative">
                  {loadingCovers[book.id] ? (
                    <Loader2 className="animate-spin text-primary" size={32} />
                  ) : coverImages[book.id] ? (
                    <img
                      src={coverImages[book.id]}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="text-gray-400" size={48} />
                  )}
                </div>
                <h3 className="text-xl font-reem font-bold text-gray-800 mb-2">
                  {book.title}
                </h3>
                <p className="text-gray-600 font-tajawal text-sm mb-2">
                  الشخصية: {book.char_name}
                </p>
                <p className="text-gray-600 font-tajawal text-sm mb-4 line-clamp-2">
                  {book.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-primary font-reem font-bold text-lg">
                    {book.price} ر.س
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-tajawal">
                      {book.category}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-tajawal">
                      {book.age} | {book.gender}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(book.rate)
                            ? "text-accent1"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 font-tajawal text-sm">
                    ({book.rate})
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBook(book)}
                    className="flex-1"
                    icon={<Edit size={16} />}
                  >
                    تعديل
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBook(book.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                    icon={
                      deleteBookLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Trash2 size={16} />
                      )
                    }
                    disabled={deleteBookLoading}
                  >
                    حذف
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBooks.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-gray-400" size={24} />
          </div>
          <p className="font-tajawal text-gray-600 text-lg">
            {searchTerm ? "لم يتم العثور على كتب" : "لا توجد كتب"}
          </p>
          {!searchTerm && (
            <p className="font-tajawal text-gray-400 text-sm mt-2">
              اضغط على "إضافة كتاب جديد" لإضافة كتاب جديد
            </p>
          )}
        </Card>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-reem font-bold text-gray-800">
                  {editingBook ? "تعديل الكتاب" : "إضافة كتاب جديد"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveBook} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="عنوان الكتاب"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="أدخل عنوان الكتاب"
                    required
                  />
                  <Input
                    label="اسم الشخصية"
                    value={formData.char_name}
                    onChange={(e) =>
                      setFormData({ ...formData, char_name: e.target.value })
                    }
                    placeholder="أدخل اسم الشخصية"
                    required
                  />
                </div>

                <Input
                  label="الوصف"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="أدخل وصف الكتاب"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="السعر"
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                  <Input
                    label="التقييم"
                    type="number"
                    value={formData.rate}
                    onChange={(e) =>
                      setFormData({ ...formData, rate: e.target.value })
                    }
                    placeholder="0.0"
                    required
                  />
                  <Input
                    label="العمر"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="5-7"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="الفئة"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="مغامرات"
                    required
                  />
                  <div>
                    <label className="block text-sm font-tajawal font-medium text-gray-700 mb-2">
                      الجنس
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="unisex">unisex</option>
                      <option value="male">male</option>
                      <option value="female">female</option>
                    </select>
                  </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-tajawal font-medium text-gray-700 mb-2">
                      ملف الكتاب (PDF){" "}
                      {!editingBook && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, "book")}
                        className="hidden"
                        id="book-file"
                        required={!editingBook}
                      />
                      <label
                        htmlFor="book-file"
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors"
                      >
                        <FileText size={20} className="text-gray-400" />
                        <span className="font-tajawal text-sm text-gray-600">
                          {bookFile ? bookFile.name : "اختر ملف PDF"}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-tajawal font-medium text-gray-700 mb-2">
                      صورة الغلاف{" "}
                      {!editingBook && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "cover")}
                        className="hidden"
                        id="cover-image"
                        required={!editingBook}
                      />
                      <label
                        htmlFor="cover-image"
                        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors"
                      >
                        <ImageIcon size={20} className="text-gray-400" />
                        <span className="font-tajawal text-sm text-gray-600">
                          {coverImage ? coverImage.name : "اختر صورة"}
                        </span>
                      </label>
                      {coverImagePreview && (
                        <img
                          src={coverImagePreview}
                          alt="Cover preview"
                          className="mt-2 w-full h-32 object-cover rounded-xl"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1"
                    icon={<X size={16} />}
                  >
                    إلغاء
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={editingBook ? updateBookLoading : addBookLoading}
                    icon={
                      editingBook ? (
                        updateBookLoading ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <Edit size={16} />
                        )
                      ) : addBookLoading ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Plus size={16} />
                      )
                    }
                    className="flex-1"
                  >
                    {editingBook
                      ? updateBookLoading
                        ? "جاري الحفظ..."
                        : "حفظ التعديلات"
                      : addBookLoading
                      ? "جاري الإضافة..."
                      : "إضافة الكتاب"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBooks;
