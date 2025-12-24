import React from "react";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  padding?: "sm" | "md" | "lg";
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  maxWidth = "7xl",
  padding = "md",
}) => {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
  };

  const paddingClasses = {
    sm: "px-4 py-8",
    md: "px-4 sm:px-6 lg:px-8 py-8",
    lg: "px-4 sm:px-6 lg:px-8 py-16",
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-background to-white ${paddingClasses[padding]}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${maxWidthClasses[maxWidth]} mx-auto ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PageContainer;
