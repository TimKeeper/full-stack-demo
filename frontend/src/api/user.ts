import request from "../utils/request";

export interface User {
  id: number;
  username: string;
  nickname?: string;
  created_at: string;
}

export interface CreateUserDto {
  username: string;
  nickname?: string;
  password?: string;
}

export const getUsers = () => {
  return request.get<User[]>("/users") as unknown as Promise<User[]>;
};

export const createUser = (data: CreateUserDto) => {
  return request.post<User>("/users", data) as unknown as Promise<User>;
};


export interface LoginDto {
  username: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const login = (data: LoginDto) => {
  return request.post<LoginResponse>("/auth/login", data) as unknown as Promise<LoginResponse>;
};

export const deleteUser = (id: number) => {
  return request.delete<void>(`/users/${id}`) as unknown as Promise<void>;
};
