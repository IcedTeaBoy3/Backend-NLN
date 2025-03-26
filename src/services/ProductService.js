const { Cursor } = require('mongoose');
const Product = require('../models/Product');
const createProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description,discount } = data;
        try{
            const checkProduct = await Product.findOne({name: name});
            if(checkProduct){
                return reject({
                    status: 'error',
                    message: 'Product already exists'
                });
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
            resolve({
                status: 'success',
                message: 'Product created successfully',
                data: createProduct
            });
        }
        catch(err){
            
            reject({
                status: 'error',
                message: 'error creating product'
            });
        }
    });
}
const updateProduct = (id ,data) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, type, price, countInStock, rating, description } = data;
        try{
            const checkProduct = await Product.findOne({_id: id});
            if(!checkProduct){
                return reject({
                    status: 'error',
                    message: 'Product not found'
                });
            }
            const updateProduct = await Product.findByIdAndUpdate(id, data, {new: true});
            resolve({
                status: 'success',
                message: 'Product updated successfully',
                data: updateProduct
            });
        }
        catch(err){
            reject({
                status: 'error',
                message: 'Product not found'
            });
        }
    });
}
const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const deleteProduct = await Product.deleteOne({_id: id});
            resolve({
                status: 'success',
                message: 'Product deleted successfully',
                data: deleteProduct
            });
        }
        catch(err){
            reject({
                status: 'error',
                message: 'Product not found'
            });
        }
    });
}
const getAllProducts = (limit=8,page=1,sort,filter) => {
    return new Promise(async (resolve, reject) => {
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
            resolve({
                status: 'success',
                message: 'All products',
                data: products,
                totalProducts,
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
            });
        }
        catch(err){
            reject({
                status: 'error',
                message: 'No products found'
            });
        }
    });
}
const getProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            const product = await Product.findOne({_id: id});
            resolve({
                status: 'success',
                message: 'Product found',
                data: product
            });
        }
        catch(err){
            reject({
                status: 'error',
                message: 'Product not found'
            });
        }
    });
}
const deleteManyProducts = (ids) => {
    return new Promise(async (resolve, reject) => {
        try{
            
            const deleteManyProducts = await Product.deleteMany({_id: ids});
            resolve({
                status: 'success',
                message: 'Products deleted successfully',
                data: deleteManyProducts
            });
        }
        catch(err){
            reject({
                status: 'error',
                message: 'Products not found'
            });
        }
    });
}
const getAllProductsType = () => {
    return new Promise(async (resolve, reject) => {
        try{
            const allTypes = await Product.distinct('type');
            resolve({
                status: 'success',
                message: 'All products type',
                data: allTypes
            });
        }
        catch(err){
            reject({
                status: 'error',
                message: 'No products found'
            });
        }
    });
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProduct,
    deleteManyProducts,
    getAllProductsType
};  