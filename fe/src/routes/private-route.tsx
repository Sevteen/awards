import { isAuthenticated } from '@services/auth/useAuthenticated';
import { isInRoles } from '@utils/auth';
import { Navigate } from 'react-router-dom';
import { Route } from 'react-router-dom';

interface PrivateRoute {
  roles: number[] | number;
  children: React.ReactElement;
}

export const PrivateRoute: React.FC<PrivateRoute> = ({ roles, children, ...props }) => {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;

  // if (authenticated && !isInRoles(roles)) {
  //   return <Navigate to={'/401'} />;
  // }

  // if (authenticated && !isInRoles(roles)) {
  //   return <Route {...props} />;
  // }
};
