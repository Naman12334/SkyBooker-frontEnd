export interface User {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  role: 'PASSENGER' | 'AIRLINE_STAFF' | 'ADMIN';
  provider: 'LOCAL' | 'GOOGLE';
  isActive: boolean;
  passportNumber?: string;
  nationality?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
