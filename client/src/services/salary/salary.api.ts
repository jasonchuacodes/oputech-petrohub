import axios from '~/lib/axiosInstance';
import type { CreateSalaryRateInput, SalaryRate } from './salary.types';

const createSalaryRate = async (data: CreateSalaryRateInput): Promise<SalaryRate> => {
  const res = await axios.post('/salary-rates/', data);
  return res.data.data;
};

const getCurrentSalaryRate = async (
  userId: string,
  tenantId: string
): Promise<SalaryRate | null> => {
  const res = await axios.get('/salary-rates/current', {
    params: { userId, tenantId },
  });
  return res.data.data;
};

const getSalaryRates = async (
  userId: string,
  tenantId: string
): Promise<SalaryRate[]> => {
  const res = await axios.get('/salary-rates/', {
    params: { userId, tenantId },
  });
  return res.data.data;
};

export { createSalaryRate, getCurrentSalaryRate, getSalaryRates };
