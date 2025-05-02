const ProductService = require('../services/ProductService');

class ProductController {
    createProduct = async (req, res) => {
        try {
            const { name, image, type, price, countInStock, rating, description,discount } = req.body;
            if (!name || !image || !type || !price || !countInStock || !rating || !discount) {
                return res.status(400).json({
                    status: 'error', 
                    message: 'Vui lòng điền đầy đủ thông tin' 
                });
            }
            const data = await ProductService.createProduct(req.body);
            res.json(data);
        } catch (error) {  
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    updateProduct = async (req, res) => {
        try {
            const { name, image, type, price, countInStock, rating, description } = req.body;
            const productId = req.params.id;
            if (!name || !image || !type || !price || !countInStock || !rating) {
                return res.status(400).json({
                    status: 'error', 
                    message: 'Vui lòng điền đầy đủ thông tin' 
                });
            }
            const data = await ProductService.updateProduct(productId,req.body);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    deleteProduct = async (req, res) => {
        try {
            const productId = req.params.id;
            if(!productId){
                return res.status(200).json({
                    status: 'error', 
                    message: 'Sản phẩm không tồn tại' 
                });
            }
            const data = await ProductService.deleteProduct(productId);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getAllProducts = async (req, res) => {
        try {
            const { limit, page, sort, filter } = req.query;
            const data = await ProductService.getAllProducts(Number(limit) || 8,Number(page) || 1,sort,filter);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getProduct = async (req, res) => {
        try {
            const productId = req.params.id;
            if(!productId){
                return res.status(400).json({
                    status: 'error', 
                    message: 'Sản phẩm không tồn tại' 
                });
            }
            const data = await ProductService.getProduct(productId);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    deleteManyProducts = async (req, res) => {
        try {
            const ids = req.body.ids;
            if(!ids){
                return res.status(200).json({
                    status: 'error', 
                    message: 'Sản phẩm không tồn tại' 
                });
            }
            const data = await ProductService.deleteManyProducts(ids);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getAllProductsType = async (req, res) => {
        try {
            const data = await ProductService.getAllProductsType();
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
}
module.exports = new ProductController();