import type { Request, Response, NextFunction } from 'express';
import { createSchemaValidator } from '~/utils';
import * as inventoryService from '../services/inventory.service';
import { CreateInventorySchema } from '../schema/createInventorySchema';
import { UpdateInventorySchema } from '../schema/updateInventorySchema';

const validateCreateInventory = createSchemaValidator(CreateInventorySchema);
const validateUpdateInventory = createSchemaValidator(UpdateInventorySchema);

const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await validateCreateInventory(req.body);
    const inventory = await inventoryService.createInventory(data);
    res.status(201).json({ message: 'Stock inventory created successfully', data: inventory });
  } catch (err) {
    next(err);
  }
};

const getInventoriesByTenantId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tenantId } = req.query;
    const inventories = await inventoryService.getInventoriesByTenantId(tenantId as string);
    res.status(200).json({ data: inventories });
  } catch (err) {
    next(err);
  }
};

const getInventoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { inventoryId } = req.params;
    const { tenantId } = req.query;
    const inventory = await inventoryService.getInventoryById(
      inventoryId,
      tenantId as string,
    );
    res.status(200).json({ data: inventory });
  } catch (err) {
    next(err);
  }
};

const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { inventoryId } = req.params;
    const { tenantId } = req.query;
    const data = await validateUpdateInventory(req.body);
    const inventory = await inventoryService.updateInventory(
      inventoryId,
      tenantId as string,
      data,
    );
    res.status(200).json({ message: 'Stock inventory updated successfully', data: inventory });
  } catch (err) {
    next(err);
  }
};

const deleteInventory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { inventoryId } = req.params;
    const { tenantId } = req.query;
    await inventoryService.deleteInventory(inventoryId, tenantId as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export {
  createInventory,
  getInventoriesByTenantId,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
