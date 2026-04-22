/**
 * Forgot Password - 2-Layer Security System
 * Layer 1: Email Verification
 * Layer 2: OTP Verification + Password Reset
 */

class ForgotPasswordManager {
    constructor() {
        this.currentStep = 1;
        this.email = '';
        this.otp = '';
        this.resetToken = '';
        this.otpTimer = null;
        this.otpTimeRemaining = 300; // 5 minutes
        this.canResendOTP = false;
        this.resendCountdown = 0;
        this.resendTimer = null;

        this.initEventListeners();
    }

    initEventListeners() {
        // Step 1: Send OTP
        document.getElementById('btn-send-otp').addEventListener('click', () => this.sendOTP());

        // Step 2: OTP verification
        const otpInputs = document.querySelectorAll('.otp-input');
        otpInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => this.handleOTPInput(e, index));
            input.addEventListener('keydown', (e) => this.handleOTPKeydown(e, index));
            input.addEventListener('paste', (e) => this.handleOTPPaste(e));
        });

        document.getElementById('btn-verify-otp').addEventListener('click', () => this.verifyOTP());
        document.getElementById('btn-resend-otp').addEventListener('click', () => this.resendOTP());

        // Step 3: Password reset
        document.getElementById('new-password').addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        document.getElementById('btn-reset-password').addEventListener('click', () => this.resetPassword());

        // Email input validation
        document.getElementById('email').addEventListener('input', (e) => {
            this.email = e.target.value;
            this.validateEmail();
        });
    }

    // ========== ALERTS ==========
    showAlert(type, title, message) {
        const alertId = `alert-${type}`;
        const alert = document.getElementById(alertId);
        
        if (alert) {
            if (title) document.getElementById(`${alertId}-title`).textContent = title;
            if (message) document.getElementById(`${alertId}-message`).textContent = message;
            
            alert.classList.add('show');
            
            if (type !== 'info') {
                setTimeout(() => alert.classList.remove('show'), 5000);
            }
        }
    }

    hideAlert(type) {
        const alert = document.getElementById(`alert-${type}`);
        if (alert) {
            alert.classList.remove('show');
        }
    }

    // ========== STEP 1: EMAIL VERIFICATION ==========
    validateEmail() {
        const emailInput = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailPattern.test(this.email);

        const btn = document.getElementById('btn-send-otp');
        btn.disabled = !isValid;

        return isValid;
    }

    async sendOTP() {
        if (!this.validateEmail()) {
            this.showAlert('error', 'Lỗi', 'Vui lòng nhập email hợp lệ');
            return;
        }

        const btn = document.getElementById('btn-send-otp');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Đang gửi...';

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email
                })
            });

            const data = await response.json();

            if (data.success) {
                this.resetToken = data.resetToken;
                this.showAlert('success', 'Thành công', 'Mã OTP đã được gửi đến email của bạn');
                
                // Show email masked
                document.getElementById('email-display').textContent = this.maskEmail(this.email);
                
                // Move to Step 2
                setTimeout(() => {
                    this.goToStep(2);
                    this.startOTPTimer();
                }, 1500);
            } else {
                this.showAlert('error', 'Lỗi', data.message || 'Email không tồn tại trong hệ thống');
                btn.disabled = false;
                btn.textContent = originalText;
            }
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('error', 'Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại');
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }

    maskEmail(email) {
        const [name, domain] = email.split('@');
        const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
        return `${maskedName}@${domain}`;
    }

    // ========== STEP 2: OTP VERIFICATION ==========
    handleOTPInput(e, index) {
        const input = e.target;
        const otpInputs = document.querySelectorAll('.otp-input');

        // Only allow numbers
        input.value = input.value.replace(/[^0-9]/g, '');

        // Mark as filled
        if (input.value) {
            input.classList.add('filled');
        } else {
            input.classList.remove('filled');
        }

        // Auto focus to next input
        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

        // Check if all fields are filled
        this.updateOTPButton();
    }

    handleOTPKeydown(e, index) {
        const otpInputs = document.querySelectorAll('.otp-input');

        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    }

    handleOTPPaste(e) {
        e.preventDefault();
        const pastedOTP = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        
        if (pastedOTP.length === 6) {
            const otpInputs = document.querySelectorAll('.otp-input');
            pastedOTP.split('').forEach((digit, index) => {
                otpInputs[index].value = digit;
                otpInputs[index].classList.add('filled');
            });
            this.updateOTPButton();
        }
    }

    updateOTPButton() {
        const otpInputs = document.querySelectorAll('.otp-input');
        const otp = Array.from(otpInputs).map(input => input.value).join('');
        const btn = document.getElementById('btn-verify-otp');

        if (otp.length === 6) {
            btn.disabled = false;
            this.otp = otp;
        } else {
            btn.disabled = true;
        }
    }

    startOTPTimer() {
        this.otpTimeRemaining = 300; // 5 minutes
        document.getElementById('btn-resend-otp').disabled = true;
        
        this.otpTimer = setInterval(() => {
            this.otpTimeRemaining--;

            // Update display
            const minutes = Math.floor(this.otpTimeRemaining / 60);
            const seconds = this.otpTimeRemaining % 60;
            document.getElementById('timer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (this.otpTimeRemaining <= 0) {
                clearInterval(this.otpTimer);
                document.getElementById('btn-resend-otp').disabled = false;
                this.showAlert('info', 'Thông báo', 'Mã OTP đã hết hạn. Vui lòng gửi lại');
            }
        }, 1000);
    }

    async verifyOTP() {
        const btn = document.getElementById('btn-verify-otp');
        btn.disabled = true;
        btn.textContent = 'Đang xác thực...';

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email,
                    otp: this.otp,
                    resetToken: this.resetToken
                })
            });

            const data = await response.json();

            if (data.success) {
                this.resetToken = data.verificationToken;
                clearInterval(this.otpTimer);
                
                this.showAlert('success', 'Thành công', 'OTP xác thực thành công');
                
                setTimeout(() => {
                    this.goToStep(3);
                    btn.disabled = false;
                    btn.textContent = 'Xác Thực';
                }, 1500);
            } else {
                this.showAlert('error', 'Lỗi', data.message || 'Mã OTP không chính xác');
                btn.disabled = false;
                btn.textContent = 'Xác Thực';
            }
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('error', 'Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại');
            btn.disabled = false;
            btn.textContent = 'Xác Thực';
        }
    }

    async resendOTP() {
        const btn = document.getElementById('btn-resend-otp');
        btn.disabled = true;

        try {
            const response = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email
                })
            });

            const data = await response.json();

            if (data.success) {
                this.resetToken = data.resetToken;
                this.showAlert('success', 'Thành công', 'Mã OTP mới đã được gửi');
                
                // Clear OTP inputs
                document.querySelectorAll('.otp-input').forEach(input => {
                    input.value = '';
                    input.classList.remove('filled');
                });

                // Restart timer
                this.startOTPTimer();
            } else {
                this.showAlert('error', 'Lỗi', data.message || 'Không thể gửi lại mã OTP');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('error', 'Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại');
        }
    }

    // ========== STEP 3: PASSWORD RESET ==========p
    checkPasswordStrength(password) {
        let strength = 0;
        const strengthBars = document.querySelectorAll('.strength-bar');
        const strengthText = document.getElementById('strength-text');

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        // Update progress bars
        strengthBars.forEach((bar, index) => {
            bar.classList.remove('weak', 'medium', 'strong');
            if (index < strength) {
                if (strength === 1) bar.classList.add('weak');
                else if (strength === 2) bar.classList.add('medium');
                else bar.classList.add('strong');
            }
        });

        // Update text
        if (password.length === 0) {
            strengthText.textContent = 'Nhập mật khẩu ít nhất 8 ký tự';
            strengthText.className = 'strength-text';
        } else if (strength === 1) {
            strengthText.textContent = 'Mật khẩu yếu';
            strengthText.className = 'strength-text weak';
        } else if (strength === 2) {
            strengthText.textContent = 'Mật khẩu trung bình';
            strengthText.className = 'strength-text medium';
        } else if (strength >= 3) {
            strengthText.textContent = 'Mật khẩu mạnh';
            strengthText.className = 'strength-text strong';
        }
    }

    validateNewPassword() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const passwordError = document.getElementById('password-error');

        if (newPassword.length < 8) {
            this.showAlert('error', 'Lỗi', 'Mật khẩu phải có ít nhất 8 ký tự');
            return false;
        }

        if (newPassword !== confirmPassword) {
            passwordError.style.display = 'block';
            return false;
        } else {
            passwordError.style.display = 'none';
        }

        return true;
    }

    async resetPassword() {
        if (!this.validateNewPassword()) {
            return;
        }

        const btn = document.getElementById('btn-reset-password');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Đang cập nhật...';

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.email,
                    newPassword: document.getElementById('new-password').value,
                    resetToken: this.resetToken
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showAlert('success', 'Thành công', 'Mật khẩu đã được cập nhật thành công');
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showAlert('error', 'Lỗi', data.message || 'Không thể cập nhật mật khẩu');
                btn.disabled = false;
                btn.textContent = originalText;
            }
        } catch (error) {
            console.error('Error:', error);
            this.showAlert('error', 'Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại');
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }

    // ========== UTILITY FUNCTIONS ==========
    goToStep(step) {
        // Hide all forms
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });

        // Hide all alerts
        ['success', 'error', 'info'].forEach(type => {
            this.hideAlert(type);
        });

        // Update step indicators
        document.querySelectorAll('.step-number').forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            if (index + 1 < step) {
                indicator.classList.add('completed');
                indicator.textContent = '✓';
            } else if (index + 1 === step) {
                indicator.classList.add('active');
                indicator.textContent = step;
            }
        });

        // Show current form
        document.getElementById(`step-${step}-form`).classList.add('active');
        this.currentStep = step;
    }
}

// Helper function - Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    input.type = input.type === 'password' ? 'text' : 'password';
}

// Helper function - Go back to step 1
function backToStep1() {
    forgotPasswordManager.goToStep(1);
    clearInterval(forgotPasswordManager.otpTimer);
    document.querySelectorAll('.otp-input').forEach(input => input.value = '');
}

// Initialize on page load
let forgotPasswordManager;
document.addEventListener('DOMContentLoaded', () => {
    forgotPasswordManager = new ForgotPasswordManager();
});