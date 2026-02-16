import { RouteObject } from 'react-router-dom';
import { HomePage, ProductsPage, EditNote, LoginPage, RegisterPage, NewNote } from '../pages';
import { ROUTES } from './constants';
import NoteDetail from '../pages/NoteDetail';

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
    path: ROUTES.NEW_NOTE,
    element: <NewNote />,
  },
  {
    path: ROUTES.NOTE_DETAIL,
    element: <NoteDetail />,
  },
  {
    path: ROUTES.EDIT_NOTE,
    element: <EditNote />,
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
