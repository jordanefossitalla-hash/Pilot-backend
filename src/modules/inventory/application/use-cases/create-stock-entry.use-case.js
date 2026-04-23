const AppError = require('../../../../core/errors/app-error');

async function createStockEntryUseCase(prisma, input) {
  const supplier = await prisma.thirdParty.findUnique({
    where: { id: input.supplierId }
  });

  if (!supplier) {
    throw new AppError('Supplier not found.', 404);
  }

  if (!['SUPPLIER', 'BOTH'].includes(supplier.type)) {
    throw new AppError('The selected tier is not a supplier.', 400);
  }

  const productIds = input.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  if (products.length !== productIds.length) {
    throw new AppError('One or more products were not found.', 404);
  }

  const inactiveProduct = products.find((product) => !product.isActive);

  if (inactiveProduct) {
    throw new AppError(`Product ${inactiveProduct.name} is inactive.`, 400);
  }

  const totalAmount = Number(input.items.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));

  return prisma.$transaction(async (transaction) => {
    const createdEntry = await transaction.stockEntry.create({
      data: {
        supplierId: input.supplierId,
        reference: input.reference,
        entryDate: input.entryDate,
        notes: input.notes,
        totalAmount,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal
          }))
        }
      }
    });

    for (const item of input.items) {
      await transaction.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            increment: item.quantity
          }
        }
      });
    }

    await transaction.thirdPartyLedgerEntry.create({
      data: {
        thirdPartyId: input.supplierId,
        entryType: 'PURCHASE_RECEIPT',
        direction: 'CREDIT',
        amount: totalAmount,
        reference: input.reference || createdEntry.id,
        description: input.notes,
        stockEntryId: createdEntry.id
      }
    });

    return transaction.stockEntry.findUnique({
      where: { id: createdEntry.id },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
  });
}

module.exports = createStockEntryUseCase;
