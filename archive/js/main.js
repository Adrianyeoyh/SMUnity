// Main application logic

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

async function initializeApp() {
    try {
        // Load statistics
        await loadStatistics();
        
        // Load recent CSPs
        await loadRecentCSPs();
        
        // Initialize any page-specific functionality
        initializePageSpecificFeatures();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

async function loadStatistics() {
    try {
        const result = await API.getStats();
        if (result.success) {
            const stats = result.data;
            
            // Animate counters
            animateCounter('totalCSPs', stats.totalCSPs);
            animateCounter('totalStudents', stats.totalStudents);
            animateCounter('totalHours', stats.totalHours);
            animateCounter('totalOrganizations', stats.totalOrganizations);
        }
    } catch (error) {
        console.error('Failed to load statistics:', error);
    }
}

function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let currentValue = 0;
    const increment = targetValue / 50; // 50 steps
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue);
    }, 30);
}

async function loadRecentCSPs() {
    try {
        const result = await API.getCSPs({ status: 'active' });
        if (result.success) {
            const csps = result.data.slice(0, 3); // Show only first 3
            displayCSPCards(csps, 'recentCSPs');
        }
    } catch (error) {
        console.error('Failed to load recent CSPs:', error);
    }
}

function displayCSPCards(csps, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (csps.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    No CSPs available at the moment.
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = csps.map(csp => createCSPCard(csp)).join('');
}

function createCSPCard(csp) {
    const acceptanceRate = csp.applications > 0 ? 
        Math.round((csp.availableSlots / csp.applications) * 100) : 100;
    
    const startDate = new Date(csp.startDate).toLocaleDateString();
    const endDate = new Date(csp.endDate).toLocaleDateString();
    
    return `
        <div class="col-md-4">
            <div class="csp-card">
                <div class="csp-card-header">
                    <h5 class="mb-1">${escapeHtml(csp.title)}</h5>
                    <p class="mb-0 opacity-75">${escapeHtml(csp.organization)}</p>
                </div>
                <div class="csp-card-body">
                    <div class="csp-meta">
                        <div class="csp-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${escapeHtml(csp.location)}</span>
                        </div>
                        <div class="csp-meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${startDate} - ${endDate}</span>
                        </div>
                        <div class="csp-meta-item">
                            <i class="fas fa-tag"></i>
                            <span>${escapeHtml(csp.category)}</span>
                        </div>
                    </div>
                    
                    <p class="csp-description">
                        ${escapeHtml(csp.description.substring(0, 80))}...
                    </p>
                    
                    <div class="csp-stats">
                        <div class="csp-stat available">
                            <i class="fas fa-users me-1"></i>
                            ${csp.availableSlots} slots
                        </div>
                        <div class="csp-stat applications">
                            <i class="fas fa-file-alt me-1"></i>
                            ${csp.applications} applications
                        </div>
                        <div class="csp-stat rate">
                            <i class="fas fa-percentage me-1"></i>
                            ${acceptanceRate}% rate
                        </div>
                    </div>
                    
                    <div class="d-flex gap-2">
                        <a href="csp-details.html?id=${csp.id}" class="btn btn-primary btn-sm flex-fill">
                            <i class="fas fa-eye me-1"></i>View Details
                        </a>
                        ${authManager.isAuthenticated() ? `
                            <button class="btn btn-outline-primary btn-sm" onclick="quickApply(${csp.id})">
                                <i class="fas fa-paper-plane me-1"></i>Quick Apply
                            </button>
                        ` : `
                            <a href="login.html" class="btn btn-outline-primary btn-sm">
                                <i class="fas fa-sign-in-alt me-1"></i>Login to Apply
                            </a>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function quickApply(cspId) {
    if (!authManager.requireAuth()) return;
    
    try {
        const message = prompt('Why are you interested in this CSP? (Optional)');
        const result = await API.applyForCSP(cspId, message || '');
        
        if (result.success) {
            authManager.showNotification('Application submitted successfully!', 'success');
            // Refresh the page to update the UI
            setTimeout(() => window.location.reload(), 1000);
        } else {
            authManager.showNotification(result.message, 'error');
        }
    } catch (error) {
        authManager.showNotification('Failed to submit application', 'error');
    }
}

function initializePageSpecificFeatures() {
    // Add any page-specific initialization here
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'csp-discovery.html':
            initializeCSPDiscovery();
            break;
        case 'csp-details.html':
            initializeCSPDetails();
            break;
        case 'my-applications.html':
            initializeMyApplications();
            break;
        case 'timesheet.html':
            initializeTimesheet();
            break;
        case 'profile.html':
            initializeProfile();
            break;
        case 'csp-management.html':
            initializeCSPManagement();
            break;
        case 'admin-panel.html':
            initializeAdminPanel();
            break;
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-pending">Pending</span>',
        'approved': '<span class="badge badge-approved">Approved</span>',
        'rejected': '<span class="badge badge-rejected">Rejected</span>',
        'completed': '<span class="badge badge-completed">Completed</span>',
        'active': '<span class="badge badge-approved">Active</span>',
        'inactive': '<span class="badge badge-pending">Inactive</span>'
    };
    return badges[status] || '<span class="badge badge-pending">Unknown</span>';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other files
window.quickApply = quickApply;
window.formatDate = formatDate;
window.formatDateTime = formatDateTime;
window.getStatusBadge = getStatusBadge;
window.escapeHtml = escapeHtml;
