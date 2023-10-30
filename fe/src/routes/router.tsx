import Login from '@pages/auth/Login';
import Home from '@pages/home/Home';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from './private-route';
import { isAuthenticated } from '@services/auth/useAuthenticated';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { path: '', element: <Navigate to={isAuthenticated() ? 'home' : 'login'} replace /> },
      {
        path: 'login',
        element: isAuthenticated() ? <Navigate to={'/home'} /> : <Login />,
      },
      {
        path: 'home',
        element: (
          <PrivateRoute roles={[]}>
            <Home />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
