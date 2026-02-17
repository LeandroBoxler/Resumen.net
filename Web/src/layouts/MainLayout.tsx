import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common';

export default function MainLayout() {
  const {profile, logout} = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Resumenes.com</h1>
          <div className="flex gap-6 items-center">
            <Link to={ROUTES.NOTES} className="text-gray-600 hover:text-primary transition-colors font-medium">
              Inicio
            </Link>
            
            {profile ? 
            <>
              <Link to={ROUTES.PROFILE} className="text-gray-600 hover:text-primary transition-colors font-medium">
                Mi Perfil
              </Link>
              <p className="text-gray-600 hover:text-gray-800 transition-colors">
                Bienvenido, {profile.firstName}
              </p>
              <Button onClick={logout}
                className="bg-primary text-white px-2 py-1 rounded-lg hover:bg-primary-hover transition-colors font-medium"
              >
                Cerrar sesion
              </Button>
            </> : <>
              <Link to={ROUTES.LOGIN} className="text-gray-600 hover:text-gray-800 transition-colors">
                Iniciar Sesión
              </Link>
              <Link 
                to={ROUTES.REGISTER} 
                className="bg-primary text-white px-2 py-1 rounded-lg hover:bg-primary-hover transition-colors font-medium"
              >
                Registrarse
              </Link>
            </>
          }
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
