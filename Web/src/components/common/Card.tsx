import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all ${
        hover ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
