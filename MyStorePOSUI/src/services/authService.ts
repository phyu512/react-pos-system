import axiosInstance from '../api/axiosInstance';

// Define the shape of your .NET User for TypeScript
export interface UserProfile {
  email: string;
  fullName: string;
  roles: string[];
}

// Interface for Register data
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<any> => {
    // Axios will automatically throw an error if status is 401
    const response = await axiosInstance.post('/Account/login', credentials);
    return response.data;
  },

  // --- NEW: REGISTER METHOD ---
  register: async (data: RegisterData): Promise<void> => {
    // This calls your .NET [HttpPost("register")] endpoint
    await axiosInstance.post('/Account/register', data);
  },

  // --- FORGOT PASSWORD METHOD ---
  forgotPassword: async (email: string): Promise<void> => {
    await axiosInstance.post('/Account/forgot-password', { email });
  },

  // --- RESET PASSWORD METHOD ---
  resetPassword: async (data: { email: string; token: string; newPassword: string; confirmPassword: string }): Promise<void> => {
    await axiosInstance.post('/Account/reset-password', data);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: (): UserProfile | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};