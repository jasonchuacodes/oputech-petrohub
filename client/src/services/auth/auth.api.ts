import axios from '~/lib/axiosInstance';
import { UserRoleEnum, type User } from '~/services/user/user.types';
import type { ForceUpdatePasswordPayload } from '~/schema/forceUpdatePassword';
import type { ForgotPasswordInput } from '~/schema/forgotPasswordSchema';
import type { LoginUserInput } from '~/schema/loginUserSchema';
import type { RegisterUserPayload } from '~/schema/registerUserSchema';
import type { UpdatePasswordPayload } from '~/schema/updatePasswordSchema';
import type { ApiResponse } from '~/types/api';

// Queries
const getMe = async () => {
  const res = await axios.get<ApiResponse<{ user: User | null }>>('/auth/me');

  return res.data.data.user;
};

// Mutation
const registerUser = (data: RegisterUserPayload) => {
  return axios.post('/auth/register', {
    ...data,
    role: UserRoleEnum.ADMIN,
  });
};

const updatePassword = (data: UpdatePasswordPayload) => {
  return axios.put('/auth/change-password', {
    ...data,
  });
};

const forceUpdatePassword = (data: ForceUpdatePasswordPayload) => {
  return axios.put('/auth/force-change-password', {
    ...data,
  });
};

const loginUser = async (data: LoginUserInput) => {
  const res = await axios.post<ApiResponse<{ user: User }>>('/auth/login', data);

  return res.data.data.user;
};

const logoutUser = () => {
  return axios.post('/auth/logout');
};

const forgotPassword = (data: ForgotPasswordInput) => {
  return axios.post('/auth/forgot-password', data);
};

export {
  loginUser,
  logoutUser,
  getMe,
  registerUser,
  updatePassword,
  forceUpdatePassword,
  forgotPassword,
};
