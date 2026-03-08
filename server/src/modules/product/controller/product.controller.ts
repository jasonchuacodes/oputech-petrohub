import type { Request, Response, NextFunction } from 'express';

import { ProductCategory } from '~/db/prisma';
import { createSchemaValidator } from '~/utils';

import * as productService from '../services/product.service';
import { CreateProductSchema } from '../schema/createProductSchema';
import { UpdateProductSchema } from '../schema/updateProductSchema';
import { GetProductsSchema } from '../schema/getProductsSchema';

const validateCreateProduct = createSchemaValidator(CreateProductSchema);
const validateUpdateProduct = createSchemaValidator(UpdateProductSchema);
const validateGetProducts = createSchemaValidator(GetProductsSchema);

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await validateCreateProduct(req.body);
    const product = await productService.createProduct(data);
    res.status(201).json({ message: 'Product created successfully', data: product });
  } catch (err) {
    next(err);
  }
};

const getProductsByTenantId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tenantId, category, searchTerm } = await validateGetProducts({
      tenantId: req.query.tenantId as string,
      category: req.query.category as ProductCategory | undefined,
      searchTerm: req.query.searchTerm as string | undefined,
    });

    const products = await productService.getProductsByTenantId(tenantId, { category, searchTerm });

    res.status(200).json({ data: products });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { tenantId } = req.query;
    const product = await productService.getProductById(productId, tenantId as string);
    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
};

const getProductsByType = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = req.query;
    const products = await productService.getProductsByType(tenantId as string);
    res.status(200).json({ data: products });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { tenantId } = req.query;
    const data = await validateUpdateProduct(req.body);
    const product = await productService.updateProduct(productId, tenantId as string, data);
    res.status(200).json({ message: 'Product updated successfully', data: product });
  } catch (err) {
    next(err);
  }
};

const deactivateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { tenantId } = req.query;
    await productService.deactivateProduct(productId, tenantId as string);
    res.status(200).json({ message: 'Product deactivated' });
  } catch (err) {
    next(err);
  }
};

const cancelScheduledPrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const { tenantId } = req.query;
    const product = await productService.cancelScheduledPrice(productId, tenantId as string);
    res.status(200).json({ data: product });
  } catch (err) {
    next(err);
  }
};

export {
  createProduct,
  getProductsByTenantId,
  getProductById,
  getProductsByType,
  updateProduct,
  deactivateProduct,
  cancelScheduledPrice,
};
