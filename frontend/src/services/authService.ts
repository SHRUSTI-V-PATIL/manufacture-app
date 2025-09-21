import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

class AuthService {
  // Mock users for local development
  private mockUsers = [
    { 
      id: '1', 
      email: 'admin@example.com', 
      password: 'admin123', 
      firstName: 'Admin', 
      lastName: 'User', 
      role: 'admin',
      department: 'Management'
    },
    { 
      id: '2', 
      email: 'user@example.com', 
      password: 'user123', 
      firstName: 'Regular', 
      lastName: 'User', 
      role: 'user',
      department: 'Production'
    },
    { 
      id: '3', 
      email: 'manager@example.com', 
      password: 'manager123', 
      firstName: 'Manager', 
      lastName: 'User', 
      role: 'manager',
      department: 'Operations'
    }
  ];

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Try mock authentication first
      const mockUser = this.mockUsers.find(
        user => user.email === credentials.email && user.password === credentials.password
      );

      if (mockUser) {
        const token = `mock-token-${Date.now()}`;
        const user: User = {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
          department: mockUser.department,
          lastLogin: new Date().toISOString()
        };

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));

        return {
          success: true,
          user,
          token,
          message: 'Login successful'
        };
      }

      // Fallback to API call if mock user not found
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // First try to get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }

      // Fallback to API call
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      return null;
    }
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email'
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password: newPassword
      });
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      };
    }
  }
}

export default new AuthService();
