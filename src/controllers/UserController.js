const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');
const createUser = async (req, res) => {
    try {
        const { email, password, confirmPassword} = req.body;
        // regex email
        const emailRegex = /\S+@\S+\.\S+/;
        const validEmail = emailRegex.test(email);
        if ( !email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'error', 
                message: 'Please fill in all fields' 
            });
        }
        else if(!validEmail){
            return res.status(200).json({
                status: 'error', 
                message: 'Invalid email' 
            });
        }

        else if(password !== confirmPassword){
            return res.status(200).json({
                status: 'error', 
                message: 'Password not match' 
            });
        }
        const data = await UserService.createUser(req.body);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const loginUser = async (req, res) => {
    try {
        // res.json(req.body);
        const { email, password} = req.body;
        // regex email
        const emailRegex = /\S+@\S+\.\S+/;
        const validEmail = emailRegex.test(email);
        if (!email || !password) {
            return res.status(200).json({
                status: 'error', 
                message: 'Please fill in all fields' 
            });
        }
        else if(!validEmail){
            return res.status(200).json({
                status: 'error', 
                message: 'Invalid email' 
            });
        }

        const data = await UserService.loginUser(req.body);
        const { refresh_token, ...newData } = data;
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true, // không lấy được bằng JS, chỉ lấy được bằng http request
            secure: false, //chỉ gửi cookie khi có https
            sameSite: 'None', // bả
        });
        res.json({...newData, refresh_token});
    } catch (error) {
        res.json(error);
    }
}
const loginUserGoogle = async (req, res) => {
    try{
        const { token } = req.body;
        if(!token){
            return res.status(200).json({
                status: 'error', 
                message: 'Token not found' 
            });
        }
        const data = await UserService.loginUserGoogle(token);
        res.json(data);
    }catch(error){
        res.json(error);
    }

}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, name, phone, address,city,avatar } = req.body;
        if(!userId){
            return res.status(200).json({
                status: 'error', 
                message: 'User not found' 
            });
        }
        // Kiểm tra email
        const emailRegex = /\S+@\S+\.\S+/;
        const validEmail = emailRegex.test(email);
        if(!validEmail){
            return res.status(200).json({
                status: 'error', 
                message: 'Email không hợp lệ' 
            });
        }
        // Kiểm tra số điện thoại
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        const validPhone = phoneRegex.test(phone);
        if(!validPhone){
            return res.status(200).json({
                status: 'error', 
                message: 'Số điện thoại không hợp lệ' 
            });
        }
        const data = await UserService.updateUser(userId,req.body);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if(!userId){
            return res.status(200).json({
                status: 'error', 
                message: 'User not found' 
            });
        }
        const data = await UserService.deleteUser(userId);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const getAllUsers = async (req, res) => {
    try {
        const data = await UserService.getAllUsers();
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if(!userId){
            return res.status(200).json({
                status: 'error', 
                message: 'User not found' 
            });
        }
        const data = await UserService.getUser(userId);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body.refresh_token;
        if(!refreshToken){
            return res.status(200).json({
                status: 'error', 
                message: 'Token not found' 
            });
        }
        const data = await JwtService.refreshTokenService(refreshToken);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token');
        
        res.json({
            status: 'success', 
            message: 'Logout successfully' 
        });
    } catch (error) {
        res.json(error);
    }
}
const deleteManyUsers = async (req, res) => {
    try {
        const ids = req.body.ids;
        if(!ids){
            return res.status(200).json({
                status: 'error', 
                message: 'User not found' 
            });
        }
        const data = await UserService.deleteManyUsers(ids);
        res.json(data);
    } catch (error) {
        res.json(error);
    }
}

module.exports = { 
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUser,
    refreshToken,
    logoutUser,
    deleteManyUsers,
    loginUserGoogle
};