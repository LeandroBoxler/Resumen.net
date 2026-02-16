import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';
import { Input, Button, ErrorMessage } from '../components/common';
import { useAuth } from '../context/AuthContext';
export default function RegisterPage() {
  const navigate = useNavigate();
  const {register} = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Aquí integrarías con tu API de registro
      // const response = await register(formData);
      
      const registered = await register(formData)
      
      // Redirigir después del registro exitoso
      if (!registered) throw new Error('Login failed');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      setError('Error al crear la cuenta. Por favor, intenta nuevamente.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
          <p className="text-gray-600">Regístrate para comenzar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && <ErrorMessage message={error} />}

          <Input
            label="Nombre"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Juan"
            required
            autoComplete="firstName"
          />
          <Input
            label="Apellido"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Pérez"
            required
            autoComplete="lastName"
          />

          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            minLength={6}
            hint="Mínimo 6 caracteres"
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            minLength={6}
          />

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
              <input type="checkbox" required className="w-4 h-4" />
              <span>
                Acepto los{' '}
                <a href="#" className="text-primary hover:text-primary-hover transition-colors">
                  términos y condiciones
                </a>
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" size="large" loading={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary hover:text-primary-hover font-semibold transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
