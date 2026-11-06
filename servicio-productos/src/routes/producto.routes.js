const express = require('express');
const router = express.Router();
const productController = require('../controllers/producto.controller');

//Los ENDPOINT para el CRUD completo
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

//ENDPOINT para consumir con los pedidos
router.patch('/:id/discount', productController.discountStock);

module.exports = router;