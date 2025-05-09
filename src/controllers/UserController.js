const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');

class UserController{
    createUser = async (req, res) => {
        try {
            const { email, password, confirmPassword} = req.body;
            // regex email
            const emailRegex = /\S+@\S+\.\S+/;
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            const validPassword = passwordRegex.test(password);
            const validEmail = emailRegex.test(email);
            if ( !email || !password || !confirmPassword) {
                return res.status(400).json({
                    status: 'error', 
                    message: 'Vui lòng điền đầy đủ thông tin' 
                });
            }
            else if(!validEmail){
                return res.status(400).json({
                    status: 'error', 
                    message: 'Email không đúng định dạng' 
                });
            }else if(!validPassword){
                return res.status(400).json({
                    status: 'error',
                    message: 'Mật khẩu có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
                });
            }
            else if(password !== confirmPassword){
                return res.status(400).json({
                    status: 'error', 
                    message: 'Mật khẩu không khớp' 
                });
            }
            const data = await UserService.createUser(req.body);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    loginUser = async (req, res) => {
        try {
            const { email, password} = req.body;
            const emailRegex = /\S+@\S+\.\S+/;
            const validEmail = emailRegex.test(email);
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error', 
                    message: 'Vui lòng điền đầy đủ thông tin' 
                });
            }
            else if(!validEmail){
                return res.status(400).json({
                    status: 'error', 
                    message: 'Email không đúng định dạng' 
                });
            }
    
            const data = await UserService.loginUser(req.body);
            const { refresh_token,statusCode, ...newData } = data;
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true, // không lấy được bằng JS, chỉ lấy được bằng http request
                secure: false, //chỉ gửi cookie khi có https
                sameSite: 'None', // bả
            });
            res.json({...newData, refresh_token});
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    loginUserGoogle = async (req, res) => {
        try{
            const { token } = req.body;
            if(!token){
                return res.status(400).json({
                    status: 'error', 
                    message: 'Token không tồn tại' 
                });
            }
            const data = await UserService.loginUserGoogle(token);
            res.json(data);
        }catch(error){
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    
    }
    loginUserFacebook = async (req, res) => {
        try{
            const data = await UserService.loginUserFacebook(req.body);
            res.json(data);
        }catch(error){
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    updateUser = async (req, res) => {
        try {
            const userId = req.params.id;
            const { email, name, phone, address,city,avatar } = req.body;
            if(!userId){
                return res.status(400).json({
                    status: 'error', 
                    message: 'User không tồn tại' 
                });
            }
            // Kiểm tra email
            const emailRegex = /\S+@\S+\.\S+/;
            const validEmail = emailRegex.test(email);
            if(!validEmail){
                return res.status(400).json({
                    status: 'error', 
                    message: 'Email không hợp lệ' 
                });
            }
            // Kiểm tra số điện thoại
            const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
            const validPhone = phoneRegex.test(phone);
            if(!validPhone){
                return res.status(400).json({
                    status: 'error', 
                    message: 'Số điện thoại không hợp lệ' 
                });
            }
            const data = await UserService.updateUser(userId,req.body);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    deleteUser = async (req, res) => {
        try {
            const userId = req.params.id;
            if(!userId){
                return res.status(400).json({
                    status: 'error', 
                    message: 'User not found' 
                });
            }
            const data = await UserService.deleteUser(userId);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getAllUsers = async (req, res) => {
        try {
            const data = await UserService.getAllUsers();
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    getUser = async (req, res) => {
        try {
            const userId = req.params.id;
            if(!userId){
                return res.status(400).json({
                    status: 'error', 
                    message: 'User không tồn tại' 
                });
            }
            const data = await UserService.getUser(userId);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    refreshToken = async (req, res) => {
        try {
            const refreshToken = req.body.refresh_token;
            if(!refreshToken){
                return res.status(400).json({
                    status: 'error', 
                    message: 'Token không tồn tại' 
                });
            }
            const data = await JwtService.refreshTokenService(refreshToken);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    logoutUser = async (req, res) => {
        try {
            res.clearCookie('refresh_token');
            
            res.json({
                status: 'success', 
                message: 'Đăng xuất thành công' 
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }
    deleteManyUsers = async (req, res) => {
        try {
            const ids = req.body.ids;
            if(!ids){
                return res.status(200).json({
                    status: 'error', 
                    message: 'User không tồn tại' 
                });
            }
            const data = await UserService.deleteManyUsers(ids);
            res.json(data);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: error.message
            });
        }
    }

}
module.exports = new UserController();