const OrderService = require('../services/OrderService');
class OrderController {
    createOrder = async (req, res) => {
        try {
            const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, shippingMethod} = req.body;
            if (!paymentMethod || !itemsPrice  || !totalPrice || !fullName || !address || !city || !phone || !user || !shippingMethod) {
                return res.status(200).json({
                    status: 'error', 
                    message: 'Vui lòng nhập đầy đủ thông tin' 
                });
            }
            const data = await OrderService.createOrder(req.body);
            res.json(data);
        } catch (error) {
            
            res.status(500).json({
                status: 'error', 
                message: error.message 
            });
        }
    }
    getAllOrder = async (req, res) => {
        try {
            const userId = req.params.id;
            if(!userId){
                return res.status(200).json({
                    status: 'error', 
                    message: 'User không tồn tại' 
                });
            }
            const data = await OrderService.getAllOrder(userId);
            
            res.json(data);
        } catch (error) { 
            res.status(500).json({
                status: 'error', 
                message: error.message 
            });
        }
    } 
    getDetailOrder = async (req, res) => {
        try {
            const orderId = req.params.id;
            if(!orderId){
                return res.status(200).json({
                    status: 'error', 
                    message: 'Order không tồn tại' 
                });
            }
            const data = await OrderService.getDetailOrder(orderId);
            
            res.json(data);
        } catch (error) {
            
            res.status(500).json({
                status: 'error', 
                message: error.message 
            });
        }
    }
    cancelOrder = async (req, res) => {
        try {
            const orderId = req.params.id;
            if(!orderId){
                return res.status(200).json({
                    status: 'error', 
                    message: 'Order không tồn tại' 
                });
            }
            const data = await OrderService.cancelOrder(orderId);
            
            res.json(data);
        } catch (error) { 
            res.status(500).json({
                status: 'error', 
                message: error.message 
            });
        }
    }
    getAllOrderAdmin = async (req, res) => {
        try {
            const data = await OrderService.getAllOrderAdmin(); 
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error', 
                message: error.message 
            });
        }
    }
}
module.exports = new OrderController();