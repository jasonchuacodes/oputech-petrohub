import axios from '~/lib/axiosInstance';
import type { CreateUserPayload } from '~/schema/createUserSchema';
import type { UpdateUserPayload } from '~/schema/updateUserSchema';

import type { User } from './user.types';

const getAllUsers = () => {
  return axios.get<User[]>('/users');
};

const getUserById = async (id?: string, tenantId?: string): Promise<User> => {
  const params = tenantId ? { tenantId } : undefined;
  const res = await axios.get(`/users/${id}`, { params });

  return res.data.data.user;
};

const createUser = (data: CreateUserPayload) => {
  return axios.post('/users', data);
};

const updateUser = (id: string, data: UpdateUserPayload, tenantId?: string) => {
  const params = tenantId ? { tenantId } : undefined;
  return axios.put(`/users/${id}`, data, { params });
};

const deleteUser = (id: string) => {
  return axios.delete(`/users/${id}`);
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
