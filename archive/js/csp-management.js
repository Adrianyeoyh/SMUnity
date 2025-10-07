// CSP Management page functionality

let userCSPs = [];
let allApplications = [];
let filteredApplications = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeCSPManagement();
});

function initializeCSPManagement() {
    // Check authentication and role
    if (!authManager.requireRole('csp_leader')) {
        return;
    }

    // Initialize form
    initializeCreateCSPForm();

    // Load data
    loadUserCSPs();
    loadApplications();

    // Initialize filters
    initializeFilters();
}

function initializeCreateCSPForm() {
    const createCSPForm = document.getElementById('createCSPForm');
    createCSPForm.addEventListener('submit', handleCreateCSP);

    // Auto-sync available slots with total slots
    const totalSlotsInput = document.getElementById('cspTotalSlots');
    const availableSlotsInput = document.getElementById('cspAvailableSlots');
    
    totalSlotsInput.addEventListener('input', function() {
        availableSlotsInput.value = this.value;
    });
}

function initializeFilters() {
    const cspFilter = document.getElementById('cspFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchApplications = document.getElementById('searchApplications');

    cspFilter.addEventListener('change', filterApplications);
    statusFilter.addEventListener('change', filterApplications);
    searchApplications.addEventListener('input', debounce(filterApplications, 300));
}

async function loadUserCSPs() {
    try {
        showCSPLoading(true);
        
        const user = authManager.currentUser;
        const result = await API.getCSPs();
        
        if (result.success) {
            // Filter CSPs created by current user
            userCSPs = result.data.filter(csp => csp.createdBy === user.id);
            displayUserCSPs();
        } else {
            showError('Failed to load CSPs');
        }
    } catch (error) {
        console.error('Error loading user CSPs:', error);
        showError('Failed to load CSPs');
    } finally {
        showCSPLoading(false);
    }
}

async function loadApplications() {
    try {
        showApplicationsLoading(true);
        
        const result = await API.getApplications();
        
        if (result.success) {
            // Filter applications for user's CSPs
            const userCSPIds = userCSPs.map(csp => csp.id);
            allApplications = result.data.filter(app => userCSPIds.includes(app.cspId));
            
            // Load CSP details for applications
            await loadCSPDetailsForApplications();
            
            // Populate CSP filter
            populateCSPFilter();
            
            // Display applications
            filterApplications();
        } else {
            showError('Failed to load applications');
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        showError('Failed to load applications');
    } finally {
        showApplicationsLoading(false);
    }
}

async function loadCSPDetailsForApplications() {
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

function displayUserCSPs() {
    const cspList = document.getElementById('cspList');
    const noCSPs = document.getElementById('noCSPs');
    
    if (userCSPs.length === 0) {
        cspList.innerHTML = '';
        noCSPs.style.display = 'block';
        return;
    }
    
    noCSPs.style.display = 'none';
    
    cspList.innerHTML = userCSPs.map(csp => createCSPCard(csp)).join('');
}

function createCSPCard(csp) {
    const startDate = formatDate(csp.startDate);
    const endDate = formatDate(csp.endDate);
    const statusBadge = getStatusBadge(csp.status);
    
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">${escapeHtml(csp.title)}</h6>
                    ${statusBadge}
                </div>
                <div class="card-body">
                    <p class="card-text text-muted mb-3">${escapeHtml(csp.organization)}</p>
                    
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <small class="text-muted">
                                <i class="fas fa-map-marker-alt me-1"></i>${escapeHtml(csp.location)}
                            </small>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>${startDate} - ${endDate}
                            </small>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">
                                <i class="fas fa-users me-1"></i>${csp.availableSlots}/${csp.totalSlots} slots
                            </small>
                        </div>
                        <div class="col-6">
                            <small class="text-muted">
                                <i class="fas fa-file-alt me-1"></i>${csp.applications} applications
                            </small>
                        </div>
                    </div>
                    
                    <p class="card-text">${escapeHtml(csp.description.substring(0, 100))}...</p>
                </div>
                <div class="card-footer">
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm flex-fill" onclick="editCSP(${csp.id})">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-outline-info btn-sm flex-fill" onclick="viewCSPApplications(${csp.id})">
                            <i class="fas fa-users me-1"></i>Applications
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteCSP(${csp.id})">
                            <i class="fas fa-trash me-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function populateCSPFilter() {
    const cspFilter = document.getElementById('cspFilter');
    
    cspFilter.innerHTML = '<option value="">All CSPs</option>';
    
    userCSPs.forEach(csp => {
        const option = document.createElement('option');
        option.value = csp.id;
        option.textContent = csp.title;
        cspFilter.appendChild(option);
    });
}

function filterApplications() {
    const cspId = document.getElementById('cspFilter').value;
    const status = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchApplications').value.toLowerCase();
    
    filteredApplications = allApplications.filter(application => {
        // CSP filter
        if (cspId && application.cspId !== parseInt(cspId)) {
            return false;
        }
        
        // Status filter
        if (status && application.status !== status) {
            return false;
        }
        
        // Search filter
        if (searchTerm) {
            const csp = application.csp;
            if (csp) {
                const searchText = `${csp.title} ${csp.organization} ${application.message || ''}`.toLowerCase();
                if (!searchText.includes(searchTerm)) {
                    return false;
                }
            }
        }
        
        return true;
    });
    
    displayApplications();
}

function displayApplications() {
    const applicationsList = document.getElementById('applicationsList');
    const noApplications = document.getElementById('noApplications');
    
    if (filteredApplications.length === 0) {
        applicationsList.innerHTML = '';
        noApplications.style.display = 'block';
        return;
    }
    
    noApplications.style.display = 'none';
    
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
    
    return `
        <div class="col-12 mb-3">
            <div class="card">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="card-title mb-0">${escapeHtml(csp.title)}</h6>
                                ${statusBadge}
                            </div>
                            <p class="card-text text-muted mb-2">${escapeHtml(csp.organization)}</p>
                            
                            <div class="row g-3 mb-3">
                                <div class="col-sm-6">
                                    <small class="text-muted">
                                        <i class="fas fa-user me-1"></i>Application ID: ${application.id}
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
                                    <strong>Applicant's message:</strong><br>
                                    ${escapeHtml(application.message)}
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="col-md-4 text-md-end">
                            <div class="d-flex flex-column gap-2">
                                ${application.status === 'pending' ? `
                                    <button class="btn btn-success btn-sm" onclick="updateApplicationStatus(${application.id}, 'approved')">
                                        <i class="fas fa-check me-1"></i>Approve
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="updateApplicationStatus(${application.id}, 'rejected')">
                                        <i class="fas fa-times me-1"></i>Reject
                                    </button>
                                ` : ''}
                                
                                <button class="btn btn-outline-info btn-sm" onclick="viewApplicationDetails(${application.id})">
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

async function handleCreateCSP(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const cspData = {
        title: formData.get('title'),
        description: formData.get('description'),
        organization: authManager.currentUser.organization,
        location: formData.get('location'),
        address: formData.get('address'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        totalSlots: parseInt(formData.get('totalSlots')),
        availableSlots: parseInt(formData.get('availableSlots')),
        category: formData.get('category'),
        requirements: formData.get('requirements').split(',').map(req => req.trim()).filter(req => req),
        skills: formData.get('skills').split(',').map(skill => skill.trim()).filter(skill => skill),
        timeSlots: [
            { day: 'Saturday', time: '09:00-17:00' },
            { day: 'Sunday', time: '09:00-17:00' }
        ],
        coordinates: [1.3521, 103.8198], // Default Singapore coordinates
        createdBy: authManager.currentUser.id
    };

    // Show loading state
    const createCSPBtn = document.getElementById('createCSPBtn');
    const spinner = createCSPBtn.querySelector('.spinner-border');
    const icon = createCSPBtn.querySelector('.fas');
    
    createCSPBtn.disabled = true;
    spinner.style.display = 'inline-block';
    icon.style.display = 'none';

    try {
        const result = await API.createCSP(cspData);
        
        if (result.success) {
            authManager.showNotification('CSP created successfully!', 'success');
            
            // Reset form
            event.target.reset();
            
            // Reload CSPs
            await loadUserCSPs();
            
            // Switch to CSPs tab
            switchToCSPsTab();
        } else {
            authManager.showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error creating CSP:', error);
        authManager.showNotification('Failed to create CSP', 'error');
    } finally {
        // Reset button state
        createCSPBtn.disabled = false;
        spinner.style.display = 'none';
        icon.style.display = 'inline-block';
    }
}

async function updateApplicationStatus(applicationId, status) {
    try {
        const result = await API.updateApplicationStatus(applicationId, status);
        
        if (result.success) {
            // Update local data
            const application = allApplications.find(app => app.id === applicationId);
            if (application) {
                application.status = status;
            }
            
            // Refresh display
            filterApplications();
            
            authManager.showNotification(`Application ${status} successfully!`, 'success');
        } else {
            authManager.showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        authManager.showNotification('Failed to update application status', 'error');
    }
}

function viewApplicationDetails(applicationId) {
    const application = allApplications.find(app => app.id === applicationId);
    if (!application) return;
    
    const csp = application.csp;
    const statusBadge = getStatusBadge(application.status);
    const appliedDate = formatDateTime(application.appliedAt);
    
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
                            <h6>Applicant's Message</h6>
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
                        ${application.status === 'pending' ? `
                            <button type="button" class="btn btn-success" onclick="updateApplicationStatus(${application.id}, 'approved')">
                                <i class="fas fa-check me-1"></i>Approve
                            </button>
                            <button type="button" class="btn btn-danger" onclick="updateApplicationStatus(${application.id}, 'rejected')">
                                <i class="fas fa-times me-1"></i>Reject
                            </button>
                        ` : ''}
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

function editCSP(cspId) {
    // Switch to create tab and populate form
    switchToCreateTab();
    // TODO: Implement edit functionality
    authManager.showNotification('Edit functionality coming soon!', 'info');
}

function deleteCSP(cspId) {
    if (confirm('Are you sure you want to delete this CSP? This action cannot be undone.')) {
        // TODO: Implement delete functionality
        authManager.showNotification('Delete functionality coming soon!', 'info');
    }
}

function viewCSPApplications(cspId) {
    // Switch to applications tab and filter by CSP
    switchToApplicationsTab();
    document.getElementById('cspFilter').value = cspId;
    filterApplications();
}

function exportApplications() {
    // TODO: Implement CSV export
    authManager.showNotification('Export functionality coming soon!', 'info');
}

function refreshApplications() {
    loadApplications();
}

function switchToCSPsTab() {
    const cspTab = document.getElementById('csp-tab');
    cspTab.click();
}

function switchToApplicationsTab() {
    const applicationsTab = document.getElementById('applications-tab');
    applicationsTab.click();
}

function switchToCreateTab() {
    const createTab = document.getElementById('create-tab');
    createTab.click();
}

function showCSPLoading(show) {
    const loadingSpinner = document.getElementById('cspLoadingSpinner');
    const cspList = document.getElementById('cspList');
    const noCSPs = document.getElementById('noCSPs');
    
    if (show) {
        loadingSpinner.style.display = 'block';
        cspList.style.display = 'none';
        noCSPs.style.display = 'none';
    } else {
        loadingSpinner.style.display = 'none';
        cspList.style.display = 'block';
    }
}

function showApplicationsLoading(show) {
    const loadingSpinner = document.getElementById('applicationsLoadingSpinner');
    const applicationsList = document.getElementById('applicationsList');
    const noApplications = document.getElementById('noApplications');
    
    if (show) {
        loadingSpinner.style.display = 'block';
        applicationsList.style.display = 'none';
        noApplications.style.display = 'none';
    } else {
        loadingSpinner.style.display = 'none';
        applicationsList.style.display = 'block';
    }
}

function showError(message) {
    authManager.showNotification(message, 'error');
}

// Export functions for use in HTML
window.updateApplicationStatus = updateApplicationStatus;
window.viewApplicationDetails = viewApplicationDetails;
window.editCSP = editCSP;
window.deleteCSP = deleteCSP;
window.viewCSPApplications = viewCSPApplications;
window.exportApplications = exportApplications;
window.refreshApplications = refreshApplications;
window.switchToCSPsTab = switchToCSPsTab;
window.switchToApplicationsTab = switchToApplicationsTab;
window.switchToCreateTab = switchToCreateTab;
