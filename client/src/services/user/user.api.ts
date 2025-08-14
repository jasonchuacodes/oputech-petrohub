import axios from '~/lib/axiosInstance';
import type { CreateUserPayload } from '~/schema/createUserSchema';
import type { UpdateUserPayload } from '~/schema/updateUserSchema';

import type { User } from './user.types';

const getAllUsers = () => {
  return axios.get<User[]>('/users');
};

const getUserById = (id: string) => {
  return axios.get<User>(`/users/${id}`);
};

const createUser = (data: CreateUserPayload) => {
  return axios.post('/users', data);
};

const updateUser = (id: string, data: UpdateUserPayload) => {
  return axios.put(`/users/${id}`, data);
};

const deleteUser = (id: string) => {
  return axios.delete(`/users/${id}`);
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
