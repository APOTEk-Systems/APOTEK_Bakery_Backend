import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllSuppliers = async () => {
  return prisma.supplier.findMany();
};

export const getPurchaseOrdersBySupplierId = async (supplierId) => {
  return prisma.purchaseOrder.findMany({
    where: {
      supplierId: supplierId,
    },
  });
};

export const createSupplier = async (supplierData) => {
  return prisma.supplier.create({
    data: supplierData,
  });
};

export const updateSupplier = async (id, supplierData) => {
  return prisma.supplier.update({
    where: { id },
    data: supplierData,
  });
};

export const deleteSupplier = async (id) => {
  return prisma.supplier.delete({
    where: { id },
  });
};