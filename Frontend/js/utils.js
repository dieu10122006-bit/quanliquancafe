/* ========================================
   UTILITIES - Helper functions
   ======================================== */

const Utils = {
    /**
     * Format currency (VND)
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(amount);
    },

    /**
     * Format date
     */
    formatDate(date, format = 'dd/MM/yyyy') {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('dd', day)
            .replace('MM', month)
            .replace('yyyy', year)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    },

    /**
     * Show notification/alert
     */
    showAlert(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            ${message}
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;
        document.body.insertBefore(alertDiv, document.body.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    },

    /**
     * Show loading spinner
     */
    showLoader(element = null) {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = '<div class="spinner"></div>';
        
        if (element) {
            element.innerHTML = '';
            element.appendChild(loader);
        } else {
            document.getElementById('app').innerHTML = '';
            document.getElementById('app').appendChild(loader);
        }
    },

    /**
     * Hide loader
     */
    hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.remove();
        }
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    /**
     * Get current user
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Logout user
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/pages/login.html';
    },

    /**
     * Redirect if not logged in
     */
    redirectIfNotLoggedIn() {
        if (!this.isLoggedIn()) {
            window.location.href = '/pages/login.html';
        }
    },

    /**
     * Check user role
     */
    hasRole(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },

    /**
     * Validate email
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate phone (Vietnam)
     */
    validatePhone(phone) {
        const re = /^(0|\+84)[0-9]{9,10}$/;
        return re.test(phone);
    },

    /**
     * Deep clone object
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Merge objects
     */
    merge(...objects) {
        return Object.assign({}, ...objects);
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    /**
     * Throttle function
     */
    throttle(func, wait) {
        let timeout;
        return function(...args) {
            if (!timeout) {
                func.apply(this, args);
                timeout = setTimeout(() => timeout = null, wait);
            }
        };
    },

    /**
     * Get URL parameter
     */
    getParam(name) {
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    },

    /**
     * Calculate percentage
     */
    calculatePercentage(value, percentage) {
        return (value * percentage) / 100;
    },

    /**
     * Calculate discount
     */
    calculateDiscount(totalAmount, discountPercent) {
        return {
            discountAmount: this.calculatePercentage(totalAmount, discountPercent),
            finalAmount: totalAmount - this.calculatePercentage(totalAmount, discountPercent)
        };
    },

    /**
     * Format status badge
     */
    getStatusBadge(status) {
        const statusMap = {
            'pending': { text: 'Chờ xử lý', class: 'warning' },
            'confirmed': { text: 'Đã xác nhận', class: 'info' },
            'delivered': { text: 'Đã giao', class: 'success' },
            'paid': { text: 'Đã thanh toán', class: 'success' },
            'cancelled': { text: 'Đã hủy', class: 'danger' },
            'active': { text: 'Hoạt động', class: 'success' },
            'inactive': { text: 'Không hoạt động', class: 'danger' },
            'working': { text: 'Đang làm việc', class: 'success' },
            'on_leave': { text: 'Đang phép', class: 'warning' },
            'resigned': { text: 'Đã nghỉ', class: 'danger' }
        };

        const info = statusMap[status] || { text: status, class: 'info' };
        return `<span class="badge badge-${info.class}">${info.text}</span>`;
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Parse JSON safely
     */
    parseJSON(json) {
        try {
            return JSON.parse(json);
        } catch (e) {
            console.error('JSON Parse Error:', e);
            return null;
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
