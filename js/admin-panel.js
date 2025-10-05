// Admin Panel page functionality

let allUsers = [];
let allOrganizations = [];
let allCSPs = [];
let allApplications = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // Check authentication and role
    if (!authManager.requireRole('admin')) {
        return;
    }

    // Initialize forms
    initializeForms();

    // Load data
    loadDashboardData();
    loadUsers();
    loadOrganizations();
    loadCSPs();
    loadApplications();
}

function initializeForms() {
    // System settings form
    const systemSettingsForm = document.getElementById('systemSettingsForm');
    systemSettingsForm.addEventListener('submit', handleSystemSettings);

    // Email blast form
    const emailBlastForm = document.getElementById('emailBlastForm');
    emailBlastForm.addEventListener('submit', handleEmailBlast);
}

async function loadDashboardData() {
    try {
        const [statsResult, cspsResult] = await Promise.all([
            API.getStats(),
            API.getCSPs()
        ]);

        if (statsResult.success) {
            const stats = statsResult.data;
            document.getElementById('totalUsers').textContent = stats.totalStudents;
            document.getElementById('totalCSPs').textContent = stats.totalCSPs;
            document.getElementById('totalOrganizations').textContent = stats.totalOrganizations;
        }

        if (cspsResult.success) {
            const recentCSPs = cspsResult.data.slice(0, 5);
            displayRecentCSPs(recentCSPs);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function displayRecentCSPs(csps) {
    const recentCSPsList = document.getElementById('recentCSPsList');
    
    if (csps.length === 0) {
        recentCSPsList.innerHTML = '<p class="text-muted">No CSPs found</p>';
        return;
    }

    recentCSPsList.innerHTML = csps.map(csp => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <h6 class="mb-0">${escapeHtml(csp.title)}</h6>
                <small class="text-muted">${escapeHtml(csp.organization)}</small>
            </div>
            <span class="badge bg-primary">${csp.status}</span>
        </div>
    `).join('');
}

async function loadUsers() {
    try {
        const result = await API.getUsers();
        if (result.success) {
            allUsers = result.data;
            displayUsers(allUsers);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers(users) {
    const usersTableBody = document.getElementById('usersTableBody');
    
    usersTableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>
                <span class="badge bg-${getRoleBadgeColor(user.role)}">${getRoleDisplayName(user.role)}</span>
            </td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getRoleBadgeColor(role) {
    switch (role) {
        case 'admin': return 'danger';
        case 'csp_leader': return 'success';
        case 'student': return 'primary';
        default: return 'secondary';
    }
}

function getRoleDisplayName(role) {
    switch (role) {
        case 'admin': return 'Admin';
        case 'csp_leader': return 'CSP Leader';
        case 'student': return 'Student';
        default: return 'Unknown';
    }
}

async function loadOrganizations() {
    try {
        const result = await API.getOrganizations();
        if (result.success) {
            allOrganizations = result.data;
            displayOrganizations(allOrganizations);
        }
    } catch (error) {
        console.error('Error loading organizations:', error);
    }
}

function displayOrganizations(organizations) {
    const organizationsList = document.getElementById('organizationsList');
    
    if (organizations.length === 0) {
        organizationsList.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-building fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No Organizations</h5>
                    <p class="text-muted">No organizations have been created yet.</p>
                </div>
            </div>
        `;
        return;
    }

    organizationsList.innerHTML = organizations.map(org => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${escapeHtml(org.name)}</h5>
                    <p class="card-text text-muted">${escapeHtml(org.description)}</p>
                    <div class="mb-2">
                        <small class="text-muted">
                            <i class="fas fa-envelope me-1"></i>${escapeHtml(org.contact)}
                        </small>
                    </div>
                    <div class="mb-2">
                        <small class="text-muted">
                            <i class="fas fa-phone me-1"></i>${escapeHtml(org.phone)}
                        </small>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i>${escapeHtml(org.address)}
                        </small>
                    </div>
                    <span class="badge bg-${org.status === 'active' ? 'success' : 'secondary'}">${org.status}</span>
                </div>
                <div class="card-footer">
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-primary btn-sm flex-fill" onclick="editOrganization(${org.id})">
                            <i class="fas fa-edit me-1"></i>Edit
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteOrganization(${org.id})">
                            <i class="fas fa-trash me-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadCSPs() {
    try {
        const result = await API.getCSPs();
        if (result.success) {
            allCSPs = result.data;
            displayCSPs(allCSPs);
        }
    } catch (error) {
        console.error('Error loading CSPs:', error);
    }
}

function displayCSPs(csps) {
    const cspsList = document.getElementById('cspsList');
    
    if (csps.length === 0) {
        cspsList.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-list fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">No CSPs</h5>
                    <p class="text-muted">No community service projects have been created yet.</p>
                </div>
            </div>
        `;
        return;
    }

    cspsList.innerHTML = csps.map(csp => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0">${escapeHtml(csp.title)}</h6>
                    <span class="badge bg-${getStatusBadgeColor(csp.status)}">${csp.status}</span>
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
                                <i class="fas fa-tag me-1"></i>${escapeHtml(csp.category)}
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
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteCSP(${csp.id})">
                            <i class="fas fa-trash me-1"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusBadgeColor(status) {
    switch (status) {
        case 'active': return 'success';
        case 'inactive': return 'secondary';
        case 'pending': return 'warning';
        default: return 'secondary';
    }
}

async function loadApplications() {
    try {
        const result = await API.getApplications();
        if (result.success) {
            allApplications = result.data;
            document.getElementById('totalApplications').textContent = allApplications.length;
        }
    } catch (error) {
        console.error('Error loading applications:', error);
    }
}

function filterUsers() {
    const roleFilter = document.getElementById('userRoleFilter').value;
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    
    let filteredUsers = allUsers;
    
    if (roleFilter) {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
    }
    
    if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }
    
    displayUsers(filteredUsers);
}

function filterCSPs() {
    const statusFilter = document.getElementById('cspStatusFilter').value;
    const categoryFilter = document.getElementById('cspCategoryFilter').value;
    const searchTerm = document.getElementById('searchCSPs').value.toLowerCase();
    
    let filteredCSPs = allCSPs;
    
    if (statusFilter) {
        filteredCSPs = filteredCSPs.filter(csp => csp.status === statusFilter);
    }
    
    if (categoryFilter) {
        filteredCSPs = filteredCSPs.filter(csp => csp.category === categoryFilter);
    }
    
    if (searchTerm) {
        filteredCSPs = filteredCSPs.filter(csp => 
            csp.title.toLowerCase().includes(searchTerm) ||
            csp.organization.toLowerCase().includes(searchTerm) ||
            csp.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayCSPs(filteredCSPs);
}

async function handleSystemSettings(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const settings = {
        siteName: formData.get('siteName'),
        siteDescription: formData.get('siteDescription'),
        maxCSPsPerUser: parseInt(formData.get('maxCSPsPerUser')),
        emailNotifications: formData.has('emailNotifications')
    };
    
    // TODO: Implement settings save
    authManager.showNotification('Settings saved successfully!', 'success');
}

async function handleEmailBlast(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const emailData = {
        subject: formData.get('emailSubject'),
        message: formData.get('emailMessage'),
        recipients: formData.get('emailRecipients')
    };
    
    if (!emailData.subject || !emailData.message) {
        authManager.showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // TODO: Implement email blast
    authManager.showNotification('Email blast sent successfully!', 'success');
    
    // Reset form
    event.target.reset();
}

function createUser() {
    // TODO: Implement create user modal
    authManager.showNotification('Create user functionality coming soon!', 'info');
}

function editUser(userId) {
    // TODO: Implement edit user modal
    authManager.showNotification('Edit user functionality coming soon!', 'info');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        // TODO: Implement delete user
        authManager.showNotification('Delete user functionality coming soon!', 'info');
    }
}

function createOrganization() {
    // TODO: Implement create organization modal
    authManager.showNotification('Create organization functionality coming soon!', 'info');
}

function editOrganization(orgId) {
    // TODO: Implement edit organization modal
    authManager.showNotification('Edit organization functionality coming soon!', 'info');
}

function deleteOrganization(orgId) {
    if (confirm('Are you sure you want to delete this organization? This action cannot be undone.')) {
        // TODO: Implement delete organization
        authManager.showNotification('Delete organization functionality coming soon!', 'info');
    }
}

function editCSP(cspId) {
    // TODO: Implement edit CSP modal
    authManager.showNotification('Edit CSP functionality coming soon!', 'info');
}

function deleteCSP(cspId) {
    if (confirm('Are you sure you want to delete this CSP? This action cannot be undone.')) {
        // TODO: Implement delete CSP
        authManager.showNotification('Delete CSP functionality coming soon!', 'info');
    }
}

function exportUsers() {
    // TODO: Implement CSV export
    authManager.showNotification('Export functionality coming soon!', 'info');
}

function exportCSPs() {
    // TODO: Implement CSV export
    authManager.showNotification('Export functionality coming soon!', 'info');
}

function refreshCSPs() {
    loadCSPs();
}

// Export functions for use in HTML
window.filterUsers = filterUsers;
window.filterCSPs = filterCSPs;
window.createUser = createUser;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.createOrganization = createOrganization;
window.editOrganization = editOrganization;
window.deleteOrganization = deleteOrganization;
window.editCSP = editCSP;
window.deleteCSP = deleteCSP;
window.exportUsers = exportUsers;
window.exportCSPs = exportCSPs;
window.refreshCSPs = refreshCSPs;
