import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, BookOpen } from 'lucide-react';
import { Book } from '../../types';
import { renderStars } from '../../utils';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  showDetails?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onClick,
  onLike,
  isLiked = false,
  showDetails = true
}) => {
  const stars = renderStars(book.rating, 'sm');

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      {/* Book Cover */}
      <div className={`h-48 bg-gradient-to-br ${book.color} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
            {book.emoji}
          </div>
        </div>
        
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white font-reem text-sm">{book.category}</span>
        </div>
        
        {onLike && (
          <div className="absolute top-4 left-4">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:text-red-400 transition-colors"
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current text-red-500' : ''}`} />
            </motion.button>
          </div>
        )}
      </div>

      {/* Book Info */}
      {showDetails && (
        <div className="p-6">
          <h3 className="font-reem font-bold text-xl text-gray-800 mb-2 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          
          <p className="font-tajawal text-gray-600 text-sm mb-4 line-clamp-2">
            {book.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {stars.map((star) => (
                <Star
                  key={star.key}
                  className={star.className}
                />
              ))}
            </div>
            <span className="font-tajawal text-sm text-gray-600 mr-2">
              ({book.rating})
            </span>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-changa font-bold text-primary">
              {book.price} ر.س
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-reem text-sm font-medium flex items-center"
            >
              <BookOpen className="h-4 w-4 ml-2" />
              عرض التفاصيل
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookCard; 