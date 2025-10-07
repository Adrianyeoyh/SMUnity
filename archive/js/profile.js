// Profile page functionality

let userApplications = [];
let userActivity = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
});

function initializeProfile() {
    // Check authentication
    if (!authManager.requireAuth()) {
        return;
    }

    // Initialize forms
    initializePreferencesForm();

    // Load profile data
    loadProfileData();
    loadUserApplications();
    loadUserActivity();
}

function initializePreferencesForm() {
    const preferencesForm = document.getElementById('preferencesForm');
    preferencesForm.addEventListener('submit', handlePreferencesSave);
}

async function loadProfileData() {
    const user = authManager.currentUser;
    if (!user) return;

    // Update profile header
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileRole').textContent = getRoleDisplayName(user.role);
    document.getElementById('profileEmail').textContent = user.email;

    // Update personal info
    document.getElementById('displayName').textContent = user.name;
    document.getElementById('displayEmail').textContent = user.email;
    document.getElementById('displayPhone').textContent = user.phone || 'Not provided';
    document.getElementById('displayRole').textContent = getRoleDisplayName(user.role);
    document.getElementById('displayCreatedAt').textContent = formatDate(user.createdAt);

    // Show role-specific fields
    if (user.role === 'student') {
        document.getElementById('studentFields').style.display = 'block';
        document.getElementById('displayStudentId').textContent = user.studentId || 'Not provided';
        document.getElementById('displayYear').textContent = user.year || 'Not provided';
        document.getElementById('displayMajor').textContent = user.major || 'Not provided';
        
        // Display skills
        const skillsContainer = document.getElementById('displaySkills');
        if (user.skills && user.skills.length > 0) {
            skillsContainer.innerHTML = user.skills.map(skill => 
                `<span class="badge bg-primary me-1">${escapeHtml(skill)}</span>`
            ).join('');
        } else {
            skillsContainer.textContent = 'No skills specified';
        }
    } else if (user.role === 'csp_leader') {
        document.getElementById('leaderFields').style.display = 'block';
        document.getElementById('displayOrganization').textContent = user.organization || 'Not provided';
    }
}

function getRoleDisplayName(role) {
    switch (role) {
        case 'admin': return 'Administrator';
        case 'csp_leader': return 'CSP Leader';
        case 'student': return 'Student';
        default: return 'User';
    }
}

async function loadUserApplications() {
    try {
        const user = authManager.currentUser;
        const result = await API.getApplications(user.id);
        
        if (result.success) {
            userApplications = result.data;
            
            // Update quick stats
            const totalApplications = userApplications.length;
            const totalHours = userApplications.reduce((sum, app) => sum + app.hoursLogged, 0);
            
            document.getElementById('totalApplications').textContent = totalApplications;
            document.getElementById('totalHours').textContent = totalHours;
        }
    } catch (error) {
        console.error('Error loading user applications:', error);
    }
}

async function loadUserActivity() {
    try {
        // Generate mock activity based on user applications
        const user = authManager.currentUser;
        const result = await API.getApplications(user.id);
        
        if (result.success) {
            userActivity = [];
            
            // Add application activities
            result.data.forEach(application => {
                userActivity.push({
                    type: 'application',
                    title: 'Applied for CSP',
                    description: `Applied for ${application.cspId}`,
                    date: application.appliedAt,
                    icon: 'fas fa-paper-plane'
                });
                
                // Add timesheet activities
                if (application.timesheet && application.timesheet.length > 0) {
                    application.timesheet.forEach(entry => {
                        userActivity.push({
                            type: 'timesheet',
                            title: 'Logged Hours',
                            description: `Logged ${entry.hours} hours`,
                            date: entry.date,
                            icon: 'fas fa-clock'
                        });
                    });
                }
            });
            
            // Sort by date (newest first)
            userActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Display activity
            displayUserActivity();
        }
    } catch (error) {
        console.error('Error loading user activity:', error);
    }
}

function displayUserActivity() {
    const activityList = document.getElementById('activityList');
    
    if (userActivity.length === 0) {
        activityList.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-history fa-2x text-muted mb-3"></i>
                <p class="text-muted">No recent activity</p>
            </div>
        `;
        return;
    }
    
    // Show only last 10 activities
    const recentActivity = userActivity.slice(0, 10);
    
    activityList.innerHTML = recentActivity.map(activity => `
        <div class="d-flex align-items-center mb-3">
            <div class="flex-shrink-0">
                <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="${activity.icon}"></i>
                </div>
            </div>
            <div class="flex-grow-1 ms-3">
                <h6 class="mb-1">${activity.title}</h6>
                <p class="text-muted mb-0">${activity.description}</p>
                <small class="text-muted">${formatDateTime(activity.date)}</small>
            </div>
        </div>
    `).join('');
}

async function handlePreferencesSave(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const preferences = {
        emailNotifications: formData.has('emailNotifications'),
        preferredCategories: [],
        timeAvailability: []
    };
    
    // Get preferred categories
    const categoryCheckboxes = ['prefEducation', 'prefEnvironment', 'prefHealthcare', 'prefCommunity', 'prefArts', 'prefSports'];
    categoryCheckboxes.forEach(checkboxId => {
        if (formData.has(checkboxId)) {
            preferences.preferredCategories.push(document.getElementById(checkboxId).value);
        }
    });
    
    // Get time availability
    const timeCheckboxes = ['timeWeekend', 'timeWeekday', 'timeFlexible'];
    timeCheckboxes.forEach(checkboxId => {
        if (formData.has(checkboxId)) {
            preferences.timeAvailability.push(document.getElementById(checkboxId).value);
        }
    });
    
    try {
        // TODO: Implement preferences save
        authManager.showNotification('Preferences saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving preferences:', error);
        authManager.showNotification('Failed to save preferences', 'error');
    }
}

function editProfile() {
    // TODO: Implement edit profile modal
    authManager.showNotification('Edit profile functionality coming soon!', 'info');
}

function changePassword() {
    // TODO: Implement change password modal
    authManager.showNotification('Change password functionality coming soon!', 'info');
}

// Export functions for use in HTML
window.editProfile = editProfile;
window.changePassword = changePassword;
