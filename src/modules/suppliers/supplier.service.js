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
  const { email, contactInfo } = supplierData;

  // Check if email or contactInfo already exists
  const existingSupplier = await prisma.supplier.findFirst({
    where: {
      OR: [
        { email: email || undefined },
        { contactInfo: contactInfo || undefined },
      ],
    },
  });

  if (existingSupplier) {
    if (existingSupplier.email === email) {
      const err = new Error("Supplier with this email already exists");
      err.status = 409;
      throw err;
    }
    if (existingSupplier.contactInfo === contactInfo) {
      const err = new Error("Supplier with this phone number already exists");
      err.status = 409;
      throw err;
    }
  }

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