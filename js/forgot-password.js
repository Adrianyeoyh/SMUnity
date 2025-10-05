// Forgot password page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeForgotPasswordPage();
});

function initializeForgotPasswordPage() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const emailInput = document.getElementById('email');

    // Handle form submission
    forgotPasswordForm.addEventListener('submit', handleForgotPassword);

    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);

    // Check if user is already logged in
    if (authManager.isAuthenticated()) {
        authManager.showNotification('You are already logged in', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

async function handleForgotPassword(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');

    // Validate email
    if (!validateEmail()) {
        return;
    }

    // Show loading state
    const resetBtn = document.getElementById('resetBtn');
    const spinner = resetBtn.querySelector('.spinner-border');
    const icon = resetBtn.querySelector('.fas');
    
    resetBtn.disabled = true;
    spinner.style.display = 'inline-block';
    icon.style.display = 'none';

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if email exists in our mock data
        const users = JSON.parse(localStorage.getItem('smunity_users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (user) {
            // Show success message
            showSuccessMessage();
        } else {
            // Still show success message for security (don't reveal if email exists)
            showSuccessMessage();
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        authManager.showNotification('Failed to send reset link. Please try again.', 'error');
    } finally {
        // Reset button state
        resetBtn.disabled = false;
        spinner.style.display = 'none';
        icon.style.display = 'inline-block';
    }
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

function showSuccessMessage() {
    const form = document.getElementById('forgotPasswordForm');
    const successMessage = document.getElementById('successMessage');
    
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Auto redirect to login after 5 seconds
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 5000);
}
