export const isAuthenticated = () => {
  const snid = JSON.parse(localStorage.getItem('__SNID__') as string);
  if (snid) {
    return Boolean(snid.token);
  }
  return false;
};
