import axiosInstance from '../api/axiosInstance';

// Define the interface to match your form state
export interface UserFormData {
  fullName: string;
  email: string;
  password?: string;
  role: string;
  staffPin?: string;
  outletIds: string[];
}

export const userService = {
  // Existing functions
  fetchAllUsers: async () => {
    const response = await axiosInstance.get('/Users');
    return response.data;
  },

  fetchRoles: async () => {
    const response = await axiosInstance.get('/Roles');
    return response.data;
  },

  fetchOutlets: async () => {
    const response = await axiosInstance.get('/Outlets');
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await axiosInstance.get(`/Users/${id}`);
    return response.data;
  },

  // Create & Update with proper transformation for UserOutlets
  create: async (data: UserFormData) => {
    const payload = {
      ...data,
      // Map flat ID array to required object structure
      userOutlets: data.outletIds.map(id => ({ outletId: id }))
    };
    return await axiosInstance.post('/Users', payload);
  },

  update: async (id: string, data: UserFormData) => {
      // 1. Start with the raw data
      const payload: any = { ...data };
      
      // 2. Clean sensitive fields
      if (!payload.password) delete payload.password;
      if (!payload.staffPin) delete payload.staffPin;
      
      // 3. DO NOT delete outletIds. 
      // The backend UserDto NEEDS this field to be present.
      // Also, ensure the key matches the C# property name exactly (OutletIds)
      payload.OutletIds = data.outletIds;

      return await axiosInstance.put(`/Users/${id}`, payload);
  }
};