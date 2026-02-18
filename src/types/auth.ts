export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User';
}

export interface AuthTokens {
  sessionToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  sessionToken: string;
  refreshToken: string;
  expiresIn: string;
  message: string;
}

export interface RefreshResponse {
  sessionToken: string;
  refreshToken: string;
  expiresIn: string;
  message: string;
}
