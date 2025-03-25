const jwt = require('jsonwebtoken');
// là admin có thể thực hiện các thao tác
const authMiddleWare = (req, res, next) => {

    const token =  req.headers['token']?.split(' ')[1]; // Lấy token từ header 
    if (!token) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Unauthorized' 
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
                message: 'Unauthorized' 
            });
        }
        next();
    });
}
// là admin hoặc là user có thể thực hiện các thao tác
const authUserMiddleWare = (req, res, next) => {

    const token =  req.headers['token']?.split(' ')[1]; // Lấy token từ header 
    const userId = req.params.id;
    if (!token) {
        return res.status(401).json({ 
            status: 'error',
            message: 'Unauthorized1' 
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
        const id = user.id;
        if (!isAdmin && id !== userId) {
            return res.status(403).json({ 
                status: 'error',
                message: 'Unauthorized3' 
            });
        }
        next();
    });
}
module.exports = { authMiddleWare, authUserMiddleWare };