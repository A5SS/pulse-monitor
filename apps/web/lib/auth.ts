import { api } from './api';

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  api.setAccessToken(response.accessToken);
  return response;
}

export async function register(
  email: string,
  password: string,
  role?: string,
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', { email, password, role });
  api.setAccessToken(response.accessToken);
  return response;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    api.setAccessToken(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

