// Timesheet page functionality

let userApplications = [];
let selectedApplication = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeTimesheet();
});

function initializeTimesheet() {
    // Check authentication
    if (!authManager.requireAuth()) {
        return;
    }

    // Initialize form
    initializeLogHoursForm();

    // Load applications
    loadApplications();
}

function initializeLogHoursForm() {
    const logHoursForm = document.getElementById('logHoursForm');
    const logDateInput = document.getElementById('logDate');
    
    // Set default date to today
    logDateInput.value = new Date().toISOString().split('T')[0];
    
    logHoursForm.addEventListener('submit', handleLogHours);
}

async function loadApplications() {
    try {
        showLoading(true);
        
        const user = authManager.currentUser;
        const result = await API.getApplications(user.id);
        
        if (result.success) {
            // Filter only approved applications
            userApplications = result.data.filter(app => app.status === 'approved');
            
            if (userApplications.length === 0) {
                showNoApplications();
                return;
            }
            
            // Load CSP details for each application
            await loadCSPDetails();
            
            // Populate application selector
            populateApplicationSelector();
            
            // Check for specific application in URL
            const urlParams = new URLSearchParams(window.location.search);
            const applicationId = urlParams.get('applicationId');
            
            if (applicationId) {
                const application = userApplications.find(app => app.id === parseInt(applicationId));
                if (application) {
                    selectApplication(application.id);
                }
            }
            
            showTimesheetContent();
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
    for (let application of userApplications) {
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

function populateApplicationSelector() {
    const applicationSelect = document.getElementById('applicationSelect');
    
    applicationSelect.innerHTML = '<option value="">Choose an application...</option>';
    
    userApplications.forEach(application => {
        if (application.csp) {
            const option = document.createElement('option');
            option.value = application.id;
            option.textContent = `${application.csp.title} - ${application.csp.organization}`;
            applicationSelect.appendChild(option);
        }
    });
    
    // Add change event listener
    applicationSelect.addEventListener('change', function() {
        const applicationId = parseInt(this.value);
        if (applicationId) {
            selectApplication(applicationId);
        } else {
            clearSelection();
        }
    });
}

function selectApplication(applicationId) {
    selectedApplication = userApplications.find(app => app.id === applicationId);
    
    if (selectedApplication && selectedApplication.csp) {
        // Update selector
        document.getElementById('applicationSelect').value = applicationId;
        
        // Show application info
        showSelectedApplicationInfo();
        
        // Display timesheet entries
        displayTimesheetEntries();
    }
}

function clearSelection() {
    selectedApplication = null;
    document.getElementById('selectedApplicationInfo').style.display = 'none';
    document.getElementById('timesheetEntries').innerHTML = '';
    document.getElementById('noEntries').style.display = 'none';
}

function showSelectedApplicationInfo() {
    if (!selectedApplication || !selectedApplication.csp) return;
    
    const csp = selectedApplication.csp;
    const totalHours = selectedApplication.hoursLogged;
    const totalEntries = selectedApplication.timesheet.length;
    
    document.getElementById('selectedCSPTitle').textContent = csp.title;
    document.getElementById('selectedCSPOrganization').textContent = csp.organization;
    document.getElementById('totalHoursLogged').textContent = totalHours;
    document.getElementById('totalEntries').textContent = totalEntries;
    
    document.getElementById('selectedApplicationInfo').style.display = 'block';
}

function displayTimesheetEntries() {
    const timesheetEntries = document.getElementById('timesheetEntries');
    const noEntries = document.getElementById('noEntries');
    
    if (!selectedApplication || !selectedApplication.timesheet || selectedApplication.timesheet.length === 0) {
        timesheetEntries.innerHTML = '';
        noEntries.style.display = 'block';
        return;
    }
    
    noEntries.style.display = 'none';
    
    // Sort entries by date (newest first)
    const sortedEntries = [...selectedApplication.timesheet].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    timesheetEntries.innerHTML = sortedEntries.map(entry => 
        createTimesheetEntry(entry)
    ).join('');
}

function createTimesheetEntry(entry) {
    const date = formatDate(entry.date);
    const hours = entry.hours;
    const activity = escapeHtml(entry.activity);
    
    return `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <div class="text-center">
                            <h5 class="text-primary mb-0">${hours}</h5>
                            <small class="text-muted">hours</small>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="text-center">
                            <h6 class="mb-0">${date}</h6>
                            <small class="text-muted">Date</small>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <p class="mb-0">${activity}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function handleLogHours(event) {
    event.preventDefault();
    
    if (!selectedApplication) {
        authManager.showNotification('Please select an application first', 'warning');
        return;
    }
    
    const formData = new FormData(event.target);
    const date = formData.get('logDate');
    const hours = parseFloat(formData.get('logHours'));
    const activity = formData.get('logActivity');
    
    // Show loading state
    const logHoursBtn = document.getElementById('logHoursBtn');
    const spinner = logHoursBtn.querySelector('.spinner-border');
    const icon = logHoursBtn.querySelector('.fas');
    
    logHoursBtn.disabled = true;
    spinner.style.display = 'inline-block';
    icon.style.display = 'none';
    
    try {
        const result = await API.logHours(selectedApplication.id, date, hours, activity);
        
        if (result.success) {
            // Update selected application
            selectedApplication = result.data;
            
            // Update UI
            showSelectedApplicationInfo();
            displayTimesheetEntries();
            
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('logHoursModal'));
            modal.hide();
            event.target.reset();
            
            // Set default date to today
            document.getElementById('logDate').value = new Date().toISOString().split('T')[0];
            
            authManager.showNotification('Hours logged successfully!', 'success');
        } else {
            authManager.showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error logging hours:', error);
        authManager.showNotification('Failed to log hours', 'error');
    } finally {
        // Reset button state
        logHoursBtn.disabled = false;
        spinner.style.display = 'none';
        icon.style.display = 'inline-block';
    }
}

function showLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const timesheetContent = document.getElementById('timesheetContent');
    const noApplications = document.getElementById('noApplications');
    
    if (show) {
        loadingSpinner.style.display = 'block';
        timesheetContent.style.display = 'none';
        noApplications.style.display = 'none';
    } else {
        loadingSpinner.style.display = 'none';
    }
}

function showTimesheetContent() {
    document.getElementById('timesheetContent').style.display = 'block';
}

function showNoApplications() {
    document.getElementById('noApplications').style.display = 'block';
}

function showError(message) {
    authManager.showNotification(message, 'error');
}
