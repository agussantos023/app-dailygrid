export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  ticket_balance: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}
