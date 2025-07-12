import axios from '~/lib/axiosInstance';
import type { LoginUserInput } from '~/schema/LoginUserSchema';
import type { RegisterUserInput } from '~/schema/RegisterUserSchema';
import type { GetMeResponse } from '~/services/auth/auth.types';

const registerUser = (data: RegisterUserInput) => {
  return axios.post('/auth/register', data);
};

const loginUser = async (data: LoginUserInput) => {
  return await axios.post('/auth/login', data);
};

const logoutUser = () => {
  return axios.post('/auth/logout');
};

const getMe = () => {
  return axios.get<GetMeResponse>('/auth/me');
};

export { loginUser, logoutUser, getMe, registerUser };
