import { ProductType } from '~/services/product/product.types';

export const getProductTypeDisplayName = (type: ProductType | null): string => {
  if (!type) return 'Unknown';
  const map: Record<ProductType, string> = {
    [ProductType.GASOLINE]: 'XCS',
    [ProductType.PREMIUM]: 'XTRA',
    [ProductType.DIESEL]: 'ADO',
    [ProductType.KEROSENE]: 'KERO',
  };
  return map[type];
};
