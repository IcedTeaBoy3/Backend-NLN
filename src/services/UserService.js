const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('./JwtService');
const { OAuth2Client } = require("google-auth-library");
class UserService {
    createUser = async (newUser) => {
        try{
            const { email, password } = newUser;
            const checkEmail = await User.findOne({ email: email });
            if(checkEmail){
                return {
                    status: 'error', 
                    message: 'Email đã tồn tại' 
                };
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const createUser = await User.create({
                email: email,
                password: hashPassword,
            });
            if(createUser){
                return {
                    status: 'success',
                    message: 'Tạo tài khoản thành công',
                    data: createUser
                };
            }
            
        }catch(error){
            return {
                status: 'error',
                message: error.message
            }
        }
    }
    loginUser = async (loginUser) => {
        try {
            const {email, password } = loginUser;
            const checkEmail = await User.findOne({ email: email });
            if(!checkEmail){
                return {
                    status: 'error', 
                    message: 'Email không tồn tại' 
                };
            }
            const conparePassword = await bcrypt.compare(password, checkEmail.password);
            if(!conparePassword){
                return {
                    status: 'error', 
                    message: 'Sai mật khẩu' 
                };
            }
            const access_token = await generateAccessToken({
                id: checkEmail._id,
                isAdmin: checkEmail.isAdmin
            });
            const refresh_token = await generateRefreshToken({
                id: checkEmail._id,
                isAdmin: checkEmail.isAdmin
            });
            return {
                status: 'success',
                message: 'Đăng nhập thành công',
                access_token,
                refresh_token
            };
        }catch(error){
            return {
                status: 'error',
                message: error.message
            };
        }
            
    }
    loginUserGoogle = async (token) => {
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
                    return {
                        status: 'success', 
                        message: 'Login successfully',
                        access_token,
                        refresh_token
                    };
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
            return {
                status: 'success', 
                message: 'Login successfully',
                access_token,
                refresh_token
            };
        }
        catch(error){
            return {
                status: 'error',
                message: error.message
            };
        }
        
    }
    updateUser = async (userId, data) => { 
        try{
            const { email } = data;
            const checkUser = await User.findOne({ _id: userId });
            if(!checkUser){
                return {
                    status: 'error', 
                    message: 'Không tìm thấy user' 
                };
            }  
            const updateUser = await User.findByIdAndUpdate(userId, data, { new: true });
            return {
                status: 'success', 
                message: 'Cập nhật user thành công',
                updateUser
            };
        }
        catch(error){
            return {
                status: 'error',
                message: error.message
            };
        }
      
    }
    deleteUser = async (userId) => {
        try{
            const checkUser = await User.findOne({ _id: userId });
            if(!checkUser){
                return{
                    status: 'error', 
                    message: 'User không tồn tại' 
                };
            }
            if(checkUser.isAdmin){
                return {
                    status: 'error', 
                    message: 'Không thể xoá người dùng' 
                };
            }
            
            const deleteUser = await User.deleteOne({ _id: userId });
            return {
                status: 'success', 
                message: 'Xoá người dùng thành công',
                deleteUser
            };
        }
        catch(error){
            return {
                status: 'error',
                message: error.message
            };
        }
        
    }
    getAllUsers = async () => {
        try{
            const getAllUsers = await User.find().sort({ createdAt: -1 });
            return {
                status: 'success', 
                message: 'Lấy tất cả người dùng thành công',
                data: getAllUsers
            };
        }
        catch(error){
            return {
                status: 'error',
                message: error.message
            };
        }
        
    }
    getUser = async (userId) => {
        try{
            const getUser = await User.findOne({ _id: userId});
            if(!getUser){
                return {
                    status: 'error', 
                    message: 'Người dùng không tồn tại' 
                };
            }
            return {
                status: 'success', 
                message: 'Lấy người dùng thành công',
                data: getUser
            };
        }
        catch(error){
            return {
                status: 'error',
                message: error.message
            };
        }
       
    }
    deleteManyUsers = async (ids) => {
        
        try{
            const deleteManyUsers = await User.deleteMany({ _id: ids });
            return {
                status: 'success', 
                message: 'Xoá nhiều người dùng thành công',
                data: deleteManyUsers
            };
        }
        catch(error){
            return {
                status: 'error',
                message: error.message
            };
        }
        
    }
}
module.exports = new UserService()