import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LibraryItem } from "../../services/api";
import { bookApi } from "../../services/api";
import Button from "../ui/Button";
import { Download, BookOpen, Loader2, Calendar } from "lucide-react";

interface LibraryCardProps {
  libraryItem: LibraryItem;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ libraryItem }) => {
  const navigate = useNavigate();
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const loadCoverImage = async () => {
      try {
        setLoadingImage(true);
        const coverBlob = await bookApi.getBookCover(libraryItem.book.id);
        const coverUrl = URL.createObjectURL(coverBlob);
        setCoverImageUrl(coverUrl);
      } catch (error) {
        console.error("Failed to load cover image:", error);
      } finally {
        setLoadingImage(false);
      }
    };

    loadCoverImage();

    return () => {
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
    };
  }, [libraryItem.book.id]);

  const handleDownload = async () => {
    try {
      const blob = await bookApi.getBookFile(libraryItem.book.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${libraryItem.book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("فشل تحميل الكتاب");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Cover Image */}
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        {loadingImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={libraryItem.book.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => navigate(`/books/${libraryItem.book.id}`)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="text-gray-400" size={48} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-reem font-bold text-lg text-gray-800 mb-2 cursor-pointer hover:text-primary transition-colors"
          onClick={() => navigate(`/books/${libraryItem.book.id}`)}
        >
          {libraryItem.book.title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-tajawal text-sm text-gray-600">
            {libraryItem.book.category}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-primary font-changa font-bold">
            {libraryItem.book.price} ر.س
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-gray-400" />
          <span className="font-tajawal text-xs text-gray-500">
            أضيف في: {new Date(libraryItem.added_at).toLocaleDateString("ar-SA")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            className="flex-1"
            icon={<Download size={16} />}
          >
            تحميل
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/books/${libraryItem.book.id}`)}
            className="flex-1"
            icon={<BookOpen size={16} />}
          >
            عرض
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LibraryCard;

