import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-5xl font-bold text-gray-800 mb-4">Bienvenido a Resumenes.com</h2>
      <p className="text-xl text-gray-600 mb-8">Tu plataforma de resúmenes de estudio.</p>
      <Link 
        to={ROUTES.NOTES} 
        className="inline-block bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-hover transition-colors font-semibold text-lg hover:-translate-y-0.5 hover:shadow-lg"
      >
        Ver Resúmenes
      </Link>
    </div>
  );
}
