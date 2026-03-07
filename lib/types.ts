export type Role = "student" | "parent" | "instructor" | "staff" | "admin";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  tenantId: string;
  branchId?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  details?: string;
  statusCode: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  instituteCode: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface DeviceTokenPayload {
  token: string;
  platform: "ios" | "android";
  deviceId: string;
}
