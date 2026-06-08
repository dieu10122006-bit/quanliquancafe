/* ========================================
   AUTHENTICATION - Login & Auth logic
   ======================================== */

const Auth = {
    /**
     * Handle login form submission
     */
    async login(username, password) {
        try {
            const response = await API.auth.login(username, password);
            
            // Save token and user info
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            
            Utils.showAlert('Đăng nhập thành công!', 'success');
            
            // Redirect based on role
            if (response.user.role === 'admin') {
                window.location.href = '/pages/dashboard.html';
            } else if (response.user.role === 'staff') {
                window.location.href = '/pages/order.html';
            } else {
                window.location.href = '/pages/menu.html';
            }
        } catch (error) {
            Utils.showAlert('Đăng nhập thất bại: ' + error.message, 'error');
        }
    },

    /**
     * Handle logout
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Utils.showAlert('Đã đăng xuất', 'success');
        window.location.href = '/pages/login.html';
    },

    /**
     * Get authentication token
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Check if authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Get current user
     */
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    /**
     * Setup navbar with user info
     */
    setupNavbar() {
        const user = this.getUser();
        if (user) {
            const userNameEl = document.getElementById('user-name');
            const userAvatarEl = document.getElementById('user-avatar');
            
            if (userNameEl) {
                userNameEl.textContent = user.full_name || user.username;
            }
            
            if (userAvatarEl) {
                const initials = (user.full_name || user.username)
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2);
                userAvatarEl.textContent = initials;
            }
        }
    },

    /**
     * Setup logout button
     */
    setupLogoutButton() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    },

    /**
     * Check authorization (role-based)
     */
    isAuthorized(requiredRole) {
        const user = this.getUser();
        if (!user) return false;
        
        if (Array.isArray(requiredRole)) {
            return requiredRole.includes(user.role);
        }
        
        return user.role === requiredRole;
    },

    /**
     * Show/hide elements based on role
     */
    showForRole(selector, roles) {
        const elements = document.querySelectorAll(selector);
        const user = this.getUser();
        
        if (!user) {
            elements.forEach(el => el.style.display = 'none');
            return;
        }
        
        if (Array.isArray(roles) && roles.includes(user.role)) {
            elements.forEach(el => el.style.display = '');
        } else if (!Array.isArray(roles) && user.role === roles) {
            elements.forEach(el => el.style.display = '');
        } else {
            elements.forEach(el => el.style.display = 'none');
        }
    },

    /**
     * Initialize authentication on page load
     */
    init() {
        // Redirect to login if not authenticated
        Utils.redirectIfNotLoggedIn();
        
        // Setup navbar
        this.setupNavbar();
        
        // Setup logout button
        this.setupLogoutButton();
        
        // Check authorization for protected pages
        const requiredRole = document.body.getAttribute('data-required-role');
        if (requiredRole && !this.isAuthorized(requiredRole)) {
            Utils.showAlert('Bạn không có quyền truy cập trang này', 'error');
            window.location.href = '/pages/dashboard.html';
        }
    }
};

// Call init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Don't init on login page
    if (!window.location.pathname.includes('login')) {
        Auth.init();
    }
});
