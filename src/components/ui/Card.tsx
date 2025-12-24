import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
  padding = 'md',
  shadow = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    sm: 'shadow',
    md: 'shadow-lg',
    lg: 'shadow-xl'
  };
  
  const baseClasses = `bg-white rounded-3xl ${paddingClasses[padding]} ${shadowClasses[shadow]} transition-all`;
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;
  
  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02, y: -5 },
    whileTap: { scale: 0.98 }
  } : {};
  
  return (
    <Component
      className={classes}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card; 