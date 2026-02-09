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

export const deleteUser = (id: number) => {
  return request.delete<void>(`/users/${id}`) as unknown as Promise<void>;
};
