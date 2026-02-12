interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export default function Spinner({ size = 'medium', color }: SpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-20 h-20 border-[6px]',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-gray-200 border-t-primary rounded-full animate-spin`}
      style={color ? { borderTopColor: color } : undefined}
    />
  );
}
