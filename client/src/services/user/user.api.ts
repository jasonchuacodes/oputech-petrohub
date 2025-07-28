import axios from '~/lib/axiosInstance';
import type { CreateUserPayload } from '~/schema/createUserSchema';

import type { User } from './user.types';

const getAllUsers = () => {
  return axios.get<User[]>('/users');
};

const getUserById = (id: number) => {
  return axios.get<User>(`/users/${id}`);
};

const createUser = (data: CreateUserPayload) => {
  return axios.post('/users', data);
};

export { getAllUsers, getUserById, createUser };
