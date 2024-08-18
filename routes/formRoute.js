const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/formscreate', formController.createForm);
router.post('/forms', formController.getForms);
router.post('/form/:id', formController.getFormById);
router.put('/updateforms/:id', formController.updateForm);
router.delete('/deleteforms/:id', formController.deleteForm);

module.exports = router;