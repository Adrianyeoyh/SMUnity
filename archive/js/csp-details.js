// CSP Details page functionality

let currentCSP = null;
let map = null;
let userApplication = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeCSPDetails();
});

function initializeCSPDetails() {
    // Check authentication
    if (!authManager.requireAuth()) {
        return;
    }

    // Get CSP ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const cspId = urlParams.get('id');

    if (!cspId) {
        showError();
        return;
    }

    // Initialize map
    initializeMap();

    // Load CSP details
    loadCSPDetails(cspId);

    // Initialize application form
    initializeApplicationForm();
}

function initializeMap() {
    // Initialize Leaflet map
    map = L.map('map').setView([1.3521, 103.8198], 13); // Singapore coordinates
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

async function loadCSPDetails(cspId) {
    try {
        showLoading(true);
        
        const result = await API.getCSP(parseInt(cspId));
        if (result.success) {
            currentCSP = result.data;
            displayCSPDetails();
            updateMap();
            checkUserApplication();
        } else {
            showError();
        }
    } catch (error) {
        console.error('Error loading CSP details:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

function displayCSPDetails() {
    if (!currentCSP) return;

    // Update page title
    document.title = `${currentCSP.title} - SMUnity`;

    // Update breadcrumb
    document.getElementById('breadcrumbTitle').textContent = currentCSP.title;

    // Update hero section
    document.getElementById('cspTitle').textContent = currentCSP.title;
    document.getElementById('cspOrganization').textContent = currentCSP.organization;

    // Update description
    document.getElementById('cspDescription').textContent = currentCSP.description;

    // Update requirements
    const requirementsList = document.getElementById('cspRequirements');
    requirementsList.innerHTML = currentCSP.requirements.map(req => 
        `<li class="mb-2"><i class="fas fa-check text-success me-2"></i>${escapeHtml(req)}</li>`
    ).join('');

    // Update skills
    const skillsContainer = document.getElementById('cspSkills');
    skillsContainer.innerHTML = currentCSP.skills.map(skill => 
        `<span class="badge bg-primary">${escapeHtml(skill)}</span>`
    ).join('');

    // Update time slots
    const timeSlotsContainer = document.getElementById('cspTimeSlots');
    timeSlotsContainer.innerHTML = currentCSP.timeSlots.map(slot => 
        `<div class="col-md-6">
            <div class="card">
                <div class="card-body text-center">
                    <h6 class="card-title">${escapeHtml(slot.day)}</h6>
                    <p class="card-text text-muted">${escapeHtml(slot.time)}</p>
                </div>
            </div>
        </div>`
    ).join('');

    // Update location
    document.getElementById('cspAddress').textContent = currentCSP.address;
    document.getElementById('cspLocation').textContent = currentCSP.location;

    // Update statistics
    const acceptanceRate = currentCSP.applications > 0 ? 
        Math.round((currentCSP.availableSlots / currentCSP.applications) * 100) : 100;
    
    document.getElementById('totalSlots').textContent = currentCSP.totalSlots;
    document.getElementById('availableSlots').textContent = currentCSP.availableSlots;
    document.getElementById('applications').textContent = currentCSP.applications;
    document.getElementById('acceptanceRate').textContent = `${acceptanceRate}%`;

    // Show CSP details
    document.getElementById('cspDetails').style.display = 'block';
}

function updateMap() {
    if (!currentCSP || !currentCSP.coordinates || currentCSP.coordinates.length !== 2) {
        return;
    }

    // Clear existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Add marker for CSP location
    const marker = L.marker(currentCSP.coordinates).addTo(map);
    
    const popupContent = `
        <div class="map-popup">
            <h6>${escapeHtml(currentCSP.title)}</h6>
            <p class="mb-1"><strong>${escapeHtml(currentCSP.organization)}</strong></p>
            <p class="mb-1 text-muted">${escapeHtml(currentCSP.location)}</p>
            <p class="mb-0">${escapeHtml(currentCSP.address)}</p>
        </div>
    `;
    
    marker.bindPopup(popupContent).openPopup();
    
    // Center map on marker
    map.setView(currentCSP.coordinates, 15);
}

async function checkUserApplication() {
    if (!authManager.currentUser) return;

    try {
        const result = await API.getApplications(authManager.currentUser.id);
        if (result.success) {
            userApplication = result.data.find(app => app.cspId === currentCSP.id);
            updateApplicationStatus();
        }
    } catch (error) {
        console.error('Error checking user application:', error);
    }
}

function updateApplicationStatus() {
    const statusContainer = document.getElementById('applicationStatus');
    const formContainer = document.getElementById('applicationForm');

    if (userApplication) {
        // User has already applied
        formContainer.style.display = 'none';
        
        const statusBadge = getStatusBadge(userApplication.status);
        const appliedDate = formatDateTime(userApplication.appliedAt);
        
        statusContainer.innerHTML = `
            <div class="alert alert-info">
                <h6 class="alert-heading">
                    <i class="fas fa-info-circle me-2"></i>Application Status
                </h6>
                <p class="mb-2">You have already applied for this CSP.</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span>Status: ${statusBadge}</span>
                    <small class="text-muted">Applied on ${appliedDate}</small>
                </div>
                ${userApplication.message ? `
                    <hr>
                    <p class="mb-0"><strong>Your message:</strong><br>${escapeHtml(userApplication.message)}</p>
                ` : ''}
            </div>
        `;
    } else if (currentCSP.availableSlots <= 0) {
        // No available slots
        formContainer.style.display = 'none';
        statusContainer.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>No Available Slots</strong><br>
                This CSP is currently full. Check back later for new opportunities.
            </div>
        `;
    } else {
        // Show application form
        statusContainer.innerHTML = '';
        formContainer.style.display = 'block';
    }
}

function initializeApplicationForm() {
    const applyForm = document.getElementById('applyForm');
    applyForm.addEventListener('submit', handleApplication);
}

async function handleApplication(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const message = formData.get('applicationMessage');

    // Show loading state
    const applyBtn = document.getElementById('applyBtn');
    const spinner = applyBtn.querySelector('.spinner-border');
    const icon = applyBtn.querySelector('.fas');
    
    applyBtn.disabled = true;
    spinner.style.display = 'inline-block';
    icon.style.display = 'none';

    try {
        const result = await API.applyForCSP(currentCSP.id, message);
        
        if (result.success) {
            userApplication = result.data;
            updateApplicationStatus();
            authManager.showNotification('Application submitted successfully!', 'success');
        } else {
            authManager.showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error submitting application:', error);
        authManager.showNotification('Failed to submit application', 'error');
    } finally {
        // Reset button state
        applyBtn.disabled = false;
        spinner.style.display = 'none';
        icon.style.display = 'inline-block';
    }
}

function shareCSP(platform) {
    const url = window.location.href;
    const title = currentCSP.title;
    const text = `Check out this community service opportunity: ${title}`;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function copyLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            authManager.showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        fallbackCopyTextToClipboard(url);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        authManager.showNotification('Link copied to clipboard!', 'success');
    } catch (err) {
        authManager.showNotification('Failed to copy link', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const cspDetails = document.getElementById('cspDetails');
    const errorMessage = document.getElementById('errorMessage');
    
    if (show) {
        loadingSpinner.style.display = 'block';
        cspDetails.style.display = 'none';
        errorMessage.style.display = 'none';
    } else {
        loadingSpinner.style.display = 'none';
    }
}

function showError() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const cspDetails = document.getElementById('cspDetails');
    const errorMessage = document.getElementById('errorMessage');
    
    loadingSpinner.style.display = 'none';
    cspDetails.style.display = 'none';
    errorMessage.style.display = 'block';
}

// Export functions for use in HTML
window.shareCSP = shareCSP;
window.copyLink = copyLink;
