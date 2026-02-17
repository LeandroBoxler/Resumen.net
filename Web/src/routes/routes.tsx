import { RouteObject } from 'react-router-dom';
import {  ProductsPage, EditNote, LoginPage, RegisterPage, NewNote, ProfilePage } from '../pages';
import { ROUTES } from './constants';
import ProtectedRoute from '../context/ProtectedRoute';
import NoteDetail from '../pages/NoteDetail';
import EditProfilePage from '../pages/EditProfilePage';

export const routes: RouteObject[] = [
   {
    path: ROUTES.NOTES,
    element: <ProductsPage/>,
  },
  {
    path: ROUTES.NEW_NOTE,
    element: <ProtectedRoute><NewNote /></ProtectedRoute>,
  },
  {
    path: ROUTES.NOTE_DETAIL,
    element: <NoteDetail />,
  },
  {
    path: ROUTES.EDIT_NOTE,
    element: <ProtectedRoute><EditNote/></ProtectedRoute>,
  },
  {
    path: ROUTES.LOGIN,
    element: <ProtectedRoute login={false}><LoginPage /></ProtectedRoute>,
  },
  {
    path: ROUTES.REGISTER,
    element: <ProtectedRoute login={false}><RegisterPage /></ProtectedRoute>,
  },
  {
    path: ROUTES.PROFILE,
    element: <ProtectedRoute><ProfilePage/></ProtectedRoute>,
  },
  {
    path : ROUTES.EDIT_PROFILE,
    element: <ProtectedRoute><EditProfilePage/></ProtectedRoute>,
  }
];
