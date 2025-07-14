import axios from '~/lib/axiosInstance';
import type { User } from '~/services/user/user.types';
import type { LoginUserInput } from '~/schema/loginUserSchema';
import type { RegisterUserInput } from '~/schema/registerUserSchema';
import type { ApiResponse } from '~/types/api';

// Queries
const getMe = async () => {
  const res = await axios.get<ApiResponse<{ user: User | null }>>('/auth/me');

  return res.data.data.user;
};

// Mutation
const registerUser = (data: RegisterUserInput) => {
  return axios.post('/auth/register', data);
};

const loginUser = async (data: LoginUserInput) => {
  const res = await axios.post<ApiResponse<{ user: User }>>('/auth/login', data);

  return res.data.data.user;
};

const logoutUser = () => {
  return axios.post('/auth/logout');
};

export { loginUser, logoutUser, getMe, registerUser };
