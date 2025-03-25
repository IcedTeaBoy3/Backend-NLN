const OrderService = require('../services/OrderService');
const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, shippingMethod} = req.body;
        if (!paymentMethod || !itemsPrice  || !totalPrice || !fullName || !address || !city || !phone || !user || !shippingMethod) {
            return res.status(200).json({
                status: 'error', 
                message: 'Please fill in all fields' 
            });
        }
        const data = await OrderService.createOrder(req.body);
        res.json(data);
    } catch (error) {
        
        res.json(error);
    }
}
const getAllOrder = async (req, res) => {
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
        
        res.json(error);
    }
} 
const getDetailOrder = async (req, res) => {
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
        
        res.json(error);
    }
}
const cancelOrder = async (req, res) => {
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
        
        res.json(error);
    }
}
const getAllOrderAdmin = async (req, res) => {
    try {
        const data = await OrderService.getAllOrderAdmin();
        
        res.json(data);
    } catch (error) {
        
        res.json(error);
    }
}
module.exports = {
    createOrder,
    getAllOrder,
    getDetailOrder,
    cancelOrder,
    getAllOrderAdmin
};