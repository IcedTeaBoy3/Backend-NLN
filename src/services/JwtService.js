const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
    
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '30m' });
    return access_token;

}
const generateRefreshToken = (payload) => {
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '365d' });
    return refresh_token;
}
const refreshTokenService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    return reject({
                        status: 'error', 
                        message: 'Invalid token'
                    });
                }

                if (!user) {
                    return reject({
                        status: 'error', 
                        message: 'User data not found in token'
                    });
                }

                try {
                    const access_token = await generateAccessToken({
                        id: user.id,
                        isAdmin: user.isAdmin
                    });

                    resolve({
                        status: 'success', 
                        message: 'Token refreshed',
                        access_token
                    });
                } catch (tokenError) {
                    reject({
                        status: 'error',
                        message: 'Failed to generate new access token'
                    });
                }
            });
        } catch (e) {
            reject({
                status: 'error',
                message: 'Internal server error'
            });
        }
    });
};


module.exports = {generateAccessToken, generateRefreshToken,refreshTokenService};

