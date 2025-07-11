import React from 'react';
import { cn } from '../../lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className,
  hover = true,
  gradient = false
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        gradient && "bg-gradient-to-br from-white to-gray-50",
        className
      )}
    >
      {children}
    </div>
  );
};

interface EnhancedCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const EnhancedCardHeader: React.FC<EnhancedCardHeaderProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("p-6 pb-4", className)}>
      {children}
    </div>
  );
};

interface EnhancedCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const EnhancedCardContent: React.FC<EnhancedCardContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("px-6 pb-6", className)}>
      {children}
    </div>
  );
};

interface EnhancedCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const EnhancedCardFooter: React.FC<EnhancedCardFooterProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("px-6 py-4 bg-gray-50 border-t border-gray-100", className)}>
      {children}
    </div>
  );
};
