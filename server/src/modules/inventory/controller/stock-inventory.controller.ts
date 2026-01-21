import type { Request, Response, NextFunction } from 'express';
import { createSchemaValidator } from '~/utils';
import * as stockInventoryService from '../services/stock-inventory.service';
import { CreateStockInventorySchema } from '../schema/createStockInventorySchema';
import { UpdateStockInventorySchema } from '../schema/updateStockInventorySchema';

const validateCreateStockInventory = createSchemaValidator(CreateStockInventorySchema);
const validateUpdateStockInventory = createSchemaValidator(UpdateStockInventorySchema);

const createStockInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await validateCreateStockInventory(req.body);
    const stockInventory = await stockInventoryService.createStockInventory(data);
    res.status(201).json({ message: 'Stock inventory created successfully', data: stockInventory });
  } catch (err) {
    next(err);
  }
};

const getStockInventoriesByTenantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tenantId } = req.query;
    const stockInventories = await stockInventoryService.getStockInventoriesByTenantId(tenantId as string);
    res.status(200).json({ data: stockInventories });
  } catch (err) {
    next(err);
  }
};

const getStockInventoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { inventoryId } = req.params;
    const { tenantId } = req.query;
    const stockInventory = await stockInventoryService.getStockInventoryById(
      inventoryId,
      tenantId as string,
    );
    res.status(200).json({ data: stockInventory });
  } catch (err) {
    next(err);
  }
};

const updateStockInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { inventoryId } = req.params;
    const { tenantId } = req.query;
    const data = await validateUpdateStockInventory(req.body);
    const stockInventory = await stockInventoryService.updateStockInventory(
      inventoryId,
      tenantId as string,
      data,
    );
    res.status(200).json({ message: 'Stock inventory updated successfully', data: stockInventory });
  } catch (err) {
    next(err);
  }
};

const deleteStockInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { inventoryId } = req.params;
    const { tenantId } = req.query;
    await stockInventoryService.deleteStockInventory(inventoryId, tenantId as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export {
  createStockInventory,
  getStockInventoriesByTenantId,
  getStockInventoryById,
  updateStockInventory,
  deleteStockInventory,
};
