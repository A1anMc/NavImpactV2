import api from './api';

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  full_name?: string;
  is_active?: boolean;
}

export const usersService = {
  // Get all users
  async getAllUsers(skip = 0, limit = 100): Promise<User[]> {
    const response = await api.get<User[]>('/users/', { params: { skip, limit } });
    return response.data;
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/users/', userData);
    return response.data;
  },

  // Update user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user
  async deleteUser(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  }
}; 