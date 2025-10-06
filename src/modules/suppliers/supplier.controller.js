import * as supplierService from './supplier.service.js';

export const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await supplierService.getAllSuppliers();
    res.json(suppliers);
  } catch (error) {
    next(error);
  }
};

export const getPurchaseOrdersBySupplierId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const purchaseOrders = await supplierService.getPurchaseOrdersBySupplierId(parseInt(id));
    res.json(purchaseOrders);
  } catch (error) {
    next(error);
  }
};

export const createSupplier = async (req, res, next) => {
  try {
    const newSupplier = await supplierService.createSupplier(req.body);
    res.status(201).json(newSupplier);
  } catch (error) {
    if (
      error.message === "Supplier with this email already exists" ||
      error.message === "Supplier with this phone number already exists"
    ) {
      return res.status(409).json({ message: error.message });
    }

    next(error); // Pass other errors to global error handler
  }
};


export const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedSupplier = await supplierService.updateSupplier(parseInt(id), req.body);
    res.json(updatedSupplier);
  } catch (error) {
    next(error);
  }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    await supplierService.deleteSupplier(parseInt(id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};