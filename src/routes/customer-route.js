'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/customer-controller');
const authService = require('../services/auth-service');


router.get('/', controller.get);
router.get('/:id', controller.getById);

router.post('/authenticate', controller.authenticate);
router.post('/refres-token', authService.authorize, controller.refreshToken);
router.post('/', authService.authorize, controller.post);
router.put('/:id', authService.authorize, controller.put);
router.delete('/', authService.authorize, controller.delete);

module.exports = router;