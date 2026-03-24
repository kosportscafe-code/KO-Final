const AUTH_KEY = 'kos_admin_auth';

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const login = (password: string): boolean => {
  if (password === 'admin123') { // Simple hardcoded auth for demo
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
