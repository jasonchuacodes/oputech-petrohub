import { ProductType } from '~/services/product/product.types';

export const getProductTypeDisplayName = (type: ProductType | null): string => {
  if (!type) return 'Unknown';

  const map: Record<ProductType, string> = {
    [ProductType.GASOLINE]: 'XTRA',
    [ProductType.PREMIUM]: 'XCS',
    [ProductType.DIESEL]: 'ADO',
    [ProductType.KEROSENE]: 'KERO',
  };
  return map[type];
};
