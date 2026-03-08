import { prisma } from '~/db';
import { Prisma, ProductCategory, ProductPrice, ProductType } from '~/db/prisma';
import { NotFoundError } from '~/errors';
import { Decimal } from '@prisma/client/runtime/library';

import type { CreateProductPayload } from '../schema/createProductSchema';
import type { UpdateProductPayload } from '../schema/updateProductSchema';

type Tx = Prisma.TransactionClient;

interface GetProductsFilters {
  category?: ProductCategory;
  searchTerm?: string;
}

const createProduct = async (data: CreateProductPayload) => {
  const product = await prisma.product.create({
    data: {
      tenantId: data.tenantId,
      name: data.name,
      description: data.description,
      color: data.color,
      type: data.type,
      active: true,
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

const getProductsByTenantId = async (tenantId: string, filters?: GetProductsFilters) => {
  const now = new Date();

  const products = await prisma.product.findMany({
    where: {
      tenantId,
      category: filters?.category,
      active: true,
      ...(filters?.searchTerm && {
        name: {
          contains: filters.searchTerm,
          mode: 'insensitive',
        },
      }),
    },
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
    orderBy: { name: 'asc' },
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

const cascadePriceUpdate = async (
  tx: Tx,
  tenantId: string,
  productType: ProductType,
  price: Decimal | number,
  effectiveFrom: Date,
) => {
  const productsOfType = await tx.product.findMany({
    where: { tenantId, type: productType, active: true },
    select: { id: true },
  });

  const now = new Date();
  const isScheduled = effectiveFrom > now;

  for (const product of productsOfType) {
    if (isScheduled) {
      const futurePrices = await tx.productPrice.findMany({
        where: { productId: product.id, effectiveFrom: { gt: now } },
        orderBy: { effectiveFrom: 'asc' },
      });

      if (futurePrices.length > 0) {
        await tx.productPrice.update({
          where: { id: futurePrices[0].id },
          data: { price, effectiveFrom },
        });
        if (futurePrices.length > 1) {
          await tx.productPrice.deleteMany({
            where: { id: { in: futurePrices.slice(1).map((price: ProductPrice) => price.id) } },
          });
        }
      } else {
        await tx.productPrice.create({
          data: { productId: product.id, price, effectiveFrom },
        });
      }
    } else {
      await tx.productPrice.create({
        data: { productId: product.id, price, effectiveFrom },
      });
    }
  }
};

const updateProduct = async (productId: string, tenantId: string, data: UpdateProductPayload) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
    include: {
      productPrices: {
        where: { effectiveFrom: { lte: new Date() } },
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

  const currentPrice = product.productPrices[0]?.price;
  const currentReading = product.productReadings[0]?.reading;

  const updates: Partial<UpdateProductPayload> = {};

  if (data.name !== undefined && data.name !== product.name) {
    updates.name = data.name;
  }

  if (data.description !== undefined && data.description !== product.description) {
    updates.description = data.description;
  }

  if (data.color !== undefined && data.color !== product.color) {
    updates.color = data.color;
  }

  if (data.productPrice !== undefined) {
    const priceChanged = !currentPrice || Number(currentPrice) !== data.productPrice;
    if (priceChanged) {
      updates.productPrice = data.productPrice;
      if (data.effectiveFrom) {
        updates.effectiveFrom = data.effectiveFrom;
      }
    }
  }

  if (data.productReading !== undefined) {
    const readingChanged = !currentReading || Number(currentReading) !== data.productReading;
    if (readingChanged) {
      updates.productReading = data.productReading;
    }
  }

  if (Object.keys(updates).length === 0) {
    return getProductById(productId, tenantId);
  }

  return await prisma.$transaction(async (tx) => {
    if (
      updates.name !== undefined ||
      updates.description !== undefined ||
      updates.color !== undefined
    ) {
      await tx.product.update({
        where: { id: productId },
        data: {
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.color !== undefined && { color: updates.color }),
        },
      });
    }

    if (updates.productPrice !== undefined) {
      const effectiveFrom = updates.effectiveFrom ? new Date(updates.effectiveFrom) : new Date();

      if (product.type) {
        await cascadePriceUpdate(tx, tenantId, product.type, updates.productPrice, effectiveFrom);
      }
    }

    if (updates.productReading !== undefined) {
      await tx.productReading.create({
        data: {
          productId,
          reading: updates.productReading,
        },
      });
    }

    return getProductById(productId, tenantId);
  });
};

const getProductsByType = async (tenantId: string) => {
  const now = new Date();

  // Get distinct product types
  const types = await prisma.product.findMany({
    where: {
      tenantId,
      category: ProductCategory.FUEL,
      type: { not: null },
      active: true,
    },
    select: { type: true },
    distinct: ['type'],
  });

  // For each type, get one representative product with prices
  const products = await Promise.all(
    types.map(async ({ type }) => {
      const product = await prisma.product.findFirst({
        where: { tenantId, type, active: true },
        orderBy: { createdAt: 'desc' },
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

      if (!product) return null;

      const scheduledPrice = await prisma.productPrice.findFirst({
        where: {
          productId: product.id,
          effectiveFrom: { gt: now },
        },
        orderBy: { effectiveFrom: 'asc' },
      });

      return {
        ...product,
        productPrice: product.productPrices[0],
        productReading: product.productReadings[0],
        scheduledPrice,
        productPrices: undefined,
        productReadings: undefined,
      };
    }),
  );

  return products.filter((p) => p !== null);
};

const deactivateProduct = async (productId: string, tenantId: string) => {
  return await prisma.product.update({
    where: { id: productId, tenantId },
    data: { active: false },
  });
};

const cancelScheduledPrice = async (productId: string, tenantId: string) => {
  const product = await prisma.product.findFirst({
    where: { id: productId, tenantId },
    select: { id: true, type: true },
  });

  if (!product) throw new NotFoundError('Product not found');

  const now = new Date();

  const productsOfType = await prisma.product.findMany({
    where: { tenantId, type: product.type, active: true },
    select: { id: true },
  });

  await prisma.productPrice.deleteMany({
    where: {
      productId: { in: productsOfType.map((p) => p.id) },
      effectiveFrom: { gt: now },
    },
  });

  return getProductById(productId, tenantId);
};

export {
  createProduct,
  getProductsByTenantId,
  getProductById,
  updateProduct,
  getProductsByType,
  deactivateProduct,
  cancelScheduledPrice,
};
