const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendMailCreateOrder = async (customerEmail, orderItems, totalPrice, fullName, phone, city, address) => {
    // Cấu hình transporter với Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_ACCOUNT,  // Thay bằng email của bạn
            pass: process.env.MAIL_PASSWORD // Sử dụng App Password nếu dùng Gmail
        }
    });

    // HTML cho email
    const mailOptions = {
        from: process.env.MAIL_ACCOUNT,
        to: process.env.MAIL_ACCOUNT, // Gửi cho khách hàng
        subject: '🎉 Xác nhận đơn hàng của bạn!',
        html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #eee;">
                    <h2 style="color: #ff6600;">🛒 Đặt hàng thành công!</h2>
                    <p style="font-size: 16px; color: #333;">Cảm ơn <strong>${fullName}</strong> đã mua hàng!</p>
                </div>

                <div style="margin-top: 20px;">
                    <h3 style="color: #ff6600;">📦 Thông tin đơn hàng</h3>
                    <p><strong>Người nhận:</strong> ${fullName}</p>
                    <p><strong>Số điện thoại:</strong> ${phone}</p>
                    <p><strong>Địa chỉ giao hàng:</strong> ${address}, ${city}</p>
                </div>

                <div style="margin-top: 20px;">
                    <h3 style="color: #ff6600;">🛍 Danh sách sản phẩm</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="border-bottom: 2px solid #ddd; padding: 10px; text-align: left;">Sản phẩm</th>
                                <th style="border-bottom: 2px solid #ddd; padding: 10px; text-align: center;">Số lượng</th>
                                <th style="border-bottom: 2px solid #ddd; padding: 10px; text-align: center;">Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderItems.map(item => `
                                <tr>
                                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">
                                        <img src="${item.image}" width="50" style="border-radius: 5px; margin-right: 10px;"> 
                                        ${item.name}
                                    </td>
                                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.amount}</td>
                                    <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.price} VNĐ</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <div style="margin-top: 20px; text-align: right;">
                    <h3 style="color: #ff6600;">💰 Tổng tiền: ${totalPrice} VNĐ</h3>
                </div>

                <div style="margin-top: 20px; text-align: center;">
                    <p style="color: #555;">📞 Mọi thắc mắc vui lòng liên hệ <strong>Hotline: 1900 123 456</strong></p>
                    <p style="color: #555;">Cảm ơn bạn đã tin tưởng mua sắm! Chúng tôi sẽ sớm giao hàng. 🚀</p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        // console.error('❌ Lỗi khi gửi email:', error);
    }
};

module.exports = { sendMailCreateOrder };