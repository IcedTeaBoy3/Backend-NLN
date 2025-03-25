const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const {authMiddleWare} = require('../middleware/authMiddleWare');
// Product Routes
// create-product, update-product, delete-product, get-all-products, get-product
router.post('/create-product',authMiddleWare, productController.createProduct);
router.put('/update-product/:id',authMiddleWare, productController.updateProduct);
router.delete('/delete-product/:id',authMiddleWare, productController.deleteProduct);
router.get('/get-all-products', productController.getAllProducts);
router.get('/get-product/:id', productController.getProduct);
router.post('/delete-many-products',authMiddleWare, productController.deleteManyProducts);
router.get('/get-all-products-type', productController.getAllProductsType);
module.exports = router;