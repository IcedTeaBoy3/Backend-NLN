const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');
const {authUserMiddleWare, authMiddleWare} = require('../middleware/authMiddleWare');

router.post('/create-order',authUserMiddleWare, orderController.createOrder);
router.get('/get-all-order/:id',authUserMiddleWare, orderController.getAllOrder);
router.get('/get-detail-order/:id',authUserMiddleWare, orderController.getDetailOrder);
router.delete('/cancel-order/:id',authUserMiddleWare, orderController.cancelOrder);
router.get('/get-all-order',authMiddleWare,orderController.getAllOrderAdmin);
module.exports = router;