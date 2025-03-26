const jwt = require('jsonwebtoken');
// là admin có thể thực hiện các thao tác
const authMiddleWare = (req, res, next) => {

    const token =  req.headers['token']?.split(' ')[1]; // Lấy token từ header 
    if (!token) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Unauthorized: No token provided' 
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                status: 'error',
                message: 'Token expired',
            });
        }
        const isAdmin = user.isAdmin;
        if (!isAdmin) {
            return res.status(403).json({ 
                status: 'error',
                message: 'Unauthorized: Admin access required' 
            });
        }
        next();
    });
}
// là admin hoặc là user có thể thực hiện các thao tác
const authUserMiddleWare = (req, res, next) => {

    const token =  req.headers['token']?.split(' ')[1]; // Lấy token từ header 
    if (!token) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Unauthorized: No token provided' 
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                status: 'error',
                message: 'Token expired', 
            });
        }
        const userid = user.id;
        if (!userid) {
            return res.status(403).json({ 
                status: 'error',
                message: 'Unauthorized: Access denied' 
            });
        }
        next();
    });
}
module.exports = { authMiddleWare, authUserMiddleWare };