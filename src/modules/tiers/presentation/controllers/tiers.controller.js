const prisma = require('../../../../core/database/prisma');
const catchAsync = require('../../../../core/utils/catch-async');
const AppError = require('../../../../core/errors/app-error');
const {
  serializeTier,
  serializeTierLedgerEntry,
  validateCreateTierInput,
  validateCreateLedgerEntryInput,
  validateUpdateTierInput,
  validateUpdateTierStatusInput,
  parseTierFilters
} = require('../../application/dto/tiers.dto');
const PrismaTiersRepository = require('../../infrastructure/repositories/prisma-tiers.repository');

const tiersRepository = new PrismaTiersRepository(prisma);

const listTiers = catchAsync(async (req, res) => {
  const filters = parseTierFilters(req.query);
  const tiers = await tiersRepository.findAll(filters);

  res.status(200).json({
    tiers: tiers.map(serializeTier)
  });
});

const getTierById = catchAsync(async (req, res) => {
  const tier = await tiersRepository.findById(req.params.id);

  if (!tier) {
    throw new AppError('Tier not found.', 404);
  }

  res.status(200).json({
    tier: serializeTier(tier)
  });
});

const createTier = catchAsync(async (req, res) => {
  const data = validateCreateTierInput(req.body);
  const tier = await tiersRepository.create(data);

  res.status(201).json({
    tier: serializeTier(tier)
  });
});

const updateTier = catchAsync(async (req, res) => {
  const existingTier = await tiersRepository.findById(req.params.id);

  if (!existingTier) {
    throw new AppError('Tier not found.', 404);
  }

  const data = validateUpdateTierInput(req.body);
  const tier = await tiersRepository.update(req.params.id, data);

  res.status(200).json({
    tier: serializeTier(tier)
  });
});

const updateTierStatus = catchAsync(async (req, res) => {
  const existingTier = await tiersRepository.findById(req.params.id);

  if (!existingTier) {
    throw new AppError('Tier not found.', 404);
  }

  const data = validateUpdateTierStatusInput(req.body);
  const tier = await tiersRepository.update(req.params.id, data);

  res.status(200).json({
    tier: serializeTier(tier)
  });
});

const listTierLedgerEntries = catchAsync(async (req, res) => {
  const tier = await tiersRepository.findById(req.params.id);

  if (!tier) {
    throw new AppError('Tier not found.', 404);
  }

  const entries = await tiersRepository.findLedgerEntriesByThirdPartyId(req.params.id);

  res.status(200).json({
    tier: serializeTier(tier),
    entries: entries.map(serializeTierLedgerEntry)
  });
});

const createTierLedgerEntry = catchAsync(async (req, res) => {
  const tier = await tiersRepository.findById(req.params.id);

  if (!tier) {
    throw new AppError('Tier not found.', 404);
  }

  const data = validateCreateLedgerEntryInput(req.body);
  const entry = await tiersRepository.createLedgerEntry(req.params.id, data);
  const updatedTier = await tiersRepository.findById(req.params.id);

  res.status(201).json({
    tier: serializeTier(updatedTier),
    entry: serializeTierLedgerEntry(entry)
  });
});

module.exports = {
  listTiers,
  getTierById,
  createTier,
  updateTier,
  updateTierStatus,
  listTierLedgerEntries,
  createTierLedgerEntry
};
