import type { ReactNode } from 'react';
import { createContext } from 'react';

import type { Product } from '~/services/product/product.types';

type ProductContextType = {
  product: Product;
};

type ProductProviderProps = {
  product: Product;
  children: ReactNode;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const ProductProvider = ({ product, children }: ProductProviderProps) => {
  return <ProductContext.Provider value={{ product }}>{children}</ProductContext.Provider>;
};

export { ProductContext, ProductProvider };
