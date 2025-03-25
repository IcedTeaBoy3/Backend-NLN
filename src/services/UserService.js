const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('./JwtService');
const createUser = (newUser) => {
    // Add your code here

    const { email, password, confirmPassword } = newUser;
    return new Promise(async (resolve, reject) => {
        try{
            const checkEmail = await User.findOne({ email: email });
            if(checkEmail){
                resolve({
                    status: 'error', 
                    message: 'Email already exists' 
                });
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const createUser = await User.create({
                email: email,
                password: hashPassword,
            });
            if(createUser){
                resolve({
                    status: 'success', 
                    message: 'User created successfully',
                    data: createUser
                });
            }
        }
        catch(error){
            reject(error);
        }
    });
}
const loginUser = (loginUser) => {
    // Add your code here
    const {email, password } = loginUser;
    return new Promise(async (resolve, reject) => {
        try{
            const checkEmail = await User.findOne({ email: email });
            if(!checkEmail){
                resolve({
                    status: 'error', 
                    message: 'Email not found' 
                });
            }
            const conparePassword = await bcrypt.compare(password, checkEmail.password);
            if(!conparePassword){
                resolve({
                    status: 'error', 
                    message: 'Wrong Password' 
                });
            }
            const access_token = await generateAccessToken({
                id: checkEmail._id,
                isAdmin: checkEmail.isAdmin
            });
            const refresh_token = await generateRefreshToken({
                id: checkEmail._id,
                isAdmin: checkEmail.isAdmin
            });
            resolve({
                status: 'success', 
                message: 'Login successfully',
                access_token,
                refresh_token
            });
        }
        catch(error){
            reject(error);
        }
    });
}
const updateUser = (userId, data) => {
    // Add your code here
    return new Promise(async (resolve, reject) => {
        try{
            const checkUser = await User.findOne({ _id: userId });
            if(!checkUser){
                resolve({
                    status: 'error', 
                    message: 'User not found' 
                });
            }
            
            const updateUser = await User.findByIdAndUpdate(userId, data, { new: true });
            resolve({
                status: 'success', 
                message: 'User updated successfully',
                updateUser
            });
        }
        catch(error){
            reject(error);
        }
    });
}
const deleteUser = (userId) => {
    // Add your code here
    return new Promise(async (resolve, reject) => {
        try{
            const checkUser = await User.findOne({ _id: userId });
            if(!checkUser){
                resolve({
                    status: 'error', 
                    message: 'User not found' 
                });
            }
            
            const deleteUser = await User.deleteOne({ _id: userId });
            resolve({
                status: 'success', 
                message: 'User deleted successfully',
                deleteUser
            });
        }
        catch(error){
            reject(error);
        }
    });
}
const getAllUsers = () => {
    // Add your code here
    return new Promise(async (resolve, reject) => {
        try{
            const getAllUsers = await User.find();
            resolve({
                status: 'success', 
                message: 'Get all users successfully',
                data: getAllUsers
            });
        }
        catch(error){
            reject(error);
        }
    });
}
const getUser = (userId) => {
    // Add your code here
    return new Promise(async (resolve, reject) => {
        try{
            const getUser = await User.findOne({ _id: userId});
            if(!getUser){
                resolve({
                    status: 'error', 
                    message: 'User not found' 
                });
            }
            resolve({
                status: 'success', 
                message: 'Get user successfully',
                data: getUser
            });
        }
        catch(error){
            reject(error);
        }
    });
}
const deleteManyUsers = (ids) => {
    // Add your code here
    return new Promise(async (resolve, reject) => {
        try{
            const deleteManyUsers = await User.deleteMany({ _id: ids });
            resolve({
                status: 'success', 
                message: 'Delete many users successfully',
                data: deleteManyUsers
            });
        }
        catch(error){
            reject(error);
        }
    });
}
module.exports = { 
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUser,
    deleteManyUsers
};