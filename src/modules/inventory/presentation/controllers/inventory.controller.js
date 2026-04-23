const prisma = require('../../../../core/database/prisma');
const catchAsync = require('../../../../core/utils/catch-async');
const AppError = require('../../../../core/errors/app-error');
const {
  serializeProduct,
  serializeStockEntry,
  validateCreateProductInput,
  validateUpdateProductInput,
  validateUpdateProductStatusInput,
  validateCreateStockEntryInput
} = require('../../application/dto/inventory.dto');
const createStockEntryUseCase = require('../../application/use-cases/create-stock-entry.use-case');
const PrismaProductsRepository = require('../../infrastructure/repositories/prisma-products.repository');
const PrismaStockEntriesRepository = require('../../infrastructure/repositories/prisma-stock-entries.repository');

const productsRepository = new PrismaProductsRepository(prisma);
const stockEntriesRepository = new PrismaStockEntriesRepository(prisma);

const listProducts = catchAsync(async (req, res) => {
  const products = await productsRepository.findAll();

  res.status(200).json({
    products: products.map(serializeProduct)
  });
});

const getProductById = catchAsync(async (req, res) => {
  const product = await productsRepository.findById(req.params.id);

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  res.status(200).json({
    product: serializeProduct(product)
  });
});

const createProduct = catchAsync(async (req, res) => {
  const data = validateCreateProductInput(req.body);

  if (data.sku) {
    const existingProduct = await productsRepository.findBySku(data.sku);

    if (existingProduct) {
      throw new AppError('A product already exists with this sku.', 409);
    }
  }

  const product = await productsRepository.create(data);

  res.status(201).json({
    product: serializeProduct(product)
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const existingProduct = await productsRepository.findById(req.params.id);

  if (!existingProduct) {
    throw new AppError('Product not found.', 404);
  }

  const data = validateUpdateProductInput(req.body);

  if (data.sku && data.sku !== existingProduct.sku) {
    const productWithSameSku = await productsRepository.findBySku(data.sku);

    if (productWithSameSku) {
      throw new AppError('A product already exists with this sku.', 409);
    }
  }

  const product = await productsRepository.update(req.params.id, data);

  res.status(200).json({
    product: serializeProduct(product)
  });
});

const updateProductStatus = catchAsync(async (req, res) => {
  const existingProduct = await productsRepository.findById(req.params.id);

  if (!existingProduct) {
    throw new AppError('Product not found.', 404);
  }

  const data = validateUpdateProductStatusInput(req.body);
  const product = await productsRepository.update(req.params.id, data);

  res.status(200).json({
    product: serializeProduct(product)
  });
});

const listStockEntries = catchAsync(async (req, res) => {
  const entries = await stockEntriesRepository.findAll();

  res.status(200).json({
    entries: entries.map(serializeStockEntry)
  });
});

const getStockEntryById = catchAsync(async (req, res) => {
  const entry = await stockEntriesRepository.findById(req.params.id);

  if (!entry) {
    throw new AppError('Stock entry not found.', 404);
  }

  res.status(200).json({
    entry: serializeStockEntry(entry)
  });
});

const createStockEntry = catchAsync(async (req, res) => {
  const data = validateCreateStockEntryInput(req.body);
  const entry = await createStockEntryUseCase(prisma, data);

  res.status(201).json({
    entry: serializeStockEntry(entry)
  });
});

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  listStockEntries,
  getStockEntryById,
  createStockEntry
};
