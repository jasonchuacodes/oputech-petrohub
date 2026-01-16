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

  // Base fields
  if (data.name !== undefined && data.name !== product.name) {
    updates.name = data.name;
  }
  if (data.description !== undefined && data.description !== product.description) {
    updates.description = data.description;
  }

  // Price - convert Decimal to number for comparison
  if (data.productPrice !== undefined) {
    const priceChanged = !currentPrice || Number(currentPrice) !== data.productPrice;
    if (priceChanged) {
      updates.productPrice = data.productPrice;
      if (data.effectiveFrom) {
        updates.effectiveFrom = data.effectiveFrom;
      }
    }
  }

  // Reading - convert Decimal to number
  if (data.productReading !== undefined) {
    const readingChanged = !currentReading || Number(currentReading) !== data.productReading;
    if (readingChanged) {
      updates.productReading = data.productReading;
    }
  }

  // Early return if nothing changed
  if (Object.keys(updates).length === 0) {
    return getProductById(productId, tenantId);
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Update product base fields only if changed
    if (updates.name !== undefined || updates.description !== undefined) {
      await tx.product.update({
        where: { id: productId },
        data: {
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.description !== undefined && { description: updates.description }),
        },
      });
    }

    // 2. Handle product price only if changed
    if (updates.productPrice !== undefined) {
      const now = new Date();

      const futurePrices = await tx.productPrice.findMany({
        where: {
          productId,
          effectiveFrom: {
            gt: now,
          },
        },
        orderBy: {
          effectiveFrom: 'asc',
        },
      });

      if (futurePrices.length > 0) {
        const [priceToUpdate, ...pricesToDelete] = futurePrices;

        // Update the nearest future price
        await tx.productPrice.update({
          where: { id: priceToUpdate.id },
          data: {
            price: updates.productPrice,
            ...(updates.effectiveFrom && {
              effectiveFrom: new Date(updates.effectiveFrom),
            }),
          },
        });

        // Remove other future prices
        if (pricesToDelete.length > 0) {
          await tx.productPrice.deleteMany({
            where: {
              id: {
                in: pricesToDelete.map((p) => p.id),
              },
            },
          });
        }
      } else {
        // Create a future price if none exists
        await tx.productPrice.create({
          data: {
            productId,
            price: updates.productPrice,
            effectiveFrom: updates.effectiveFrom ? new Date(updates.effectiveFrom) : now,
          },
        });
      }
    }

    // 3. Handle product reading only if changed
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
