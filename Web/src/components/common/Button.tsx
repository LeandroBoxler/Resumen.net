import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  loading = false,
  children,
  icon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'flex items-center justify-center gap-2 border-none rounded-lg font-semibold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30',
    secondary: 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800',
    danger: 'bg-gray-100 text-danger hover:bg-danger hover:text-white hover:-translate-y-0.5',
    ghost: 'bg-transparent text-primary border border-primary hover:bg-primary/10',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size="small" color={variant === 'primary' ? '#fff' : undefined} />
          {children}
        </>
      ) : (
        <>
          {icon && <span className="flex items-center [&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
