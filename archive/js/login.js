// Login page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeLoginPage();
});

function initializeLoginPage() {
    console.log('Initializing login page...');
    
    const loginForm = document.getElementById('loginForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    // Handle form submission
    loginForm.addEventListener('submit', handleLogin);

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);

    // Check if user is already logged in
    if (authManager.isAuthenticated()) {
        authManager.showNotification('You are already logged in', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    console.log('Login page initialization complete');
}

async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = document.getElementById('rememberMe').checked;

    console.log('Login attempt:', { email, password: '***' });

    // Validate inputs
    if (!validateForm()) {
        return;
    }

    // Show loading state
    const loginBtn = document.getElementById('loginBtn');
    const spinner = loginBtn.querySelector('.spinner-border');
    const icon = loginBtn.querySelector('.fas');
    
    loginBtn.disabled = true;
    spinner.style.display = 'inline-block';
    icon.style.display = 'none';

    try {
        const success = await authManager.login(email, password);
        
        if (success) {
            // Store remember me preference
            if (rememberMe) {
                localStorage.setItem('smunity_remember_me', 'true');
            } else {
                localStorage.removeItem('smunity_remember_me');
            }

            // Redirect based on user role
            const user = authManager.currentUser;
            let redirectUrl = 'index.html';
            
            if (user.role === 'admin') {
                redirectUrl = 'admin-panel.html';
            } else if (user.role === 'csp_leader') {
                redirectUrl = 'csp-management.html';
            } else {
                redirectUrl = 'csp-discovery.html';
            }

            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        }
    } catch (error) {
        console.error('Login error:', error);
        authManager.showNotification('Login failed. Please try again.', 'error');
    } finally {
        // Reset button state
        loginBtn.disabled = false;
        spinner.style.display = 'none';
        icon.style.display = 'inline-block';
    }
}

function validateForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    let isValid = true;

    // Validate email
    if (!validateEmail()) {
        isValid = false;
    }

    // Validate password
    if (!validatePassword()) {
        isValid = false;
    }

    return isValid;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value.trim();

    if (!email) {
        emailInput.classList.add('is-invalid');
        emailError.textContent = 'Email is required';
        return false;
    }

    if (!authManager.validateEmail(email)) {
        emailInput.classList.add('is-invalid');
        emailError.textContent = 'Please enter a valid email address';
        return false;
    }

    emailInput.classList.remove('is-invalid');
    emailInput.classList.add('is-valid');
    emailError.textContent = '';
    return true;
}

function validatePassword() {
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('passwordError');
    const password = passwordInput.value;

    if (!password) {
        passwordInput.classList.add('is-invalid');
        passwordError.textContent = 'Password is required';
        return false;
    }

    if (password.length < 6) {
        passwordInput.classList.add('is-invalid');
        passwordError.textContent = 'Password must be at least 6 characters long';
        return false;
    }

    passwordInput.classList.remove('is-invalid');
    passwordInput.classList.add('is-valid');
    passwordError.textContent = '';
    return true;
}

function fillDemoAccount(role) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    const demoAccounts = {
        student: 'student@smu.edu.sg',
        leader: 'leader@csp.org',
        admin: 'admin@smunity.com'
    };

    emailInput.value = demoAccounts[role];
    passwordInput.value = 'password123';
    
    // Trigger validation
    validateEmail();
    validatePassword();
    
    // Focus on login button
    document.getElementById('loginBtn').focus();
    
    authManager.showNotification(`Demo ${role} account filled`, 'info');
}

// Export for use in HTML
window.fillDemoAccount = fillDemoAccount;
