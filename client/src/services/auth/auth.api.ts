import axios from '~/lib/axiosInstance';
import type { LoginUserInput } from '~/schema/loginUserSchema';
import type { RegisterUserInput } from '~/schema/registerUserSchema';
import type { User } from '../user/user.types';
import type { ApiResponse } from '../../types/api';

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

const getMe = async () => {
  const res = await axios.get<ApiResponse<{ user: User }>>('/auth/me');

  return res.data.data.user;
};

export { loginUser, logoutUser, getMe, registerUser };
