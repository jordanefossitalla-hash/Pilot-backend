const AppError = require('../../../../core/errors/app-error');

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function toDecimalNumber(value, fieldName, { min = 0, allowZero = true } = {}) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    throw new AppError(`${fieldName} must be a valid number.`, 400);
  }

  if (allowZero) {
    if (numericValue < min) {
      throw new AppError(`${fieldName} must be greater than or equal to ${min}.`, 400);
    }
  } else if (numericValue <= min) {
    throw new AppError(`${fieldName} must be greater than ${min}.`, 400);
  }

  return numericValue;
}

function serializeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    unit: product.unit,
    stockQuantity: Number(product.stockQuantity),
    isActive: product.isActive,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  };
}

function serializeStockEntryItem(item) {
  return {
    id: item.id,
    productId: item.productId,
    product: item.product ? serializeProduct(item.product) : undefined,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    lineTotal: Number(item.lineTotal)
  };
}

function serializeStockEntry(entry) {
  return {
    id: entry.id,
    supplierId: entry.supplierId,
    reference: entry.reference,
    entryDate: entry.entryDate,
    notes: entry.notes,
    totalAmount: Number(entry.totalAmount),
    supplier: entry.supplier
      ? {
          id: entry.supplier.id,
          name: entry.supplier.name,
          type: entry.supplier.type
        }
      : undefined,
    items: Array.isArray(entry.items) ? entry.items.map(serializeStockEntryItem) : [],
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt
  };
}

function validateCreateProductInput(payload) {
  const name = normalizeString(payload.name);
  const sku = normalizeString(payload.sku);
  const unit = normalizeString(payload.unit).toUpperCase();

  if (!name) {
    throw new AppError('name is required.', 400);
  }

  return {
    name,
    sku: sku || null,
    unit: unit || 'UNIT'
  };
}

function validateUpdateProductInput(payload) {
  const data = {};

  if (payload.name !== undefined) {
    const name = normalizeString(payload.name);

    if (!name) {
      throw new AppError('name cannot be empty.', 400);
    }

    data.name = name;
  }

  if (payload.sku !== undefined) {
    const sku = normalizeString(payload.sku);
    data.sku = sku || null;
  }

  if (payload.unit !== undefined) {
    const unit = normalizeString(payload.unit).toUpperCase();

    if (!unit) {
      throw new AppError('unit cannot be empty.', 400);
    }

    data.unit = unit;
  }

  if (Object.keys(data).length === 0) {
    throw new AppError('At least one field must be provided to update the product.', 400);
  }

  return data;
}

function validateUpdateProductStatusInput(payload) {
  if (typeof payload.isActive !== 'boolean') {
    throw new AppError('isActive must be a boolean.', 400);
  }

  return {
    isActive: payload.isActive
  };
}

function validateCreateStockEntryInput(payload) {
  const supplierId = normalizeString(payload.supplierId);
  const reference = normalizeString(payload.reference);
  const notes = normalizeString(payload.notes);
  const entryDateValue = payload.entryDate ? new Date(payload.entryDate) : new Date();

  if (!supplierId) {
    throw new AppError('supplierId is required.', 400);
  }

  if (Number.isNaN(entryDateValue.getTime())) {
    throw new AppError('entryDate must be a valid date.', 400);
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    throw new AppError('items must contain at least one line.', 400);
  }

  const items = payload.items.map((item, index) => {
    const productId = normalizeString(item.productId);

    if (!productId) {
      throw new AppError(`items[${index}].productId is required.`, 400);
    }

    const quantity = Number(toDecimalNumber(item.quantity, `items[${index}].quantity`, { min: 0, allowZero: false }).toFixed(3));
    const unitPrice = Number(toDecimalNumber(item.unitPrice, `items[${index}].unitPrice`, { min: 0 }).toFixed(2));
    const lineTotal = Number((quantity * unitPrice).toFixed(2));

    return {
      productId,
      quantity,
      unitPrice,
      lineTotal
    };
  });

  return {
    supplierId,
    reference: reference || null,
    notes: notes || null,
    entryDate: entryDateValue,
    items
  };
}

module.exports = {
  serializeProduct,
  serializeStockEntry,
  validateCreateProductInput,
  validateUpdateProductInput,
  validateUpdateProductStatusInput,
  validateCreateStockEntryInput
};
