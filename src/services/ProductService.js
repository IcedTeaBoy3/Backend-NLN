const { Cursor } = require('mongoose');
const Product = require('../models/Product');
class ProductService {
    createProduct = async (data) => {  
        const { name, image, type, price, countInStock, rating, description,discount } = data;
        try{
            const checkProduct = await Product.findOne({name: name});
            if(checkProduct){
                return {
                    status: 'error',
                    message: 'Sản phẩm đã tồn tại'
                };
            }
            const createProduct = await Product.create({
                name: name,
                image: image,
                type: type,
                price: price,
                countInStock: countInStock,
                rating: rating,
                discount: Number(discount),
                description: description,
            });
            return {
                status: 'success',
                message: 'Thêm sản phẩm thành công',
                data: createProduct
            };
        }
        catch(error){ 
            return {
                status: 'error',
                message: error.message
            };
        }
        
    }
    updateProduct = async (id ,data) => {
        const { name, image, type, price, countInStock, rating, description } = data;
        try{
            const checkProduct = await Product.findOne({_id: id});
            if(!checkProduct){
                return {
                    status: 'error',
                    message: 'Sản phẩm không tồn tại'
                };
            }
            const updateProduct = await Product.findByIdAndUpdate(id, data, {new: true});
            return {
                status: 'success',
                message: 'Cập nhật sản phẩm thành công',
                data: updateProduct
            };
        }
        catch(err){
            return {
                status: 'error',
                message: err.message
            };
        }
        
    }
    deleteProduct = async (id) => {
        try{
            const deleteProduct = await Product.deleteOne({_id: id});
            return {
                status: 'success',
                message: 'Xoá sản phẩm thành công',
                data: deleteProduct
            };
        }
        catch(err){
            return {
                status: 'error',
                message: err.message
            };
        }
        
    }
    getAllProducts = async (limit=8,page=1,sort,filter) => {
        try{
            
            // Tạo object điều kiện lọc từ filter
            let filterCondition = {};
            if (filter && Array.isArray(filter) && filter.length === 2) {
                const [filterKey, filterValue] = filter;
                filterCondition = {
                    [filterKey]: { $regex: filterValue, $options: 'i' }, // Không phân biệt hoa thường
                };
            }

            // Tính tổng số sản phẩm theo điều kiện lọc
            const totalProducts = await Product.countDocuments(filterCondition);

            // Tạo truy vấn với điều kiện lọc
            let queryProduct = Product.find(filterCondition)
                
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(limit * (page - 1))
            // Áp dụng sắp xếp nếu có
            if (sort && Array.isArray(sort) && sort.length === 2) {
                const [sortKey, sortValue] = sort;
                queryProduct = queryProduct.sort({ [sortKey]: sortValue });
            }

            // Thực thi truy vấn
            const products = await queryProduct;

            // Trả về kết quả
            return {
                status: 'success',
                message: 'Lấy tất cả sản phẩm thành công',
                data: products,
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
            };
        }
        catch(err){
            return {
                status: 'error',
                message: err.message
            };
        }
    }
    getProduct = async (id) => {
       
        try{
            const product = await Product.findOne({_id: id});
            return {
                status: 'success',
                message: 'Tìm thấy sản phẩm',
                data: product
            };
        }
        catch(err){
            return {
                status: 'error',
                message: err.message
            };
        }
        
    }
    deleteManyProducts = async(ids) => {
        
        try{
            
            const deleteManyProducts = await Product.deleteMany({_id: ids});
            return {
                status: 'success',
                message: 'Xoá nhiều sản phẩm thành công',
                data: deleteManyProducts
            };
        }
        catch(err){
            return {
                status: 'error',
                message: err.message
            };
        }
        
    }
    getAllProductsType = async () => {
        
        try{
            const allTypes = await Product.distinct('type');
            return {
                status: 'success',
                message: 'Lấy tất cả loại sản phẩm thành công',
                data: allTypes
            };
        }
        catch(err){
            return {
                status: 'error',
                message: err.message
            };
        }
        
    }
}
module.exports = new ProductService();