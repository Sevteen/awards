import { Session } from './session';

export function isInRoles(idRole: number | number[]): boolean {
  const session = new Session();
  const user = session.getCurrentUser();

  if (!user) {
    return false;
  }

  if (user.roles && user.roles.some((r) => r === -1)) {
    //admin role
    return true;
  }

  if (Array.isArray(idRole)) {
    return idRole.some((roleId) => {
      return user.roles.some((r) => r === roleId);
    });
  } else {
    return user.roles.some((r) => r === idRole);
  }
}
