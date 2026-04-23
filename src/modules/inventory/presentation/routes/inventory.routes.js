const express = require('express');

const authenticate = require('../../../../core/middleware/authenticate');
const inventoryController = require('../controllers/inventory.controller');

const router = express.Router();

router.use(authenticate);

router.get('/products', inventoryController.listProducts);
router.post('/products', inventoryController.createProduct);
router.get('/products/:id', inventoryController.getProductById);
router.patch('/products/:id', inventoryController.updateProduct);
router.patch('/products/:id/status', inventoryController.updateProductStatus);

router.get('/stock-entries', inventoryController.listStockEntries);
router.post('/stock-entries', inventoryController.createStockEntry);
router.get('/stock-entries/:id', inventoryController.getStockEntryById);

module.exports = router;