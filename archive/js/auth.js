// Authentication and User Management

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('AuthManager initializing...');
        // Check if user is already logged in
        this.currentUser = API.getCurrentUser();
        this.updateUI();
        console.log('AuthManager initialized, current user:', this.currentUser ? this.currentUser.email : 'none');
    }

    async login(email, password) {
        try {
            console.log('AuthManager login attempt for:', email);
            const result = await API.login(email, password);
            console.log('Login result:', result);
            
            if (result.success) {
                this.currentUser = result.user;
                this.updateUI();
                this.showNotification('Login successful!', 'success');
                return true;
            } else {
                this.showNotification(result.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('AuthManager login error:', error);
            this.showNotification('Login failed. Please try again.', 'error');
            return false;
        }
    }

    async register(userData) {
        try {
            const result = await API.register(userData);
            if (result.success) {
                this.currentUser = result.user;
                this.updateUI();
                this.showNotification('Registration successful!', 'success');
                return true;
            } else {
                this.showNotification(result.message, 'error');
                return false;
            }
        } catch (error) {
            this.showNotification('Registration failed. Please try again.', 'error');
            return false;
        }
    }

    async logout() {
        try {
            await API.logout();
            this.currentUser = null;
            this.updateUI();
            this.showNotification('Logged out successfully', 'success');
            // Redirect to home page
            window.location.href = 'index.html';
        } catch (error) {
            this.showNotification('Logout failed', 'error');
        }
    }

    updateUI() {
        const userDropdown = document.getElementById('userDropdown');
        const loginNav = document.getElementById('loginNav');
        const userName = document.getElementById('userName');
        const cspManagementLink = document.getElementById('cspManagementLink');
        const adminPanelLink = document.getElementById('adminPanelLink');

        if (this.currentUser) {
            // User is logged in
            if (userDropdown) userDropdown.style.display = 'block';
            if (loginNav) loginNav.style.display = 'none';
            if (userName) userName.textContent = this.currentUser.name;

            // Show role-specific links
            if (cspManagementLink && (this.currentUser.role === 'csp_leader' || this.currentUser.role === 'admin')) {
                cspManagementLink.style.display = 'block';
            }
            if (adminPanelLink && this.currentUser.role === 'admin') {
                adminPanelLink.style.display = 'block';
            }
        } else {
            // User is not logged in
            if (userDropdown) userDropdown.style.display = 'none';
            if (loginNav) loginNav.style.display = 'block';
            if (cspManagementLink) cspManagementLink.style.display = 'none';
            if (adminPanelLink) adminPanelLink.style.display = 'none';
        }
    }

    isAuthenticated() {
        return API.isAuthenticated() && this.currentUser !== null;
    }

    requireAuth() {
        if (!this.isAuthenticated()) {
            this.showNotification('Please log in to access this page', 'warning');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    requireRole(requiredRole) {
        if (!this.requireAuth()) {
            return false;
        }

        if (this.currentUser.role !== requiredRole && this.currentUser.role !== 'admin') {
            this.showNotification('You do not have permission to access this page', 'error');
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} notification`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s ease-out;
        `;

        // Add icon based on type
        let icon = '';
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle me-2"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle me-2"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle me-2"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle me-2"></i>';
        }

        notification.innerHTML = `
            ${icon}${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Form validation helpers
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    validatePhone(phone) {
        // Singapore phone number format
        const phoneRegex = /^(\+65|65)?[689]\d{7}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Password strength indicator
    getPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        return {
            score: strength,
            label: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength],
            color: ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#198754'][strength]
        };
    }
}

// Global auth manager instance
console.log('Creating AuthManager instance...');
const authManager = new AuthManager();

// Global functions for use in HTML
function logout() {
    authManager.logout();
}

function showNotification(message, type = 'info') {
    authManager.showNotification(message, type);
}

// Export for use in other files
window.authManager = authManager;
