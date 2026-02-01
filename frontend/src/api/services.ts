// services.ts
import apiClient from './client';
import type { AxiosResponse } from 'axios';

/* -----------------------------
   Types
------------------------------ */

export interface HealthResponse {
  status: string;
  message: string;
}

export interface AnalyzeRequest {
  user_message: string;
  user_settings?: Record<string, unknown>;
}

export interface AnalyzeResponse {
  tasks: string[];
  time: string;
  mood: string;
}

/* ✅ AUTH TYPES */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  mdp: string;
  name: string;
  filepath: string;
}

export interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  filepath?: string;
  creatureid?: string;
  nb_tasks_completed?: number;
  tasks?: string[];
}

export interface AuthResponse {
  message?: string;
  user?: AuthUser;
  token?: string;
}

/* ✅ BACKEND TASK GENERATION TYPES */
export interface GenerateTasksRequest {
  user_id: string;
  context: string;
  time: number;
  mood: string;
  energy_level: string;
}

export interface GenerateTasksResponse {
  tasks: string[];
}

/* ✅ TASK VERIFICATION TYPES (PHOTO UPLOAD) */
export interface VerifyTaskRequest {
  user_id: string;
  task: string;
  file: File;
}

export interface VerifyTaskResponse {
  verified: boolean;
  message?: string;
}

/* -----------------------------
   Services
------------------------------ */

export const healthService = {
  check: async (): Promise<HealthResponse> => {
    const response: AxiosResponse<HealthResponse> =
      await apiClient.get('/api/health');
    return response.data;
  },
};

export const geminiService = {
  // ✅ kept as-is in case you still use it somewhere
  analyzeText: async (data: AnalyzeRequest): Promise<AnalyzeResponse> => {
    const response: AxiosResponse<AnalyzeResponse> = await apiClient.post(
      '/api/analyze',
      data
    );
    return response.data;
  },
};

/* ✅ AUTH SERVICE (LOGIN + REGISTER) */
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // ✅ using mdp because your backend uses mdp
    const payload = { email: data.email, mdp: data.password };

    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      '/users/login',
      payload
    );
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await apiClient.post(
      '/users/register',
      data
    );
    return response.data;
  },
};

/* ✅ TASKS SERVICE (GENERATE MICRO-TASKS) */
export const tasksService = {
  generate: async (
    data: GenerateTasksRequest
  ): Promise<GenerateTasksResponse> => {
    const response: AxiosResponse<GenerateTasksResponse> = await apiClient.post(
      '/tasks/generate',
      data
    );
    return response.data;
  },
};

/* ✅ VERIFY SERVICE (UPLOAD PHOTO + VERIFY TASK) */
export const verifyService = {
  verify: async (data: VerifyTaskRequest): Promise<VerifyTaskResponse> => {
    const formData = new FormData();
    formData.append('user_id', data.user_id);
    formData.append('task', data.task);
    formData.append('file', data.file);

    const response: AxiosResponse<VerifyTaskResponse> = await apiClient.post(
      '/tasks/validate',
      formData,
      {
        headers: {
          // important for file upload
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};

// Example service structure - add your own services here
export const exampleService = {
  getItems: async () => {
    const response = await apiClient.get('/items');
    return response.data;
  },

  createItem: async (data: unknown) => {
    const response = await apiClient.post('/items', data);
    return response.data;
  },

  updateItem: async (id: string, data: unknown) => {
    const response = await apiClient.put(`/items/${id}`, data);
    return response.data;
  },

  deleteItem: async (id: string) => {
    const response = await apiClient.delete(`/items/${id}`);
    return response.data;
  },
};
