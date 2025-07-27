import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { User, UserProfile, SGETeamMember, InternProfile, UserStatusUpdate, UserMentorUpdate } from '../types/models';

// API endpoints
const USERS_API = '/api/v1/users';

// Types for API requests
interface UpdateUserProfileRequest {
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  job_title?: string;
  organisation?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  current_status?: string;
  skills?: string[];
  interests?: string[];
  social_links?: Record<string, any>;
  is_intern?: boolean;
  mentor_id?: number;
  preferences?: Record<string, any>;
}

// API functions
export const usersApi = {
  // Get current user profile
  getCurrentUserProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get(`${USERS_API}/profile`);
    return response.data;
  },

  // Update current user profile
  updateUserProfile: async (data: UpdateUserProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put(`${USERS_API}/profile`, data);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (status: string): Promise<User> => {
    const response = await apiClient.put(`${USERS_API}/status`, { current_status: status });
    return response.data;
  },

  // Get all team members
  getTeamMembers: async (): Promise<User[]> => {
    const response = await apiClient.get(`${USERS_API}/team`);
    return response.data;
  },

  // Get public user profile
  getPublicUserProfile: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`${USERS_API}/${userId}/public`);
    return response.data;
  },

  // Get SGE team specifically
  getSGETeam: async (): Promise<SGETeamMember[]> => {
    const response = await apiClient.get(`${USERS_API}/sge-team`);
    return response.data;
  },

  // Get interns
  getInterns: async (): Promise<InternProfile[]> => {
    const response = await apiClient.get(`${USERS_API}/interns`);
    return response.data;
  },

  // Update user mentor
  updateUserMentor: async (userId: number, mentorId?: number): Promise<User> => {
    const response = await apiClient.put(`${USERS_API}/${userId}/mentor`, { mentor_id: mentorId });
    return response.data;
  }
};

// React Query hooks
export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: usersApi.getCurrentUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: usersApi.updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['sge-team'] });
      queryClient.invalidateQueries({ queryKey: ['team-members'] });
    },
  });
};

export const useTeamMembers = () => {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: usersApi.getTeamMembers,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePublicUserProfile = (userId: number) => {
  return useQuery({
    queryKey: ['user-public', userId],
    queryFn: () => usersApi.getPublicUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSGETeam = () => {
  return useQuery({
    queryKey: ['sge-team'],
    queryFn: usersApi.getSGETeam,
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent updates for team status)
  });
};

export const useInterns = () => {
  return useQuery({
    queryKey: ['interns'],
    queryFn: usersApi.getInterns,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateUserMentor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, mentorId }: { userId: number; mentorId?: number }) =>
      usersApi.updateUserMentor(userId, mentorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interns'] });
      queryClient.invalidateQueries({ queryKey: ['sge-team'] });
    },
  });
}; 