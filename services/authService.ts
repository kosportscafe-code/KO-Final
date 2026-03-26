const AUTH_KEY = 'kos_admin_auth';

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const login = (password: string): boolean => {
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  if (password === adminPassword) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
