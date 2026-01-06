import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createProductAdjustment({
  productId,
  amount,
  reason,
  createdById,
}) {
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  // For bakery business, amount represents how much to remove (must be positive)
  if (amount <= 0) {
    throw new Error("Adjustment amount must be greater than zero. Use positive values to specify how much to reduce.");
  }

  // Ensure quantity doesn't go below zero
  if (amount > existingProduct.quantity) {
    throw new Error(`Cannot reduce product quantity below zero. Current: ${existingProduct.quantity}, Requested reduction: ${amount}`);
  }

  // Create the adjustment record (store as negative for accounting purposes)
  const adjustment = await prisma.productAdjustment.create({
    data: {
      productId,
      amount: amount,
      reason,
      createdById,
    },
  });

  // Update product quantity
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      quantity: {
        decrement: amount,
      },
    },
  });

  return { adjustment, product };
}

export async function listProductAdjustments({
  startDate,
  endDate,
  name,
  page = 1,
  limit = 10,
  search,
}) {
  const where = {};

  if (startDate || endDate) {
    where.createdAt = {};
  if (startDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  where.createdAt.gte = start; // keep as Date
}

if (endDate) {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  where.createdAt.lte = end; // keep as Date
}

  }

  if (name) {
    where.product = {
      ...where.product,
      name: {
        contains: name,
        mode: "insensitive",
      },
    };
  }

  if (search) {
    where.OR = [
      {
        product: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      {
        reason: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [adjustments, total] = await prisma.$transaction([
    prisma.productAdjustment.findMany({
      where,
      include: {
        product: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.productAdjustment.count({ where }),
  ]);

  const refactoredAdjustments = adjustments.map(adj => ({
    ...adj,
   createdBy:adj.createdBy.name,
   product: adj.product.name,
  
  }));

  console.log(refactoredAdjustments[0]);

  return { adjustments:refactoredAdjustments, total, page, limit };
}
