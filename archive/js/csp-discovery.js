// CSP Discovery page functionality

let map = null;
let mapMarkers = [];
let currentFilters = {};
let currentPage = 1;
let itemsPerPage = 9;
let allCSPs = [];
let filteredCSPs = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeCSPDiscovery();
});

function initializeCSPDiscovery() {
    // Initialize components
    initializeSearchForm();
    initializeFilters();
    initializeMap();
    initializeViewMode();
    initializeSorting();
    
    // Load CSPs
    loadCSPs();
    
    // Check for search parameters from homepage
    checkHomepageSearch();
}

function initializeSearchForm() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    searchForm.addEventListener('submit', handleSearch);
    
    // Real-time search
    searchInput.addEventListener('input', debounce(handleSearch, 500));
}

function initializeFilters() {
    const filterInputs = document.querySelectorAll('#searchForm select, #searchForm input[type="text"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', handleSearch);
    });

    // Sidebar filters
    const sidebarFilters = document.querySelectorAll('.card-body input, .card-body select');
    sidebarFilters.forEach(input => {
        input.addEventListener('change', handleSearch);
    });
}

function initializeMap() {
    // Initialize Leaflet map
    map = L.map('map').setView([1.3521, 103.8198], 11); // Singapore coordinates
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

function initializeViewMode() {
    const viewModeInputs = document.querySelectorAll('input[name="viewMode"]');
    viewModeInputs.forEach(input => {
        input.addEventListener('change', function() {
            displayCSPs(filteredCSPs);
        });
    });
}

function initializeSorting() {
    const sortSelect = document.getElementById('sortBy');
    sortSelect.addEventListener('change', function() {
        sortCSPs();
        displayCSPs(filteredCSPs);
    });
}

async function loadCSPs() {
    try {
        showLoading(true);
        
        const result = await API.getCSPs();
        if (result.success) {
            allCSPs = result.data;
            filteredCSPs = [...allCSPs];
            sortCSPs();
            displayCSPs(filteredCSPs);
            updateMap();
        } else {
            showError('Failed to load CSPs');
        }
    } catch (error) {
        console.error('Error loading CSPs:', error);
        showError('Failed to load CSPs');
    } finally {
        showLoading(false);
    }
}

function handleSearch(event) {
    if (event) {
        event.preventDefault();
    }

    // Get search criteria
    const searchTerm = document.getElementById('searchInput').value.trim();
    const category = document.getElementById('categoryFilter').value;
    
    console.log('handleSearch called with:', { searchTerm, category });
    const location = document.getElementById('locationFilter').value.trim();
    const skills = document.getElementById('skillsFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Get time commitment filters
    const timeFilters = [];
    if (document.getElementById('timeWeekend').checked) timeFilters.push('weekend');
    if (document.getElementById('timeWeekday').checked) timeFilters.push('weekday');
    if (document.getElementById('timeFlexible').checked) timeFilters.push('flexible');
    
    // Get availability filter
    const availableSlots = document.getElementById('availableSlots').checked;

    // Apply filters
    filteredCSPs = allCSPs.filter(csp => {
        // Search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            if (!csp.title.toLowerCase().includes(searchLower) &&
                !csp.description.toLowerCase().includes(searchLower) &&
                !csp.organization.toLowerCase().includes(searchLower)) {
                return false;
            }
        }

        // Category
        if (category && csp.category !== category) {
            console.log('Filtering out CSP:', csp.title, 'Category mismatch:', csp.category, 'vs', category);
            return false;
        }

        // Location
        if (location) {
            const locationLower = location.toLowerCase();
            if (!csp.location.toLowerCase().includes(locationLower) &&
                !csp.address.toLowerCase().includes(locationLower)) {
                return false;
            }
        }

        // Skills
        if (skills && !csp.skills.includes(skills)) {
            return false;
        }

        // Date range
        if (startDate && csp.startDate < startDate) {
            return false;
        }
        if (endDate && csp.endDate > endDate) {
            return false;
        }

        // Time commitment
        if (timeFilters.length > 0) {
            const cspTimeSlots = csp.timeSlots.map(slot => slot.day.toLowerCase());
            const hasMatchingTime = timeFilters.some(filter => {
                if (filter === 'weekend') {
                    return cspTimeSlots.some(day => day.includes('saturday') || day.includes('sunday'));
                } else if (filter === 'weekday') {
                    return cspTimeSlots.some(day => day.includes('weekday') || 
                        (day.includes('monday') || day.includes('tuesday') || day.includes('wednesday') || 
                         day.includes('thursday') || day.includes('friday')));
                } else if (filter === 'flexible') {
                    return cspTimeSlots.some(day => day.includes('flexible'));
                }
                return false;
            });
            if (!hasMatchingTime) {
                return false;
            }
        }

        // Available slots
        if (availableSlots && csp.availableSlots <= 0) {
            return false;
        }

        return true;
    });

    // Reset pagination
    currentPage = 1;
    
    // Sort and display
    console.log('Filtered CSPs count:', filteredCSPs.length);
    sortCSPs();
    displayCSPs(filteredCSPs);
    updateMap();
}

function sortCSPs() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredCSPs.sort((a, b) => {
        switch (sortBy) {
            case 'date':
                return new Date(a.startDate) - new Date(b.startDate);
            case 'slots':
                return b.availableSlots - a.availableSlots;
            case 'rate':
                const rateA = a.applications > 0 ? (a.availableSlots / a.applications) * 100 : 100;
                const rateB = b.applications > 0 ? (b.availableSlots / b.applications) * 100 : 100;
                return rateB - rateA;
            case 'relevance':
            default:
                // Sort by available slots first, then by start date
                if (a.availableSlots !== b.availableSlots) {
                    return b.availableSlots - a.availableSlots;
                }
                return new Date(a.startDate) - new Date(b.startDate);
        }
    });
}

function displayCSPs(csps) {
    const resultsContainer = document.getElementById('cspResults');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    
    // Update results count
    resultsCount.textContent = `${csps.length} CSP${csps.length !== 1 ? 's' : ''} found`;

    if (csps.length === 0) {
        resultsContainer.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    // Pagination
    const totalPages = Math.ceil(csps.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCSPs = csps.slice(startIndex, endIndex);

    // Get view mode
    const viewMode = document.querySelector('input[name="viewMode"]:checked').value;

    if (viewMode === 'list') {
        resultsContainer.innerHTML = paginatedCSPs.map(csp => createCSPListItem(csp)).join('');
    } else {
        resultsContainer.innerHTML = paginatedCSPs.map(csp => createCSPCard(csp)).join('');
    }

    // Update pagination
    updatePagination(totalPages);
}

function createCSPCard(csp) {
    const acceptanceRate = csp.applications > 0 ? 
        Math.round((csp.availableSlots / csp.applications) * 100) : 100;
    
    const startDate = new Date(csp.startDate).toLocaleDateString();
    const endDate = new Date(csp.endDate).toLocaleDateString();
    
    return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="csp-card h-100">
                <div class="csp-card-header">
                    <h5 class="mb-1">${escapeHtml(csp.title)}</h5>
                    <p class="mb-0 opacity-75">${escapeHtml(csp.organization)}</p>
                </div>
                <div class="csp-card-body d-flex flex-column">
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
                    
                    <p class="csp-description flex-grow-1">
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
                    
                    <div class="d-flex gap-2 mt-auto">
                        <button class="btn btn-primary btn-sm flex-fill" onclick="viewCSPDetails(${csp.id})">
                            <i class="fas fa-eye me-1"></i>View Details
                        </button>
                        <button class="btn btn-outline-primary btn-sm" onclick="quickApply(${csp.id})">
                            <i class="fas fa-paper-plane me-1"></i>Quick Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createCSPListItem(csp) {
    const acceptanceRate = csp.applications > 0 ? 
        Math.round((csp.availableSlots / csp.applications) * 100) : 100;
    
    const startDate = new Date(csp.startDate).toLocaleDateString();
    const endDate = new Date(csp.endDate).toLocaleDateString();
    
    return `
        <div class="col-12 mb-3">
            <div class="card">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5 class="card-title mb-2">${escapeHtml(csp.title)}</h5>
                            <p class="card-text text-muted mb-2">${escapeHtml(csp.organization)}</p>
                            <div class="d-flex flex-wrap gap-3 mb-2">
                                <small class="text-muted">
                                    <i class="fas fa-map-marker-alt me-1"></i>${escapeHtml(csp.location)}
                                </small>
                                <small class="text-muted">
                                    <i class="fas fa-calendar me-1"></i>${startDate} - ${endDate}
                                </small>
                                <small class="text-muted">
                                    <i class="fas fa-tag me-1"></i>${escapeHtml(csp.category)}
                                </small>
                            </div>
                            <p class="card-text">${escapeHtml(csp.description.substring(0, 200))}...</p>
                        </div>
                        <div class="col-md-4 text-md-end">
                            <div class="mb-2">
                                <span class="badge bg-success me-1">${csp.availableSlots} slots</span>
                                <span class="badge bg-primary me-1">${csp.applications} applications</span>
                                <span class="badge bg-warning">${acceptanceRate}% rate</span>
                            </div>
                            <div class="d-flex gap-2 justify-content-md-end">
                                <button class="btn btn-primary btn-sm" onclick="viewCSPDetails(${csp.id})">
                                    <i class="fas fa-eye me-1"></i>View Details
                                </button>
                                <button class="btn btn-outline-primary btn-sm" onclick="quickApply(${csp.id})">
                                    <i class="fas fa-paper-plane me-1"></i>Quick Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `;

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
    }

    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;

    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredCSPs.length / itemsPerPage);
    
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayCSPs(filteredCSPs);
        
        // Scroll to top of results
        document.getElementById('cspResults').scrollIntoView({ behavior: 'smooth' });
    }
}

function updateMap() {
    // Clear existing markers
    mapMarkers.forEach(marker => map.removeLayer(marker));
    mapMarkers = [];

    if (filteredCSPs.length === 0) {
        return;
    }

    // Add markers for filtered CSPs
    filteredCSPs.forEach(csp => {
        if (csp.coordinates && csp.coordinates.length === 2) {
            const marker = L.marker(csp.coordinates).addTo(map);
            
            const popupContent = `
                <div class="map-popup">
                    <h6>${escapeHtml(csp.title)}</h6>
                    <p class="mb-1"><strong>${escapeHtml(csp.organization)}</strong></p>
                    <p class="mb-1 text-muted">${escapeHtml(csp.location)}</p>
                    <p class="mb-2">${escapeHtml(csp.description.substring(0, 100))}...</p>
                    <div class="d-flex gap-1">
                        <button class="btn btn-primary btn-sm" onclick="viewCSPDetails(${csp.id})">
                            <i class="fas fa-eye me-1"></i>View
                        </button>
                        <button class="btn btn-outline-primary btn-sm" onclick="quickApply(${csp.id})">
                            <i class="fas fa-paper-plane me-1"></i>Apply
                        </button>
                    </div>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            mapMarkers.push(marker);
        }
    });

    // Fit map to show all markers
    if (mapMarkers.length > 0) {
        const group = new L.featureGroup(mapMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

function toggleMap() {
    const mapContainer = document.getElementById('mapContainer');
    const mapToggleText = document.getElementById('mapToggleText');
    
    if (mapContainer.style.display === 'none') {
        mapContainer.style.display = 'block';
        mapToggleText.textContent = 'Hide Map';
        
        // Update map after a short delay to ensure container is visible
        setTimeout(() => {
            map.invalidateSize();
            updateMap();
        }, 100);
    } else {
        mapContainer.style.display = 'none';
        mapToggleText.textContent = 'Show Map';
    }
}

function clearFilters() {
    // Reset search form
    document.getElementById('searchForm').reset();
    
    // Reset sidebar filters
    document.querySelectorAll('.card-body input, .card-body select').forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    
    // Reset pagination
    currentPage = 1;
    
    // Reload all CSPs
    filteredCSPs = [...allCSPs];
    sortCSPs();
    displayCSPs(filteredCSPs);
    updateMap();
}

function showLoading(show) {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const cspResults = document.getElementById('cspResults');
    
    if (show) {
        loadingSpinner.style.display = 'block';
        cspResults.style.display = 'none';
    } else {
        loadingSpinner.style.display = 'none';
        cspResults.style.display = '';
    }
}

function showError(message) {
    authManager.showNotification(message, 'error');
}

function viewCSPDetails(cspId) {
    // Check if user is logged in
    if (!authManager.isAuthenticated()) {
        showLoginRequiredModal('view details');
        return;
    }
    window.location.href = `csp-details.html?id=${cspId}`;
}

function quickApply(cspId) {
    // Check if user is logged in
    if (!authManager.isAuthenticated()) {
        showLoginRequiredModal('apply');
        return;
    }
    
    const csp = allCSPs.find(c => c.id === cspId);
    if (!csp) return;
    
    if (csp.availableSlots <= 0) {
        showNotification('No available slots for this CSP', 'error');
        return;
    }
    
    // Show application modal
    showApplicationModal(csp);
}

function checkHomepageSearch() {
    const query = sessionStorage.getItem('searchQuery');
    const category = sessionStorage.getItem('searchCategory');
    
    console.log('checkHomepageSearch called with:', { query, category });
    
    if (query || category) {
        // Set search input
        if (query) {
            document.getElementById('searchInput').value = query;
            console.log('Set search input to:', query);
        }
        
        // Set category filter
        if (category) {
            const categorySelect = document.getElementById('categoryFilter');
            categorySelect.value = category;
            console.log('Set category filter to:', category);
        }
        
        // Apply filters
        console.log('Calling handleSearch...');
        handleSearch();
        
        // Clear session storage
        sessionStorage.removeItem('searchQuery');
        sessionStorage.removeItem('searchCategory');
    }
}

function showLoginRequiredModal(action) {
    const modal = new bootstrap.Modal(document.getElementById('loginRequiredModal'));
    const modalBody = document.getElementById('loginRequiredModalBody');
    modalBody.innerHTML = `
        <p>You need to be logged in to ${action} for CSPs.</p>
        <p>Please log in to continue.</p>
    `;
    modal.show();
}

function showApplicationModal(csp) {
    const modal = new bootstrap.Modal(document.getElementById('applicationModal'));
    const modalTitle = document.getElementById('applicationModalTitle');
    const modalBody = document.getElementById('applicationModalBody');
    
    modalTitle.textContent = `Apply for ${csp.title}`;
    modalBody.innerHTML = `
        <div class="mb-3">
            <h6>Important Notice</h6>
            <div class="alert alert-warning">
                <p class="mb-2"><strong>Before applying, please ensure:</strong></p>
                <ul class="mb-0">
                    <li>You can commit to the full duration of this CSP</li>
                    <li>You meet all the requirements listed</li>
                    <li>You are available for the specified time slots</li>
                    <li>You understand this is a serious commitment</li>
                </ul>
            </div>
        </div>
        
        <div class="mb-3">
            <label for="applicationMessage" class="form-label">Why do you want to join this CSP?</label>
            <textarea class="form-control" id="applicationMessage" rows="3" 
                placeholder="Please explain your motivation and relevant experience..."></textarea>
        </div>
        
        <div class="mb-3">
            <label for="commitmentCheck" class="form-label">Commitment Confirmation</label>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="commitmentCheck">
                <label class="form-check-label" for="commitmentCheck">
                    I confirm that I can commit to the full duration of this CSP and will fulfill all requirements
                </label>
            </div>
        </div>
        
        <div class="mb-3">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="availabilityCheck">
                <label class="form-check-label" for="availabilityCheck">
                    I am available for the specified time slots and can attend regularly
                </label>
            </div>
        </div>
    `;
    
    // Update submit button
    const submitBtn = document.getElementById('applicationSubmitBtn');
    submitBtn.onclick = () => submitApplication(csp.id);
    
    modal.show();
}

function submitApplication(cspId) {
    const message = document.getElementById('applicationMessage').value;
    const commitmentCheck = document.getElementById('commitmentCheck').checked;
    const availabilityCheck = document.getElementById('availabilityCheck').checked;
    
    if (!message.trim()) {
        showNotification('Please provide a reason for applying', 'error');
        return;
    }
    
    if (!commitmentCheck) {
        showNotification('Please confirm your commitment to the CSP', 'error');
        return;
    }
    
    if (!availabilityCheck) {
        showNotification('Please confirm your availability', 'error');
        return;
    }
    
    // Submit application
    const csp = allCSPs.find(c => c.id === cspId);
    if (csp) {
        csp.availableSlots--;
        csp.applications++;
        
        showNotification('Application submitted successfully!', 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('applicationModal'));
        modal.hide();
        
        // Refresh display
        displayCSPs();
        updateMap();
    }
}

// Export functions for use in HTML
window.changePage = changePage;
window.toggleMap = toggleMap;
window.clearFilters = clearFilters;
window.viewCSPDetails = viewCSPDetails;
window.quickApply = quickApply;
