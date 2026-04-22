const nodemailer = require('nodemailer');

/**
 * Email Service
 * Hỗ trợ gửi email qua múi dịch vụ khác nhau
 * - Development: Ethereal (test email miễn phí)
 * - Production: Gmail, Mailtrap, hoặc SMTP tùy chỉnh
 */

let transporter = null;
let etherealTestAccount = null;

/**
 * Khởi tạo email service
 */
async function initializeEmailService() {
    try {
        if (process.env.NODE_ENV === 'production') {
            // Production: Dùng cấu hình từ .env
            const mailConfig = {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            };

            transporter = nodemailer.createTransport(mailConfig);

            // Kiểm tra connection
            await transporter.verify();
            console.log('✓ Email service connected (Production SMTP)');

            return transporter;
        } else {
            // Development: Dùng Ethereal Email (test email miễn phí)
            etherealTestAccount = await nodemailer.createTestAccount();

            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: etherealTestAccount.user,
                    pass: etherealTestAccount.pass
                }
            });

            console.log(`
╔════════════════════════════════════════════════╗
║       📧 EMAIL SERVICE - Development Mode      ║
╠════════════════════════════════════════════════╣
║                                                ║
║  Test Email Account:                           ║
║  User: ${etherealTestAccount.user.padEnd(30)} ║
║  Pass: ${etherealTestAccount.pass.padEnd(30)} ║
║                                                ║
║  ✓ Emails will be sent to Ethereal            ║
║  ✓ Preview links will be logged               ║
║                                                ║
╚════════════════════════════════════════════════╝
            `);

            return transporter;
        }
    } catch (error) {
        console.error('❌ Email service initialization failed:', error.message);
        throw error;
    }
}

/**
 * Gửi email OTP
 * @param {string} recipientEmail - Email người nhận
 * @param {string} otp - Mã OTP
 * @param {string} recipientName - Tên người nhận
 * @returns {Promise<object>} - Kết quả gửi và preview link
 */
async function sendOTPEmail(recipientEmail, otp, recipientName = 'Khách hàng') {
    try {
        if (!transporter) {
            await initializeEmailService();
        }

        const mailOptions = {
            from: process.env.SMTP_FROM || etherealTestAccount?.user || 'noreply@cafehdtq.com',
            to: recipientEmail,
            subject: '🔐 Mã Xác Thực Đặt Lại Mật Khẩu - HDTQ Coffee',
            html: generateOTPEmailHTML(otp, recipientName),
            text: `Mã OTP của bạn là: ${otp}`
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`
╔════════════════════════════════════════════════════╗
║            ✓ EMAIL SENT SUCCESSFULLY               ║
╠════════════════════════════════════════════════════╣
║  To:       ${recipientEmail.padEnd(40)}║
║  Subject:  Mã Xác Thực Đặt Lại Mật Khẩu          ║
║  OTP:      ${otp.padEnd(40)}║
║  Time:     ${new Date().toLocaleString('vi-VN').padEnd(40)}║
║                                                    ║
${etherealTestAccount ? `║  Preview:  ${nodemailer.getTestMessageUrl(info).substring(0, 42).padEnd(42)}║` : ''}
║                                                    ║
╚════════════════════════════════════════════════════╝
        `);

        return {
            success: true,
            messageId: info.messageId,
            previewUrl: etherealTestAccount ? nodemailer.getTestMessageUrl(info) : null
        };
    } catch (error) {
        console.error('❌ Error sending OTP email:', error.message);
        throw error;
    }
}

/**
 * Tạo HTML template cho email OTP
 */
function generateOTPEmailHTML(otp, userName) {
    return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: white;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 16px;
                color: #333;
                margin-bottom: 20px;
            }
            .otp-section {
                background-color: #f9f9f9;
                border-left: 4px solid #8B4513;
                padding: 20px;
                margin: 30px 0;
                border-radius: 5px;
            }
            .otp-title {
                font-size: 12px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 10px;
            }
            .otp-code {
                font-size: 42px;
                font-weight: bold;
                color: #8B4513;
                letter-spacing: 8px;
                text-align: center;
                font-family: 'Monaco', 'Courier New', monospace;
            }
            .expiry {
                font-size: 14px;
                color: #e74c3c;
                text-align: center;
                margin-top: 15px;
                font-weight: 500;
            }
            .warning {
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px 20px;
                margin: 20px 0;
                border-radius: 3px;
                font-size: 14px;
                color: #856404;
            }
            .footer {
                background-color: #f5f5f5;
                padding: 20px 30px;
                text-align: center;
                font-size: 12px;
                color: #888;
                border-top: 1px solid #e0e0e0;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #8B4513;
                margin-bottom: 5px;
            }
            .social-links {
                margin-top: 15px;
                text-align: center;
            }
            .social-links a {
                color: #8B4513;
                text-decoration: none;
                margin: 0 10px;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">☕ HDTQ Coffee</div>
                <h1>Xác Thực Đặt Lại Mật Khẩu</h1>
            </div>

            <!-- Content -->
            <div class="content">
                <div class="greeting">
                    Xin chào <strong>${userName}</strong>,
                </div>

                <p style="font-size: 15px; color: #555; line-height: 1.6; margin: 15px 0;">
                    Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Sử dụng mã xác thực bên dưới để tiếp tục quá trình đặt lại mật khẩu.
                </p>

                <!-- OTP Section -->
                <div class="otp-section">
                    <div class="otp-title">Mã Xác Thực</div>
                    <div class="otp-code">${otp.split('').join(' ')}</div>
                    <div class="expiry">⏱️ Mã này sẽ hết hạn trong 5 phút</div>
                </div>

                <p style="font-size: 14px; color: #666; margin: 20px 0;">
                    <strong>Các bước tiếp theo:</strong><br>
                    1. Quay lại trang đặt lại mật khẩu<br>
                    2. Nhập mã xác thực trên<br>
                    3. Tạo mật khẩu mới của bạn<br>
                    4. Xác nhận và lưu mật khẩu
                </p>

                <!-- Warning -->
                <div class="warning">
                    ⚠️ <strong>Bảo mật:</strong> Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này. Tài khoản của bạn vẫn được bảo vệ an toàn.
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div style="margin-bottom: 15px;">
                    © 2026 HDTQ Coffee. All rights reserved.
                </div>
                <div class="social-links">
                    <a href="#">Website</a>
                    <a href="#">Facebook</a>
                    <a href="#">Contact</a>
                </div>
                <div style="margin-top: 15px; color: #999;">
                    Đây là email tự động. Vui lòng không trả lời email này.
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Gửi email xác thực (có thể dùng cho các mục đích khácvề này)
 */
async function sendVerificationEmail(recipientEmail, verificationLink, userName = 'Khách hàng') {
    try {
        if (!transporter) {
            await initializeEmailService();
        }

        const mailOptions = {
            from: process.env.SMTP_FROM || etherealTestAccount?.user || 'noreply@cafehdtq.com',
            to: recipientEmail,
            subject: '✉️ Xác Thực Email - HDTQ Coffee',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2>Xin chào ${userName},</h2>
                    <p>Vui lòng click nút bên dưới để xác thực email của bạn:</p>
                    <a href="${verificationLink}" style="
                        display: inline-block;
                        background-color: #8B4513;
                        color: white;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    ">Xác Thực Email</a>
                    <p>Link này sẽ hết hạn trong 24 giờ.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId,
            previewUrl: etherealTestAccount ? nodemailer.getTestMessageUrl(info) : null
        };
    } catch (error) {
        console.error('❌ Error sending verification email:', error.message);
        throw error;
    }
}

module.exports = {
    initializeEmailService,
    sendOTPEmail,
    sendVerificationEmail
};
