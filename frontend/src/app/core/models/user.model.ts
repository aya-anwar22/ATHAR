export interface Address {
  label: string;
  details: string;
  _id?: string;
}

export interface User {
  _id: string;
  userName: string;
  email: string;
  isVerified: boolean;
  phoneNumber?: string | null;
  role: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userName: string;
  email: string;
  password?: string;
  phoneNumber?: string | null;
  addresses: Address[];
}
export interface PaginatedUserGroup {
  total: number;
  currentPage: number;
  totalPages: number;
  users: User[];
}

export interface UsersApiResponse {
  activeUsers: PaginatedUserGroup;
  deletedUsers: PaginatedUserGroup;
}
