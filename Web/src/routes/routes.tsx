import { RouteObject } from 'react-router-dom';
import { HomePage, ProductsPage, ProductDetailPage, LoginPage, RegisterPage } from '../pages';
import { ROUTES } from './constants';

export const routes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.NOTES,
    element: <ProductsPage />,
  },
  {
    path: ROUTES.NOTE_DETAIL,
    element: <ProductDetailPage />,
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTES.REGISTER,
    element: <RegisterPage />,
  },
];
