// My Applications page functionality

let allApplications = [];
let filteredApplications = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    initializeMyApplications();
});

function initializeMyApplications() {
    // Check authentication
    if (!authManager.requireAuth()) {
        return;
    }

    // Load applications
    loadApplications();
}

async function loadApplications() {
    try {
        showLoading(true);
        
        const user = authManager.currentUser;
        const result = await API.getApplications(user.id);
        
        if (result.success) {
            allApplications = result.data;
            filteredApplications = [...allApplications];
            
            // Load CSP details for each application
            await loadCSPDetails();
            
            // Update statistics
            updateStatistics();
            
            // Display applications
            displayApplications();
        } else {
            showError('Failed to load applications');
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        showError('Failed to load applications');
    } finally {
        showLoading(false);
    }
}

async function loadCSPDetails() {
    // Load CSP details for each application
    for (let application of allApplications) {
        try {
            const cspResult = await API.getCSP(application.cspId);
            if (cspResult.success) {
                application.csp = cspResult.data;
            }
        } catch (error) {
            console.error(`Error loading CSP ${application.cspId}:`, error);
        }
    }
}

function updateStatistics() {
    const totalApplications = allApplications.length;
    const approvedApplications = allApplications.filter(app => app.status === 'approved').length;
    const totalHours = allApplications.reduce((sum, app) => sum + app.hoursLogged, 0);
    
    document.getElementById('totalApplications').textContent = totalApplications;
    document.getElementById('approvedApplications').textContent = approvedApplications;
    document.getElementById('totalHours').textContent = totalHours;
}

function displayApplications() {
    const applicationsList = document.getElementById('applicationsList');
    const noApplications = document.getElementById('noApplications');
    const noFilterResults = document.getElementById('noFilterResults');
    
    if (allApplications.length === 0) {
        applicationsList.innerHTML = '';
        noApplications.style.display = 'block';
        noFilterResults.style.display = 'none';
        return;
    }
    
    if (filteredApplications.length === 0) {
        applicationsList.innerHTML = '';
        noApplications.style.display = 'none';
        noFilterResults.style.display = 'block';
        return;
    }
    
    noApplications.style.display = 'none';
    noFilterResults.style.display = 'none';
    
    applicationsList.innerHTML = filteredApplications.map(application => 
        createApplicationCard(application)
    ).join('');
}

function createApplicationCard(application) {
    if (!application.csp) {
        return `
            <div class="col-12 mb-3">
                <div class="card">
                    <div class="card-body">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            CSP details not available
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    const csp = application.csp;
    const statusBadge = getStatusBadge(application.status);
    const appliedDate = formatDateTime(application.appliedAt);
    const startDate = formatDate(csp.startDate);
    const endDate = formatDate(csp.endDate);
    
    return `
        <div class="col-12 mb-3">
            <div class="card">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title mb-0">${escapeHtml(csp.title)}</h5>
                                ${statusBadge}
                            </div>
                            <p class="card-text text-muted mb-2">${escapeHtml(csp.organization)}</p>
                            
                            <div class="row g-3 mb-3">
                                <div class="col-sm-6">
                                    <small class="text-muted">
                                        <i class="fas fa-map-marker-alt me-1"></i>${escapeHtml(csp.location)}
                                    </small>
                                </div>
                                <div class="col-sm-6">
                                    <small class="text-muted">
                                        <i class="fas fa-calendar me-1"></i>${startDate} - ${endDate}
                                    </small>
                                </div>
                                <div class="col-sm-6">
                                    <small class="text-muted">
                                        <i class="fas fa-clock me-1"></i>Applied on ${appliedDate}
                                    </small>
                                </div>
                                <div class="col-sm-6">
                                    <small class="text-muted">
                                        <i class="fas fa-hourglass-half me-1"></i>${application.hoursLogged} hours logged
                                    </small>
                                </div>
                            </div>
                            
                            ${application.message ? `
                                <div class="alert alert-light">
                                    <strong>Your message:</strong><br>
                                    ${escapeHtml(application.message)}
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="col-md-4 text-md-end">
                            <div class="d-flex flex-column gap-2">
                                <a href="csp-details.html?id=${csp.id}" class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-eye me-1"></i>View CSP
                                </a>
                                
                                ${application.status === 'approved' ? `
                                    <a href="timesheet.html?applicationId=${application.id}" class="btn btn-success btn-sm">
                                        <i class="fas fa-clock me-1"></i>Log Hours
                                    </a>
                                ` : ''}
                                
                                ${application.status === 'completed' ? `
                                    <button class="btn btn-info btn-sm" onclick="viewTimesheet(${application.id})">
                                        <i class="fas fa-list me-1"></i>View Timesheet
                                    </button>
                                ` : ''}
                                
                                <button class="btn btn-outline-secondary btn-sm" onclick="viewApplicationDetails(${application.id})">
                                    <i class="fas fa-info-circle me-1"></i>Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function filterApplications(status) {
    currentFilter = status;
    
    // Update filter buttons
    document.querySelectorAll('[id^="filter"]').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`filter${status.charAt(0).toUpperCase() + status.slice(1)}`).classList.add('active');
    
    // Filter applications
    if (status === 'all') {
        filteredApplications = [...allApplications];
    } else {
        filteredApplications = allApplications.filter(app => app.status === status);
    }
    
    // Display filtered applications
    displayApplications();
}

function viewApplicationDetails(applicationId) {
    const application = allApplications.find(app => app.id === applicationId);
    if (!application) return;
    
    const csp = application.csp;
    const statusBadge = getStatusBadge(application.status);
    const appliedDate = formatDateTime(application.appliedAt);
    const startDate = formatDate(csp.startDate);
    const endDate = formatDate(csp.endDate);
    
    const modalContent = `
        <div class="modal fade" id="applicationModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Application Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>CSP Information</h6>
                                <p><strong>Title:</strong> ${escapeHtml(csp.title)}</p>
                                <p><strong>Organization:</strong> ${escapeHtml(csp.organization)}</p>
                                <p><strong>Location:</strong> ${escapeHtml(csp.location)}</p>
                                <p><strong>Duration:</strong> ${startDate} - ${endDate}</p>
                                <p><strong>Category:</strong> ${escapeHtml(csp.category)}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Application Information</h6>
                                <p><strong>Status:</strong> ${statusBadge}</p>
                                <p><strong>Applied Date:</strong> ${appliedDate}</p>
                                <p><strong>Hours Logged:</strong> ${application.hoursLogged}</p>
                                <p><strong>Timesheet Entries:</strong> ${application.timesheet.length}</p>
                            </div>
                        </div>
                        
                        ${application.message ? `
                            <hr>
                            <h6>Your Message</h6>
                            <div class="alert alert-light">
                                ${escapeHtml(application.message)}
                            </div>
                        ` : ''}
                        
                        ${application.timesheet.length > 0 ? `
                            <hr>
                            <h6>Timesheet Entries</h6>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Hours</th>
                                            <th>Activity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${application.timesheet.map(entry => `
                                            <tr>
                                                <td>${formatDate(entry.date)}</td>
                                                <td>${entry.hours}</td>
                                                <td>${escapeHtml(entry.activity)}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <a href="csp-details.html?id=${csp.id}" class="btn btn-primary">View CSP</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('applicationModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalContent);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
    modal.show();
}

function viewTimesheet(applicationId) {
    window.location.href = `timesheet.html?applicationId=${applicationId}`;
}

function showLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const applicationsList = document.getElementById('applicationsList');
    const noApplications = document.getElementById('noApplications');
    const noFilterResults = document.getElementById('noFilterResults');
    
    if (show) {
        loadingSpinner.style.display = 'block';
        applicationsList.style.display = 'none';
        noApplications.style.display = 'none';
        noFilterResults.style.display = 'none';
    } else {
        loadingSpinner.style.display = 'none';
        applicationsList.style.display = 'block';
    }
}

function showError(message) {
    authManager.showNotification(message, 'error');
}

// Export functions for use in HTML
window.filterApplications = filterApplications;
window.viewApplicationDetails = viewApplicationDetails;
window.viewTimesheet = viewTimesheet;
