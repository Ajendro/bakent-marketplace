const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authenticationController');
router.post('/authentications', authenticationController.createAuthentication);
router.post('/authentications/all', authenticationController.getAuthentications);
router.post('/authentications/:id', authenticationController.getAuthenticationById);
router.put('/updateauthentications/:id', authenticationController.updateAuthentication);
router.delete('/deleteauthentications/:id', authenticationController.deleteAuthentication);

module.exports = router;
