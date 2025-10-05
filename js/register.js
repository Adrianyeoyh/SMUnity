// Registration page functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeRegisterPage();
});

function initializeRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const roleInputs = document.querySelectorAll('input[name="role"]');

    // Handle form submission
    registerForm.addEventListener('submit', handleRegistration);

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Handle role change
    roleInputs.forEach(input => {
        input.addEventListener('change', handleRoleChange);
    });

    // Real-time validation
    setupValidation();

    // Initialize skills
    initializeSkills();

    // Check if user is already logged in
    if (authManager.isAuthenticated()) {
        authManager.showNotification('You are already logged in', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

function handleRoleChange() {
    const selectedRole = document.querySelector('input[name="role"]:checked').value;
    const studentFields = document.getElementById('studentFields');
    const leaderFields = document.getElementById('leaderFields');

    if (selectedRole === 'student') {
        studentFields.style.display = 'block';
        leaderFields.style.display = 'none';
    } else {
        studentFields.style.display = 'none';
        leaderFields.style.display = 'block';
    }
}

function initializeSkills() {
    const skillsContainer = document.getElementById('skillsContainer');
    const availableSkills = [
        'Teaching', 'Event Planning', 'Public Speaking', 'Communication',
        'Teamwork', 'Leadership', 'Problem Solving', 'Creativity',
        'Technical Skills', 'Writing', 'Research', 'Mentoring',
        'Caregiving', 'Environmental', 'Healthcare', 'Arts & Culture',
        'Sports', 'Music', 'Photography', 'Social Media'
    ];

    skillsContainer.innerHTML = availableSkills.map(skill => `
        <div class="col-md-4 col-sm-6">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="skills" value="${skill}" id="skill-${skill}">
                <label class="form-check-label" for="skill-${skill}">
                                    ${skill}
                                </label>
            </div>
        </div>
    `).join('');
}

function setupValidation() {
    const inputs = [
        'firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'
    ];

    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('blur', () => validateField(inputId));
        }
    });

    // Special validation for password
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }

    // Special validation for confirm password
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', () => validateConfirmPassword());
    }
}

async function handleRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const role = formData.get('role');
    
    // Validate form
    if (!validateForm()) {
        return;
    }

    // Show loading state
    const registerBtn = document.getElementById('registerBtn');
    const spinner = registerBtn.querySelector('.spinner-border');
    const icon = registerBtn.querySelector('.fas');
    
    registerBtn.disabled = true;
    spinner.style.display = 'inline-block';
    icon.style.display = 'none';

    try {
        // Prepare user data
        const userData = {
            name: `${formData.get('firstName')} ${formData.get('lastName')}`,
            email: formData.get('email'),
            password: formData.get('password'),
            phone: formData.get('phone'),
            role: role
        };

        // Add role-specific fields
        if (role === 'student') {
            userData.studentId = formData.get('studentId');
            userData.year = formData.get('year');
            userData.major = formData.get('major');
            userData.skills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
                .map(input => input.value);
        } else if (role === 'csp_leader') {
            userData.organization = formData.get('organization');
        }

        const success = await authManager.register(userData);
        
        if (success) {
            // Redirect based on role
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
        console.error('Registration error:', error);
        authManager.showNotification('Registration failed. Please try again.', 'error');
    } finally {
        // Reset button state
        registerBtn.disabled = false;
        spinner.style.display = 'none';
        icon.style.display = 'inline-block';
    }
}

function validateForm() {
    const role = document.querySelector('input[name="role"]:checked').value;
    let isValid = true;

    // Common fields
    const commonFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
    commonFields.forEach(fieldId => {
        if (!validateField(fieldId)) {
            isValid = false;
        }
    });

    // Role-specific fields
    if (role === 'student') {
        const studentFields = ['studentId', 'year', 'major'];
        studentFields.forEach(fieldId => {
            if (!validateField(fieldId)) {
                isValid = false;
            }
        });
    } else if (role === 'csp_leader') {
        if (!validateField('organization')) {
            isValid = false;
        }
    }

    // Terms agreement
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        agreeTerms.classList.add('is-invalid');
        document.getElementById('agreeTermsError').textContent = 'You must agree to the terms and conditions';
        isValid = false;
    } else {
        agreeTerms.classList.remove('is-invalid');
        document.getElementById('agreeTermsError').textContent = '';
    }

    return isValid;
}

function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (!input) return true;

    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (fieldId) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                errorMessage = 'This field is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Must be at least 2 characters';
                isValid = false;
            }
            break;

        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!authManager.validateEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'phone':
            if (!value) {
                errorMessage = 'Phone number is required';
                isValid = false;
            } else if (!authManager.validatePhone(value)) {
                errorMessage = 'Please enter a valid Singapore phone number';
                isValid = false;
            }
            break;

        case 'studentId':
            if (!value) {
                errorMessage = 'Student ID is required';
                isValid = false;
            } else if (!/^SMU\d{7}$/.test(value)) {
                errorMessage = 'Please enter a valid SMU student ID (e.g., SMU2024001)';
                isValid = false;
            }
            break;

        case 'year':
            if (!value) {
                errorMessage = 'Please select your academic year';
                isValid = false;
            }
            break;

        case 'major':
            if (!value) {
                errorMessage = 'Major is required';
                isValid = false;
            }
            break;

        case 'organization':
            if (!value) {
                errorMessage = 'Organization name is required';
                isValid = false;
            }
            break;

        case 'password':
            if (!value) {
                errorMessage = 'Password is required';
                isValid = false;
            } else if (value.length < 8) {
                errorMessage = 'Password must be at least 8 characters long';
                isValid = false;
            } else if (!authManager.validatePassword(value)) {
                errorMessage = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                isValid = false;
            }
            break;

        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (!value) {
                errorMessage = 'Please confirm your password';
                isValid = false;
            } else if (value !== password) {
                errorMessage = 'Passwords do not match';
                isValid = false;
            }
            break;
    }

    // Update UI
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        errorElement.textContent = '';
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        errorElement.textContent = errorMessage;
    }

    return isValid;
}

function validateConfirmPassword() {
    return validateField('confirmPassword');
}

function updatePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    
    const password = passwordInput.value;
    const strength = authManager.getPasswordStrength(password);
    
    strengthBar.style.width = `${(strength.score / 5) * 100}%`;
    strengthBar.className = `progress-bar bg-${strength.score <= 2 ? 'danger' : strength.score <= 3 ? 'warning' : 'success'}`;
    strengthText.textContent = `Password strength: ${strength.label}`;
    strengthText.className = `text-muted ${strength.score <= 2 ? 'text-danger' : strength.score <= 3 ? 'text-warning' : 'text-success'}`;
}
