const express = require('express');
const router = express.Router(); 
const upload = require('../config/imagenes'); 
const productController = require('../controllers/productController');

router.post('/productscreate',upload.single('productImage'),productController.createProduct);
router.post('/products', productController.getProducts);
router.post('/product/:id', productController.getProductById);
router.put('/updateproducts/:id',upload.single('productImage'), productController.updateProduct);
router.delete('/deleteproducts/:id', productController.deleteProduct);
router.post('/products/user/:userId', productController.getProductsByUserId);

module.exports = router;
