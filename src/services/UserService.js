const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('./JwtService');
const { OAuth2Client } = require("google-auth-library");
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
const loginUserGoogle = (token) => {
    return new Promise(async (resolve, reject) => {
        try{
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const { email, name, picture } = ticket.getPayload();
            const checkEmail = await User.findOne({ email: email });
            if(!checkEmail){
                const createUser = await User.create({
                    email: email,
                    name: name,
                    avatar: picture,
                    isAdmin: false
                });
                if(createUser){
                    const access_token = await generateAccessToken({
                        id: createUser._id,
                        isAdmin: createUser.isAdmin
                    });
                    const refresh_token = await generateRefreshToken({
                        id: createUser._id,
                        isAdmin: createUser.isAdmin
                    });
                    resolve({
                        status: 'success', 
                        message: 'Login successfully',
                        access_token,
                        refresh_token
                    });
                }
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
            const { email } = data;
            const checkUser = await User.findOne({ _id: userId });
            if(!checkUser){
                resolve({
                    status: 'error', 
                    message: 'Không tìm thấy user' 
                });
            }
            
            
            const updateUser = await User.findByIdAndUpdate(userId, data, { new: true });
            resolve({
                status: 'success', 
                message: 'Cập nhật user thành công',
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
    deleteManyUsers,
    loginUserGoogle
};