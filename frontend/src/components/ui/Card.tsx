import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        'glass-effect rounded-2xl p-6 border border-dark-700',
        hover && 'transition-all duration-200 hover:border-primary-500/50',
        className
      )}
    >
      {children}
    </motion.div>
  );
};