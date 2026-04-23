const AppError = require('../../../../core/errors/app-error');
const { computeTierBalance } = require('../../domain/services/tier-balance.service');

const allowedTypes = ['CUSTOMER', 'SUPPLIER', 'BOTH'];
const allowedDirections = ['DEBIT', 'CREDIT'];
const allowedManualLedgerEntryTypes = ['OPENING_BALANCE', 'PAYMENT_IN', 'PAYMENT_OUT', 'MANUAL_ADJUSTMENT'];

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function serializeTier(tier) {
  const balance = computeTierBalance(tier.ledgerEntries || []);

  return {
    id: tier.id,
    name: tier.name,
    type: tier.type,
    phone: tier.phone,
    email: tier.email,
    address: tier.address,
    isActive: tier.isActive,
    balance: balance.balance,
    balanceDirection: balance.balanceDirection,
    createdAt: tier.createdAt,
    updatedAt: tier.updatedAt
  };
}

function serializeTierLedgerEntry(entry) {
  return {
    id: entry.id,
    entryType: entry.entryType,
    direction: entry.direction,
    amount: Number(entry.amount),
    reference: entry.reference,
    description: entry.description,
    createdAt: entry.createdAt
  };
}

function normalizePositiveAmount(value, fieldName) {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new AppError(`${fieldName} must be a positive number or zero.`, 400);
  }

  return Number(amount.toFixed(2));
}

function normalizeTierData(payload, { requireName = false, requireType = false } = {}) {
  const data = {};

  if (payload.name !== undefined || requireName) {
    const name = normalizeString(payload.name);

    if (!name) {
      throw new AppError('name is required.', 400);
    }

    data.name = name;
  }

  if (payload.type !== undefined || requireType) {
    const type = normalizeString(payload.type).toUpperCase();

    if (!allowedTypes.includes(type)) {
      throw new AppError('type must be CUSTOMER, SUPPLIER or BOTH.', 400);
    }

    data.type = type;
  }

  if (payload.phone !== undefined) {
    const phone = normalizeString(payload.phone);
    data.phone = phone || null;
  }

  if (payload.email !== undefined) {
    const email = normalizeString(payload.email).toLowerCase();

    if (email && !validateEmail(email)) {
      throw new AppError('Invalid email address.', 400);
    }

    data.email = email || null;
  }

  if (payload.address !== undefined) {
    const address = normalizeString(payload.address);
    data.address = address || null;
  }

  if (payload.openingBalance !== undefined) {
    data.openingBalance = normalizePositiveAmount(payload.openingBalance, 'openingBalance');
  }

  if (payload.openingBalanceDirection !== undefined) {
    const openingBalanceDirection = normalizeString(payload.openingBalanceDirection).toUpperCase();

    if (!allowedDirections.includes(openingBalanceDirection)) {
      throw new AppError('openingBalanceDirection must be DEBIT or CREDIT.', 400);
    }

    data.openingBalanceDirection = openingBalanceDirection;
  }

  if (payload.openingBalanceReference !== undefined) {
    const openingBalanceReference = normalizeString(payload.openingBalanceReference);
    data.openingBalanceReference = openingBalanceReference || null;
  }

  if (payload.openingBalanceDescription !== undefined) {
    const openingBalanceDescription = normalizeString(payload.openingBalanceDescription);
    data.openingBalanceDescription = openingBalanceDescription || null;
  }

  return data;
}

function validateCreateTierInput(payload) {
  const data = normalizeTierData(payload, { requireName: true, requireType: true });

  if (data.openingBalance > 0 && !data.openingBalanceDirection) {
    throw new AppError('openingBalanceDirection is required when openingBalance is greater than zero.', 400);
  }

  if (!data.openingBalance) {
    data.openingBalance = 0;
    data.openingBalanceDirection = null;
  }

  return data;
}

function validateUpdateTierInput(payload) {
  const data = normalizeTierData(payload);

  if (Object.keys(data).length === 0) {
    throw new AppError('At least one field must be provided to update the tier.', 400);
  }

  return data;
}

function validateUpdateTierStatusInput(payload) {
  if (typeof payload.isActive !== 'boolean') {
    throw new AppError('isActive must be a boolean.', 400);
  }

  return {
    isActive: payload.isActive
  };
}

function parseTierFilters(query) {
  const type = normalizeString(query.type).toUpperCase();

  if (!type) {
    return {};
  }

  if (!allowedTypes.includes(type)) {
    throw new AppError('type filter must be CUSTOMER, SUPPLIER or BOTH.', 400);
  }

  return { type };
}

function validateCreateLedgerEntryInput(payload) {
  const entryType = normalizeString(payload.entryType).toUpperCase();
  const direction = normalizeString(payload.direction).toUpperCase();
  const reference = normalizeString(payload.reference);
  const description = normalizeString(payload.description);

  if (!allowedManualLedgerEntryTypes.includes(entryType)) {
    throw new AppError('entryType must be OPENING_BALANCE, PAYMENT_IN, PAYMENT_OUT or MANUAL_ADJUSTMENT.', 400);
  }

  if (!allowedDirections.includes(direction)) {
    throw new AppError('direction must be DEBIT or CREDIT.', 400);
  }

  return {
    entryType,
    direction,
    amount: normalizePositiveAmount(payload.amount, 'amount'),
    reference: reference || null,
    description: description || null
  };
}

module.exports = {
  serializeTier,
  serializeTierLedgerEntry,
  validateCreateTierInput,
  validateUpdateTierInput,
  validateUpdateTierStatusInput,
  parseTierFilters,
  validateCreateLedgerEntryInput
};
