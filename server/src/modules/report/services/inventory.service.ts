import { prisma } from '~/db';
import { ProductCategory, ReportStatus } from '~/db/prisma';
import { BadInputError, ConflictError, NotFoundError } from '~/errors';
import { adjustQuantity } from '~/modules/inventory/services/inventory.service';

import type { CreateReportInventoryPayload } from '../schema/createReportInventorySchema';
import type { UpdateReportInventoryPayload } from '../schema/updateReportInventorySchema';

interface CreateReportInventoryInput extends CreateReportInventoryPayload {
  reportId: string;
}

const createReportInventory = async ({
  reportId,
  productId,
  quantity,
}: CreateReportInventoryInput) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  // Verify product is a stock inventory item
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      category: ProductCategory.STOCK_INVENTORY,
    },
    include: {
      inventory: true,
    },
  });

  if (!product || !product.inventory) {
    throw new NotFoundError('Stock inventory product not found');
  }

  // Get current price
  const latestPrice = await prisma.productPrice.findFirst({
    where: {
      productId,
      effectiveFrom: { lte: new Date() },
    },
    orderBy: { effectiveFrom: 'desc' },
  });

  if (!latestPrice) {
    throw new NotFoundError('No price found for product');
  }

  const unitPrice = latestPrice.price;

  // Check for existing entry
  const existing = await prisma.reportInventory.findUnique({
    where: { reportId_productId: { reportId, productId } },
  });

  const newQuantity = existing ? existing.quantity + quantity : quantity;
  const amount = newQuantity * Number(unitPrice);

  const entry = await prisma.reportInventory.upsert({
    where: { reportId_productId: { reportId, productId } },
    create: {
      reportId,
      productId,
      quantity,
      unitPriceSnapshot: unitPrice,
      amount,
    },
    update: {
      quantity: newQuantity,
      unitPriceSnapshot: unitPrice,
      amount,
    },
    include: { product: true },
  });

  return entry;
};

const updateReportInventory = async (
  reportId: string,
  productId: string,
  data: UpdateReportInventoryPayload,
) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const entry = await prisma.reportInventory.findUnique({
    where: { reportId_productId: { reportId, productId } },
    include: {
      product: {
        include: {
          productPrices: {
            where: { effectiveFrom: { lte: new Date() } },
            orderBy: { effectiveFrom: 'desc' },
            take: 1,
          },
        },
      },
    },
  });

  if (!entry) {
    throw new NotFoundError('Stock inventory entry not found');
  }

  const unitPrice = entry.product.productPrices[0]?.price || entry.unitPriceSnapshot;
  const amount = data.quantity * Number(unitPrice);

  return await prisma.reportInventory.update({
    where: { reportId_productId: { reportId, productId } },
    data: {
      quantity: data.quantity,
      amount,
    },
    include: { product: true },
  });
};

const deleteReportInventory = async (reportId: string, productId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const entry = await prisma.reportInventory.findUnique({
    where: { reportId_productId: { reportId, productId } },
  });

  if (!entry) {
    throw new NotFoundError('Stock inventory entry not found');
  }

  await prisma.reportInventory.delete({
    where: { reportId_productId: { reportId, productId } },
  });
};

const processInventoryDeductions = async (reportId: string) => {
  const stockInventoryEntries = await prisma.reportInventory.findMany({
    where: { reportId },
    include: {
      product: {
        include: {
          inventory: true,
        },
      },
    },
  });

  // First, validate all quantities are available
  const insufficientStock: string[] = [];
  for (const entry of stockInventoryEntries) {
    if (!entry.product.inventory) {
      throw new BadInputError(`Stock inventory not found for product: ${entry.product.name}`);
    }

    if (entry.product.inventory.quantity < entry.quantity) {
      insufficientStock.push(
        `${entry.product.name}: Available ${entry.product.inventory.quantity}, Required ${entry.quantity}`,
      );
    }
  }

  if (insufficientStock.length > 0) {
    throw new BadInputError(`Insufficient stock:\n${insufficientStock.join('\n')}`);
  }

  // If all validations pass, deduct quantities
  for (const entry of stockInventoryEntries) {
    await adjustQuantity(entry.productId, entry.quantity);
  }
};

export {
  createReportInventory,
  updateReportInventory,
  deleteReportInventory,
  processInventoryDeductions,
};
