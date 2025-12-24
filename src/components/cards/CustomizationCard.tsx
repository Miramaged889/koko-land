import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookCustomization } from "../../services/api";
import { bookApi } from "../../services/api";
import Button from "../ui/Button";
import { Download, Trash2, BookOpen, User, Calendar, Loader2 } from "lucide-react";

interface CustomizationCardProps {
  customization: BookCustomization;
  onDelete: (id: number) => void;
  deleteLoading: boolean;
}

const CustomizationCard: React.FC<CustomizationCardProps> = ({
  customization,
  onDelete,
  deleteLoading,
}) => {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [childImageUrl, setChildImageUrl] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoadingImages(true);
        const [coverBlob, childBlob] = await Promise.all([
          bookApi.getBookCover(customization.book.id),
          bookApi.getChildImage(customization.id),
        ]);

        const coverUrl = URL.createObjectURL(coverBlob);
        const childUrl = URL.createObjectURL(childBlob);

        setCoverImageUrl(coverUrl);
        setChildImageUrl(childUrl);
      } catch (error) {
        console.error("Failed to load images:", error);
      } finally {
        setLoadingImages(false);
      }
    };

    loadImages();

    return () => {
      if (coverImageUrl) URL.revokeObjectURL(coverImageUrl);
      if (childImageUrl) URL.revokeObjectURL(childImageUrl);
    };
  }, [customization.id, customization.book.id]);

  const handleDownload = async () => {
    try {
      const blob = await bookApi.getCustomBookFile(customization.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${customization.book.title}_${customization.child_name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert("فشل تحميل الكتاب المخصص");
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `هل أنت متأكد من حذف الكتاب المخصص "${customization.book.title}" للطفل "${customization.child_name}"؟`
      )
    ) {
      onDelete(customization.id);
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
        {loadingImages ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={customization.book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="text-gray-400" size={48} />
          </div>
        )}
        {/* Child Image Overlay */}
        {childImageUrl && !loadingImages && (
          <div className="absolute bottom-2 left-2 w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={childImageUrl}
              alt={customization.child_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-reem font-bold text-lg text-gray-800 mb-2">
          {customization.book.title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <User size={16} className="text-primary" />
          <span className="font-tajawal text-sm text-gray-600">
            {customization.child_name} ({customization.child_age} سنوات)
          </span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-gray-400" />
          <span className="font-tajawal text-xs text-gray-500">
            {new Date(customization.created_at).toLocaleDateString("ar-SA")}
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
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            icon={
              deleteLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )
            }
          >
            حذف
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomizationCard;

