import Spinner from './Spinner';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size="large" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
