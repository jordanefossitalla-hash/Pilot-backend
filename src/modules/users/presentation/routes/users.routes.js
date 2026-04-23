const express = require('express');

const authenticate = require('../../../../core/middleware/authenticate');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', usersController.listUsers);
router.get('/:id', usersController.getUserById);
router.patch('/:id', usersController.updateUser);
router.patch('/:id/status', usersController.updateUserStatus);

module.exports = router;
