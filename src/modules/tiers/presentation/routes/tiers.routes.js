const express = require('express');

const authenticate = require('../../../../core/middleware/authenticate');
const tiersController = require('../controllers/tiers.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', tiersController.listTiers);
router.post('/', tiersController.createTier);
router.get('/:id', tiersController.getTierById);
router.patch('/:id', tiersController.updateTier);
router.patch('/:id/status', tiersController.updateTierStatus);
router.get('/:id/ledger-entries', tiersController.listTierLedgerEntries);
router.post('/:id/ledger-entries', tiersController.createTierLedgerEntry);

module.exports = router;
