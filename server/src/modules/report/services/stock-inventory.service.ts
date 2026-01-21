import { prisma } from '~/db';
import { ReportStatus } from '~/db/prisma';
import { BadInputError, ConflictError, NotFoundError } from '~/errors';
import { adjustQuantity } from '~/modules/inventory/services/stock-inventory.service';

import type { CreateReportStockInventoryPayload } from '../schema/createReportStockInventorySchema';
import type { UpdateReportStockInventoryPayload } from '../schema/updateReportStockInventorySchema';

interface CreateReportStockInventoryInput extends CreateReportStockInventoryPayload {
  reportId: string;
}

const createReportStockInventory = async ({ reportId, productId, quantitySold }: CreateReportStockInventoryInput) => {
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
      category: 'STOCK_INVENTORY',
    },
    include: {
      stockInventory: true,
    },
  });

  if (!product || !product.stockInventory) {
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
  const totalPrice = quantitySold * Number(unitPrice);

  const entry = await prisma.reportStockInventory.upsert({
    where: { reportId_productId: { reportId, productId } },
    create: {
      reportId,
      productId,
      quantitySold,
      unitPriceSnapshot: unitPrice,
      totalPrice,
    },
    update: {
      quantitySold,
      totalPrice,
    },
    include: { product: true },
  });

  return entry;
};

const updateReportStockInventory = async (
  reportId: string,
  productId: string,
  data: UpdateReportStockInventoryPayload
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

  const entry = await prisma.reportStockInventory.findUnique({
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
  const totalPrice = data.quantitySold * Number(unitPrice);

  return await prisma.reportStockInventory.update({
    where: { reportId_productId: { reportId, productId } },
    data: {
      quantitySold: data.quantitySold,
      totalPrice,
    },
    include: { product: true },
  });
};

const deleteReportStockInventory = async (reportId: string, productId: string) => {
  const report = await prisma.report.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    throw new NotFoundError('Report not found');
  }

  if (report.status === ReportStatus.SUBMITTED) {
    throw new ConflictError('Cannot modify submitted reports');
  }

  const entry = await prisma.reportStockInventory.findUnique({
    where: { reportId_productId: { reportId, productId } },
  });

  if (!entry) {
    throw new NotFoundError('Stock inventory entry not found');
  }

  await prisma.reportStockInventory.delete({
    where: { reportId_productId: { reportId, productId } },
  });
};

const processStockInventoryDeductions = async (reportId: string) => {
  const stockInventoryEntries = await prisma.reportStockInventory.findMany({
    where: { reportId },
    include: {
      product: {
        include: {
          stockInventory: true,
        },
      },
    },
  });

  // First, validate all quantities are available
  const insufficientStock: string[] = [];
  for (const entry of stockInventoryEntries) {
    if (!entry.product.stockInventory) {
      throw new BadInputError(`Stock inventory not found for product: ${entry.product.name}`);
    }

    if (entry.product.stockInventory.quantity < entry.quantitySold) {
      insufficientStock.push(
        `${entry.product.name}: Available ${entry.product.stockInventory.quantity}, Required ${entry.quantitySold}`
      );
    }
  }

  if (insufficientStock.length > 0) {
    throw new BadInputError(`Insufficient stock:\n${insufficientStock.join('\n')}`);
  }

  // If all validations pass, deduct quantities
  for (const entry of stockInventoryEntries) {
    await adjustQuantity(entry.productId, entry.quantitySold);
  }
};

export {
  createReportStockInventory,
  updateReportStockInventory,
  deleteReportStockInventory,
  processStockInventoryDeductions,
};
