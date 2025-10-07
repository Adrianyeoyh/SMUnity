// API Configuration and Mock Data
const API_BASE_URL = 'https://api.smunity.com'; // In production, this would be your actual API

// Mock data for development
const mockData = {
    users: [
        {
            id: 1,
            email: 'student@smu.edu.sg',
            password: 'password123',
            name: 'John Doe',
            role: 'student',
            studentId: 'SMU2024001',
            skills: ['Teaching', 'Event Planning', 'Public Speaking'],
            year: 'Year 2',
            major: 'Business',
            phone: '+65 9123 4567',
            profileImage: 'https://via.placeholder.com/150',
            createdAt: '2024-01-15T10:00:00Z'
        },
        {
            id: 2,
            email: 'leader@csp.org',
            password: 'password123',
            name: 'Jane Smith',
            role: 'csp_leader',
            organization: 'Community Service Organization',
            phone: '+65 9876 5432',
            profileImage: 'https://via.placeholder.com/150',
            createdAt: '2024-01-10T09:00:00Z'
        },
        {
            id: 3,
            email: 'admin@smunity.com',
            password: 'admin123',
            name: 'Admin User',
            role: 'admin',
            createdAt: '2024-01-01T00:00:00Z'
        }
    ],
    csps: [
        {
            id: 1,
            title: 'Teaching English to Underprivileged Children',
            description: 'Help teach English to children from low-income families. Volunteers will assist in conducting English classes and activities.',
            organization: 'Bright Future Foundation',
            location: 'Tampines Community Centre',
            address: '1 Tampines Walk, Singapore 528523',
            coordinates: [1.3496, 103.9568],
            startDate: '2024-02-15',
            endDate: '2024-05-15',
            timeSlots: [
                { day: 'Saturday', time: '09:00-12:00' },
                { day: 'Sunday', time: '14:00-17:00' }
            ],
            totalSlots: 20,
            availableSlots: 15,
            applications: 25,
            acceptanceRate: 60,
            requirements: ['Basic English proficiency', 'Patience with children', 'Teaching experience preferred'],
            skills: ['Teaching', 'Communication', 'Patience'],
            category: 'Education',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-01-20T10:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 2,
            title: 'Environmental Cleanup at East Coast Park',
            description: 'Join us for a beach cleanup initiative to keep our coastlines clean and protect marine life.',
            organization: 'Green Earth Society',
            location: 'East Coast Park',
            address: 'East Coast Park Service Road, Singapore 449876',
            coordinates: [1.3048, 103.8318],
            startDate: '2024-03-01',
            endDate: '2024-03-31',
            timeSlots: [
                { day: 'Saturday', time: '08:00-11:00' },
                { day: 'Sunday', time: '08:00-11:00' }
            ],
            totalSlots: 50,
            availableSlots: 35,
            applications: 40,
            acceptanceRate: 87.5,
            requirements: ['Physical fitness', 'Environmental awareness'],
            skills: ['Environmental', 'Teamwork', 'Physical Activity'],
            category: 'Environment',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-01-18T14:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 3,
            title: 'Senior Care and Companionship',
            description: 'Provide companionship and assistance to elderly residents at a local nursing home.',
            organization: 'Golden Years Care',
            location: 'Golden Years Nursing Home',
            address: '123 Orchard Road, Singapore 238863',
            coordinates: [1.3048, 103.8318],
            startDate: '2024-02-01',
            endDate: '2024-06-30',
            timeSlots: [
                { day: 'Weekdays', time: '10:00-12:00' },
                { day: 'Weekends', time: '14:00-16:00' }
            ],
            totalSlots: 30,
            availableSlots: 20,
            applications: 45,
            acceptanceRate: 44.4,
            requirements: ['Empathy', 'Good communication skills', 'Background check required'],
            skills: ['Caregiving', 'Communication', 'Empathy'],
            category: 'Healthcare',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-01-15T11:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 4,
            title: 'Food Bank Distribution Volunteer',
            description: 'Help distribute food packages to families in need at our community food bank.',
            organization: 'Singapore Food Bank',
            location: 'Food Bank Singapore',
            address: '39 Keppel Road, Singapore 089065',
            coordinates: [1.2709, 103.8078],
            startDate: '2024-02-10',
            endDate: '2024-05-10',
            timeSlots: [
                { day: 'Tuesday', time: '09:00-12:00' },
                { day: 'Thursday', time: '14:00-17:00' },
                { day: 'Saturday', time: '10:00-13:00' }
            ],
            totalSlots: 25,
            availableSlots: 18,
            applications: 30,
            acceptanceRate: 60,
            requirements: ['Physical ability to lift packages', 'Friendly demeanor', 'Reliability'],
            skills: ['Logistics', 'Communication', 'Teamwork'],
            category: 'Community Service',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-01-22T09:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 5,
            title: 'Animal Shelter Care Assistant',
            description: 'Care for rescued animals and help with daily operations at our animal shelter.',
            organization: 'Paws & Claws Shelter',
            location: 'Animal Shelter Singapore',
            address: '456 Jurong West Street 41, Singapore 640456',
            coordinates: [1.3521, 103.8198],
            startDate: '2024-03-01',
            endDate: '2024-08-31',
            timeSlots: [
                { day: 'Monday', time: '08:00-12:00' },
                { day: 'Wednesday', time: '14:00-18:00' },
                { day: 'Friday', time: '10:00-14:00' },
                { day: 'Sunday', time: '09:00-13:00' }
            ],
            totalSlots: 15,
            availableSlots: 8,
            applications: 35,
            acceptanceRate: 22.9,
            requirements: ['Love for animals', 'Physical fitness', 'No allergies to animals'],
            skills: ['Animal Care', 'Compassion', 'Physical Activity'],
            category: 'Animal Welfare',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-01-25T16:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 6,
            title: 'Digital Literacy Tutor for Seniors',
            description: 'Teach basic computer and smartphone skills to elderly community members.',
            organization: 'Tech for All Foundation',
            location: 'Community Center @ Toa Payoh',
            address: '93 Toa Payoh Central, Singapore 319194',
            coordinates: [1.3343, 103.8563],
            startDate: '2024-02-15',
            endDate: '2024-06-15',
            timeSlots: [
                { day: 'Tuesday', time: '10:00-12:00' },
                { day: 'Thursday', time: '10:00-12:00' },
                { day: 'Saturday', time: '14:00-16:00' }
            ],
            totalSlots: 12,
            availableSlots: 6,
            applications: 20,
            acceptanceRate: 30,
            requirements: ['Basic tech knowledge', 'Patience', 'Good communication skills'],
            skills: ['Teaching', 'Technology', 'Communication'],
            category: 'Education',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-01-28T13:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 7,
            title: 'Community Garden Maintenance',
            description: 'Help maintain and develop our community garden, including planting and harvesting.',
            organization: 'Green Thumbs Community',
            location: 'Bishan-Ang Mo Kio Park',
            address: 'Bishan Road, Singapore 579827',
            coordinates: [1.3506, 103.8480],
            startDate: '2024-02-20',
            endDate: '2024-07-20',
            timeSlots: [
                { day: 'Saturday', time: '08:00-11:00' },
                { day: 'Sunday', time: '08:00-11:00' }
            ],
            totalSlots: 20,
            availableSlots: 14,
            applications: 18,
            acceptanceRate: 77.8,
            requirements: ['Interest in gardening', 'Physical ability', 'Commitment to regular attendance'],
            skills: ['Gardening', 'Physical Activity', 'Sustainability'],
            category: 'Environment',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-01-30T10:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 8,
            title: 'Youth Mentorship Program',
            description: 'Mentor at-risk youth and help them develop life skills and academic success.',
            organization: 'Youth Development Center',
            location: 'Youth Center @ Clementi',
            address: '3155 Commonwealth Avenue West, Singapore 129588',
            coordinates: [1.3152, 103.7648],
            startDate: '2024-03-01',
            endDate: '2024-12-31',
            timeSlots: [
                { day: 'Tuesday', time: '16:00-18:00' },
                { day: 'Thursday', time: '16:00-18:00' },
                { day: 'Saturday', time: '10:00-12:00' }
            ],
            totalSlots: 10,
            availableSlots: 3,
            applications: 25,
            acceptanceRate: 12,
            requirements: ['Background check', 'Experience with youth', 'Commitment to long-term mentoring'],
            skills: ['Mentoring', 'Communication', 'Leadership'],
            category: 'Youth Development',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-02-01T14:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 9,
            title: 'Hospital Patient Support Volunteer',
            description: 'Provide emotional support and assistance to patients and their families in the hospital.',
            organization: 'Singapore General Hospital',
            location: 'Singapore General Hospital',
            address: 'Outram Road, Singapore 169608',
            coordinates: [1.2789, 103.8339],
            startDate: '2024-02-05',
            endDate: '2024-08-05',
            timeSlots: [
                { day: 'Monday', time: '09:00-12:00' },
                { day: 'Wednesday', time: '14:00-17:00' },
                { day: 'Friday', time: '09:00-12:00' }
            ],
            totalSlots: 18,
            availableSlots: 12,
            applications: 22,
            acceptanceRate: 54.5,
            requirements: ['Medical clearance', 'Empathy', 'Professional demeanor'],
            skills: ['Healthcare', 'Compassion', 'Communication'],
            category: 'Healthcare',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-02-02T11:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 10,
            title: 'Library Reading Program Assistant',
            description: 'Help organize and run reading programs for children at the public library.',
            organization: 'National Library Board',
            location: 'Central Public Library',
            address: '100 Victoria Street, Singapore 188064',
            coordinates: [1.2966, 103.8525],
            startDate: '2024-02-12',
            endDate: '2024-05-12',
            timeSlots: [
                { day: 'Saturday', time: '10:00-12:00' },
                { day: 'Sunday', time: '14:00-16:00' }
            ],
            totalSlots: 8,
            availableSlots: 5,
            applications: 15,
            acceptanceRate: 33.3,
            requirements: ['Love for reading', 'Experience with children', 'Creative thinking'],
            skills: ['Education', 'Creativity', 'Communication'],
            category: 'Education',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-02-05T15:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 11,
            title: 'Disaster Relief Preparation Volunteer',
            description: 'Help prepare emergency supplies and assist in disaster relief training programs.',
            organization: 'Singapore Red Cross',
            location: 'Red Cross House',
            address: '15 Penang Lane, Singapore 238486',
            coordinates: [1.3003, 103.8444],
            startDate: '2024-03-15',
            endDate: '2024-09-15',
            timeSlots: [
                { day: 'Saturday', time: '09:00-13:00' },
                { day: 'Sunday', time: '09:00-13:00' }
            ],
            totalSlots: 30,
            availableSlots: 22,
            applications: 28,
            acceptanceRate: 78.6,
            requirements: ['Physical fitness', 'Teamwork skills', 'Emergency response interest'],
            skills: ['Emergency Response', 'Logistics', 'Teamwork'],
            category: 'Emergency Services',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-02-08T12:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        },
        {
            id: 12,
            title: 'Special Needs Support Assistant',
            description: 'Provide support and assistance to individuals with special needs in recreational activities.',
            organization: 'Special Needs Society',
            location: 'Special Needs Center',
            address: '789 Bukit Timah Road, Singapore 269763',
            coordinates: [1.3329, 103.8076],
            startDate: '2024-02-18',
            endDate: '2024-07-18',
            timeSlots: [
                { day: 'Tuesday', time: '14:00-17:00' },
                { day: 'Thursday', time: '14:00-17:00' },
                { day: 'Saturday', time: '09:00-12:00' }
            ],
            totalSlots: 12,
            availableSlots: 7,
            applications: 18,
            acceptanceRate: 38.9,
            requirements: ['Patience', 'Special needs training preferred', 'Background check'],
            skills: ['Special Needs Care', 'Patience', 'Adaptability'],
            category: 'Special Needs',
            status: 'active',
            createdBy: 2,
            createdAt: '2024-02-10T16:00:00Z',
            image: 'https://via.placeholder.com/400x200'
        }
    ],
    applications: [
        {
            id: 1,
            cspId: 1,
            userId: 1,
            status: 'pending',
            appliedAt: '2024-01-25T10:00:00Z',
            message: 'I am passionate about teaching and have experience working with children.',
            hoursLogged: 0,
            timesheet: []
        },
        {
            id: 2,
            cspId: 2,
            userId: 1,
            status: 'approved',
            appliedAt: '2024-01-22T15:00:00Z',
            message: 'I love environmental causes and want to make a difference.',
            hoursLogged: 12,
            timesheet: [
                { date: '2024-02-03', hours: 3, activity: 'Beach cleanup' },
                { date: '2024-02-10', hours: 3, activity: 'Beach cleanup' },
                { date: '2024-02-17', hours: 3, activity: 'Beach cleanup' },
                { date: '2024-02-24', hours: 3, activity: 'Beach cleanup' }
            ]
        }
    ],
    organizations: [
        {
            id: 1,
            name: 'Bright Future Foundation',
            description: 'A non-profit organization focused on education and child development.',
            contact: 'contact@brightfuture.org',
            phone: '+65 6123 4567',
            address: '123 Education Street, Singapore 123456',
            website: 'https://brightfuture.org',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z'
        },
        {
            id: 2,
            name: 'Green Earth Society',
            description: 'Environmental conservation and sustainability organization.',
            contact: 'info@greenearth.sg',
            phone: '+65 6789 0123',
            address: '456 Green Avenue, Singapore 654321',
            website: 'https://greenearth.sg',
            status: 'active',
            createdAt: '2024-01-01T00:00:00Z'
        }
    ]
};

// Local storage keys
const STORAGE_KEYS = {
    USER: 'smunity_user',
    TOKEN: 'smunity_token',
    CSPS: 'smunity_csps',
    APPLICATIONS: 'smunity_applications'
};

// Initialize mock data in localStorage if not exists
function initializeMockData() {
    console.log('Initializing mock data...');
    
    if (!localStorage.getItem(STORAGE_KEYS.CSPS)) {
        localStorage.setItem(STORAGE_KEYS.CSPS, JSON.stringify(mockData.csps));
        console.log('CSPs initialized');
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(mockData.applications));
        console.log('Applications initialized');
    }
    if (!localStorage.getItem('smunity_users')) {
        localStorage.setItem('smunity_users', JSON.stringify(mockData.users));
        console.log('Users initialized:', mockData.users.length, 'users');
    }
    if (!localStorage.getItem('smunity_organizations')) {
        localStorage.setItem('smunity_organizations', JSON.stringify(mockData.organizations));
        console.log('Organizations initialized');
    }
    
    console.log('Mock data initialization complete');
}

// API Functions
class API {
    // Authentication
    static async login(email, password) {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const users = JSON.parse(localStorage.getItem('smunity_users') || '[]');
            console.log('Available users:', users.map(u => ({ email: u.email, role: u.role })));
            
            const user = users.find(u => u.email === email && u.password === password);
            console.log('Found user:', user ? { id: user.id, email: user.email, role: user.role } : 'null');
            
            if (user) {
                const token = btoa(JSON.stringify({ userId: user.id, email: user.email }));
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
                localStorage.setItem(STORAGE_KEYS.TOKEN, token);
                return { success: true, user, token };
            } else {
                return { success: false, message: 'Invalid email or password' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Login failed. Please try again.' };
        }
    }

    static async register(userData) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const users = JSON.parse(localStorage.getItem('smunity_users') || '[]');
            const existingUser = users.find(u => u.email === userData.email);
            
            if (existingUser) {
                return { success: false, message: 'User already exists' };
            }
            
            const newUser = {
                id: users.length + 1,
                ...userData,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('smunity_users', JSON.stringify(users));
            
            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, message: 'Registration failed. Please try again.' };
        }
    }

    static async logout() {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        return { success: true };
    }

    static getCurrentUser() {
        const user = localStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    }

    static isAuthenticated() {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    }

    // CSPs
    static async getCSPs(filters = {}) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let csps = JSON.parse(localStorage.getItem(STORAGE_KEYS.CSPS) || '[]');
            
            // Apply filters
            if (filters.category) {
                csps = csps.filter(csp => csp.category === filters.category);
            }
            if (filters.location) {
                csps = csps.filter(csp => 
                    csp.location.toLowerCase().includes(filters.location.toLowerCase())
                );
            }
            if (filters.skills && filters.skills.length > 0) {
                csps = csps.filter(csp => 
                    filters.skills.some(skill => csp.skills.includes(skill))
                );
            }
            if (filters.status) {
                csps = csps.filter(csp => csp.status === filters.status);
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                csps = csps.filter(csp => 
                    csp.title.toLowerCase().includes(searchTerm) ||
                    csp.description.toLowerCase().includes(searchTerm) ||
                    csp.organization.toLowerCase().includes(searchTerm)
                );
            }
            
            return { success: true, data: csps };
        } catch (error) {
            return { success: false, message: 'Failed to fetch CSPs' };
        }
    }

    static async getCSP(id) {
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const csps = JSON.parse(localStorage.getItem(STORAGE_KEYS.CSPS) || '[]');
            const csp = csps.find(c => c.id === parseInt(id));
            
            if (csp) {
                return { success: true, data: csp };
            } else {
                return { success: false, message: 'CSP not found' };
            }
        } catch (error) {
            return { success: false, message: 'Failed to fetch CSP' };
        }
    }

    static async createCSP(cspData) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const csps = JSON.parse(localStorage.getItem(STORAGE_KEYS.CSPS) || '[]');
            const newCSP = {
                id: csps.length + 1,
                ...cspData,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            csps.push(newCSP);
            localStorage.setItem(STORAGE_KEYS.CSPS, JSON.stringify(csps));
            
            return { success: true, data: newCSP };
        } catch (error) {
            return { success: false, message: 'Failed to create CSP' };
        }
    }

    static async updateCSP(id, cspData) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const csps = JSON.parse(localStorage.getItem(STORAGE_KEYS.CSPS) || '[]');
            const index = csps.findIndex(c => c.id === parseInt(id));
            
            if (index !== -1) {
                csps[index] = { ...csps[index], ...cspData };
                localStorage.setItem(STORAGE_KEYS.CSPS, JSON.stringify(csps));
                return { success: true, data: csps[index] };
            } else {
                return { success: false, message: 'CSP not found' };
            }
        } catch (error) {
            return { success: false, message: 'Failed to update CSP' };
        }
    }

    static async deleteCSP(id) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const csps = JSON.parse(localStorage.getItem(STORAGE_KEYS.CSPS) || '[]');
            const filteredCSPs = csps.filter(c => c.id !== parseInt(id));
            
            localStorage.setItem(STORAGE_KEYS.CSPS, JSON.stringify(filteredCSPs));
            return { success: true };
        } catch (error) {
            return { success: false, message: 'Failed to delete CSP' };
        }
    }

    // Applications
    static async getApplications(userId = null) {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            let applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
            
            if (userId) {
                applications = applications.filter(app => app.userId === parseInt(userId));
            }
            
            return { success: true, data: applications };
        } catch (error) {
            return { success: false, message: 'Failed to fetch applications' };
        }
    }

    static async applyForCSP(cspId, message) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = this.getCurrentUser();
            if (!user) {
                return { success: false, message: 'User not authenticated' };
            }
            
            const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
            
            // Check if user already applied
            const existingApplication = applications.find(app => 
                app.cspId === parseInt(cspId) && app.userId === user.id
            );
            
            if (existingApplication) {
                return { success: false, message: 'You have already applied for this CSP' };
            }
            
            const newApplication = {
                id: applications.length + 1,
                cspId: parseInt(cspId),
                userId: user.id,
                status: 'pending',
                appliedAt: new Date().toISOString(),
                message: message,
                hoursLogged: 0,
                timesheet: []
            };
            
            applications.push(newApplication);
            localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
            
            return { success: true, data: newApplication };
        } catch (error) {
            return { success: false, message: 'Failed to apply for CSP' };
        }
    }

    static async updateApplicationStatus(applicationId, status) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
            const index = applications.findIndex(app => app.id === parseInt(applicationId));
            
            if (index !== -1) {
                applications[index].status = status;
                localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
                return { success: true, data: applications[index] };
            } else {
                return { success: false, message: 'Application not found' };
            }
        } catch (error) {
            return { success: false, message: 'Failed to update application' };
        }
    }

    static async logHours(applicationId, date, hours, activity) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
            const index = applications.findIndex(app => app.id === parseInt(applicationId));
            
            if (index !== -1) {
                const timesheetEntry = { date, hours, activity };
                applications[index].timesheet.push(timesheetEntry);
                applications[index].hoursLogged += hours;
                
                localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
                return { success: true, data: applications[index] };
            } else {
                return { success: false, message: 'Application not found' };
            }
        } catch (error) {
            return { success: false, message: 'Failed to log hours' };
        }
    }

    // Statistics
    static async getStats() {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const csps = JSON.parse(localStorage.getItem(STORAGE_KEYS.CSPS) || '[]');
            const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
            const users = JSON.parse(localStorage.getItem('smunity_users') || '[]');
            const organizations = JSON.parse(localStorage.getItem('smunity_organizations') || '[]');
            
            const totalHours = applications.reduce((sum, app) => sum + app.hoursLogged, 0);
            
            return {
                success: true,
                data: {
                    totalCSPs: csps.length,
                    totalStudents: users.filter(u => u.role === 'student').length,
                    totalHours: totalHours,
                    totalOrganizations: organizations.length
                }
            };
        } catch (error) {
            return { success: false, message: 'Failed to fetch statistics' };
        }
    }

    // Organizations
    static async getOrganizations() {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const organizations = JSON.parse(localStorage.getItem('smunity_organizations') || '[]');
            return { success: true, data: organizations };
        } catch (error) {
            return { success: false, message: 'Failed to fetch organizations' };
        }
    }

    static async createOrganization(orgData) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const organizations = JSON.parse(localStorage.getItem('smunity_organizations') || '[]');
            const newOrg = {
                id: organizations.length + 1,
                ...orgData,
                status: 'active',
                createdAt: new Date().toISOString()
            };
            
            organizations.push(newOrg);
            localStorage.setItem('smunity_organizations', JSON.stringify(organizations));
            
            return { success: true, data: newOrg };
        } catch (error) {
            return { success: false, message: 'Failed to create organization' };
        }
    }

    // Users
    static async getUsers() {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const users = JSON.parse(localStorage.getItem('smunity_users') || '[]');
            return { success: true, data: users };
        } catch (error) {
            return { success: false, message: 'Failed to fetch users' };
        }
    }

    static async updateUser(id, userData) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const users = JSON.parse(localStorage.getItem('smunity_users') || '[]');
            const index = users.findIndex(u => u.id === parseInt(id));
            
            if (index !== -1) {
                users[index] = { ...users[index], ...userData };
                localStorage.setItem('smunity_users', JSON.stringify(users));
                
                // Update current user if it's the same user
                const currentUser = this.getCurrentUser();
                if (currentUser && currentUser.id === parseInt(id)) {
                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(users[index]));
                }
                
                return { success: true, data: users[index] };
            } else {
                return { success: false, message: 'User not found' };
            }
        } catch (error) {
            return { success: false, message: 'Failed to update user' };
        }
    }
}

// Initialize mock data when the script loads
console.log('API script loaded, initializing mock data...');
// Clear existing CSP data to force reinitialization
localStorage.removeItem('smunity_csps');
initializeMockData();

// Export for use in other files
window.API = API;
