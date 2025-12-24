import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CallToActionProps {
  title: string;
  subtitle: string;
  primaryAction: {
    label: string;
    page: string;
    variant?: 'primary' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    page: string;
  };
  className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  className = ''
}) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`text-center mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 ${className}`}
    >
      <h2 className="text-2xl md:text-3xl font-changa font-bold text-primary mb-4">
        {title}
      </h2>
      
      <p className="font-reem text-gray-600 mb-6 max-w-2xl mx-auto">
        {subtitle}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(primaryAction.page)}
          className={`px-8 py-4 rounded-full font-reem text-lg font-semibold shadow-lg ${
            primaryAction.variant === 'secondary'
              ? 'bg-gradient-to-r from-accent2 to-secondary text-white'
              : 'bg-gradient-to-r from-primary to-secondary text-white'
          }`}
        >
          {primaryAction.label}
        </motion.button>
        
        {secondaryAction && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(secondaryAction.page)}
            className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-full font-reem text-lg font-semibold hover:bg-primary hover:text-white transition-all"
          >
            {secondaryAction.label}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default CallToAction; 