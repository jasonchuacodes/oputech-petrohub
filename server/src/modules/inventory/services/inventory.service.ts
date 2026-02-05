import { prisma } from '~/db';
import { ProductCategory } from '~/db/prisma';
import { BadInputError, ConflictError, NotFoundError } from '~/errors';

import type { CreateInventoryPayload } from '../schema/createInventorySchema';
import type { UpdateInventoryPayload } from '../schema/updateInventorySchema';

const createInventory = async (data: CreateInventoryPayload) => {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        description: data.description,
        category: ProductCategory.STOCK_INVENTORY,
        lowStockThreshold: data.lowStockThreshold ?? null,
      },
    });

    await tx.productPrice.create({
      data: {
        productId: product.id,
        price: data.price,
      },
    });

    await tx.inventory.create({
      data: {
        productId: product.id,
        quantity: data.quantity || 0,
      },
    });

    return product;
  });
};

const getInventoriesByTenantId = async (
  tenantId: string,
  filters?: { searchTerm?: string },
) => {
  const now = new Date();

  const products = await prisma.product.findMany({
    where: {
      tenantId,
      category: ProductCategory.STOCK_INVENTORY,
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
      inventory: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return products.map((product) => ({
    id: product.inventory?.id || '',
    productId: product.id,
    productName: product.name,
    productDescription: product.description,
    quantity: product.inventory?.quantity || 0,
    currentPrice: product.productPrices[0]?.price || null,
    lowStockThreshold: product.lowStockThreshold,
    updatedAt: product.inventory?.updatedAt || product.updatedAt,
  }));
};

const getInventoryById = async (productId: string, tenantId: string) => {
  const now = new Date();

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      tenantId,
      category: ProductCategory.STOCK_INVENTORY,
    },
    include: {
      productPrices: {
        where: { effectiveFrom: { lte: now } },
        orderBy: { effectiveFrom: 'desc' },
        take: 1,
      },
      inventory: true,
    },
  });

  if (!product || !product.inventory) {
    throw new NotFoundError('Stock inventory not found');
  }

  return {
    id: product.inventory.id,
    productId: product.id,
    productName: product.name,
    productDescription: product.description,
    quantity: product.inventory.quantity,
    currentPrice: product.productPrices[0]?.price || null,
    lowStockThreshold: product.lowStockThreshold,
    updatedAt: product.inventory.updatedAt,
  };
};

const updateInventory = async (
  productId: string,
  tenantId: string,
  data: UpdateInventoryPayload,
) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      tenantId,
      category: ProductCategory.STOCK_INVENTORY,
    },
    include: {
      productPrices: {
        where: { effectiveFrom: { lte: new Date() } },
        orderBy: { effectiveFrom: 'desc' },
        take: 1,
      },
      inventory: true,
    },
  });

  if (!product || !product.inventory) {
    throw new NotFoundError('Stock inventory not found');
  }

  const currentPrice = product.productPrices[0]?.price;
  const updates: Partial<UpdateInventoryPayload> = {};

  // Base fields
  if (data.name !== undefined && data.name !== product.name) {
    updates.name = data.name;
  }
  if (data.description !== undefined && data.description !== product.description) {
    updates.description = data.description;
  }

  // Price - convert Decimal to number for comparison
  if (data.price !== undefined) {
    const priceChanged = !currentPrice || Number(currentPrice) !== data.price;
    if (priceChanged) {
      updates.price = data.price;
      if (data.effectiveFrom) {
        updates.effectiveFrom = data.effectiveFrom;
      }
    }
  }

  // Quantity
  if (data.quantity !== undefined && data.quantity !== product.inventory.quantity) {
    updates.quantity = data.quantity;
  }

  // Low stock threshold
  if (data.lowStockThreshold !== undefined && data.lowStockThreshold !== product.lowStockThreshold) {
    updates.lowStockThreshold = data.lowStockThreshold;
  }

  // Early return if nothing changed
  if (Object.keys(updates).length === 0) {
    return getInventoryById(productId, tenantId);
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Update product base fields
    if (updates.name !== undefined || updates.description !== undefined || updates.lowStockThreshold !== undefined) {
      await tx.product.update({
        where: { id: productId },
        data: {
          ...(updates.name !== undefined && { name: updates.name }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.lowStockThreshold !== undefined && { lowStockThreshold: updates.lowStockThreshold }),
        },
      });
    }

    // 2. Handle product price
    if (updates.price !== undefined) {
      const now = new Date();
      await tx.productPrice.create({
        data: {
          productId,
          price: updates.price,
          effectiveFrom: updates.effectiveFrom ? new Date(updates.effectiveFrom) : now,
        },
      });
    }

    // 3. Update quantity
    if (updates.quantity !== undefined) {
      await tx.inventory.update({
        where: { productId },
        data: { quantity: updates.quantity },
      });
    }

    return getInventoryById(productId, tenantId);
  });
};

const deleteInventory = async (productId: string, tenantId: string) => {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      tenantId,
      category: ProductCategory.STOCK_INVENTORY,
    },
    include: {
      reportInventory: { select: { id: true } },
    },
  });

  if (!product) {
    throw new NotFoundError('Stock inventory not found');
  }

  if (product.reportInventory.length > 0) {
    throw new ConflictError('Cannot delete stock inventory that is referenced in reports');
  }

  return await prisma.product.delete({
    where: { id: productId },
  });
};

const adjustQuantity = async (productId: string, quantitySold: number) => {
  const stockInventory = await prisma.inventory.findUnique({
    where: { productId },
  });

  if (!stockInventory) {
    throw new NotFoundError('Stock inventory not found');
  }

  if (stockInventory.quantity < quantitySold) {
    throw new BadInputError(
      `Insufficient stock. Available: ${stockInventory.quantity}, Required: ${quantitySold}`,
    );
  }

  return await prisma.inventory.update({
    where: { productId },
    data: {
      quantity: {
        decrement: quantitySold,
      },
    },
  });
};

export {
  createInventory,
  getInventoriesByTenantId,
  getInventoryById,
  updateInventory,
  deleteInventory,
  adjustQuantity,
};
