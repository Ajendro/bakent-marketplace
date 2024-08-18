const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');

router.post('/paymentMethodscreate', paymentMethodController.createPaymentMethod);
router.post('/paymentMethods', paymentMethodController.getPaymentMethods);
router.post('/paymentMethod/:id', paymentMethodController.getPaymentMethodById);
router.put('/updatepaymentMethods/:id', paymentMethodController.updatePaymentMethod);
router.delete('/deletedpaymentMethods/:id', paymentMethodController.deletePaymentMethod);

module.exports = router;
