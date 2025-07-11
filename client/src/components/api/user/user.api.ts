import axios from '~/lib/axiosInstance';
import type { RegisterUserInput } from '~/schema/RegisterUserSchema';
import type { User } from './user.types';

const getAllUsers = () => {
  return axios.get<User[]>('/users');
};

const getUserById = (id: number) => {
  return axios.get<User>(`/users/${id}`);
};

const createUser = (data: RegisterUserInput) => {
  return axios.post('/users', data);
};

export { getAllUsers, getUserById, createUser };
