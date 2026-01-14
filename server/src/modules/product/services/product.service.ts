import { prisma } from '~/db';
import { ConflictError, NotFoundError } from '~/errors';

import type { CreateProductPayload } from '../schema/createProductSchema';
import type { UpdateProductPayload } from '../schema/updateProductSchema';

const createProduct = async (data: CreateProductPayload) => {
  const product = await prisma.product.create({
    data: {
      tenantId: data.tenantId,
      name: data.name,
      description: data.description,
    },
  });

  await prisma.productPrice.create({
    data: {
      productId: product.id,
      price: data.price,
    },
  });

  await prisma.productReading.create({
    data: {
      productId: product.id,
      reading: data.reading,
    },
  });

  return await getProductById(product.id, data.tenantId);
};

const getProductsByTenantId = async (tenantId: string) => {
  const now = new Date();

  const products = await prisma.product.findMany({
    where: { tenantId },
    include: {
      productPrices: {
        where: { effectiveFrom: { lte: now } },
        orderBy: { effectiveFrom: 'desc' },
        take: 1,
      },
      productReadings: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const scheduledPrices = await prisma.productPrice.findMany({
    where: {
      productId: { in: products.map((p) => p.id) },
      effectiveFrom: { gt: now },
    },
    orderBy: { effectiveFrom: 'asc' },
    distinct: ['productId'],
  });

  return products.map((product) => ({
    ...product,
    productReading: product.productReadings[0] || null,
    productPrice: product.productPrices[0] || null,
    scheduledPrice: scheduledPrices.find((sp) => sp.productId === product.id) || null,
    productPrices: undefined,
    productReadings: undefined,
  }));
};

const getProductById = async (productId: string, tenantId: string) => {
  const now = new Date();

  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
    include: {
      productPrices: {
        where: { effectiveFrom: { lte: now } },
        orderBy: { effectiveFrom: 'desc' },
        take: 1,
      },
      productReadings: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  const scheduledPrice = await prisma.productPrice.findFirst({
    where: {
      productId,
      effectiveFrom: { gt: now },
    },
    orderBy: { effectiveFrom: 'asc' },
  });

  return {
    ...product,
    productPrice: product.productPrices[0] || null,
    productReading: product.productReadings[0] || null,
    scheduledPrice: scheduledPrice || null,
    productPrices: undefined,
    productReadings: undefined,
  };
};

const updateProduct = async (productId: string, tenantId: string, data: UpdateProductPayload) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      description: data.description,
    },
  });

  if (data.productPrice !== undefined) {
    await prisma.productPrice.create({
      data: {
        productId,
        price: data.productPrice,
        ...(data.effectiveFrom && { effectiveFrom: new Date(data.effectiveFrom) }),
      },
    });
  }

  if (data.productReading !== undefined) {
    await prisma.productReading.create({
      data: {
        productId,
        reading: data.productReading,
      },
    });
  }

  return await getProductById(productId, tenantId);
};

const deleteProduct = async (productId: string, tenantId: string) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
    include: {
      reportEntries: { select: { id: true } },
      reportDisposals: { select: { id: true } },
    },
  });

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  if (product.reportEntries.length > 0 || product.reportDisposals.length > 0) {
    throw new ConflictError('Cannot delete product that is referenced in reports');
  }

  return await prisma.product.delete({
    where: { id: productId },
  });
};

export { createProduct, getProductsByTenantId, getProductById, updateProduct, deleteProduct };
