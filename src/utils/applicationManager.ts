export interface Application {
  id: string;
  cspId: string;
  cspTitle: string;
  organization: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
  responseDate?: string;
  skills?: string[];
}

const STORAGE_KEY = 'smunity_applications';

export const getApplications = (): Application[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Initialize with demo applications if none exist
      const demoApplications: Application[] = [
        {
          id: '1',
          cspId: '1',
          cspTitle: 'Tutoring Underprivileged Children',
          organization: 'Children\'s Society Singapore',
          status: 'accepted',
          appliedAt: '2024-01-20T10:00:00Z',
          message: 'Thank you for your interest! We are pleased to inform you that your application has been accepted. Please report to Toa Payoh Community Centre on February 15th at 9:00 AM.',
          responseDate: '2024-01-25T14:30:00Z',
          skills: ['Teaching', 'Mentoring', 'Communication', 'Patience']
        },
        {
          id: '2',
          cspId: '2',
          cspTitle: 'Beach Cleanup at East Coast',
          organization: 'Green Earth Society',
          status: 'pending',
          appliedAt: '2024-01-28T15:45:00Z',
          skills: ['Teamwork', 'Environmental Awareness', 'Physical Activity']
        },
        {
          id: '3',
          cspId: '3',
          cspTitle: 'Senior Care Home Visits',
          organization: 'Singapore Red Cross',
          status: 'rejected',
          appliedAt: '2024-01-15T09:20:00Z',
          message: 'Thank you for your application. Unfortunately, we have already filled all available positions for this project. We encourage you to apply for other opportunities.',
          responseDate: '2024-01-22T11:15:00Z',
          skills: ['Empathy', 'Communication', 'Elderly Care']
        },
        {
          id: '4',
          cspId: '4',
          cspTitle: 'Animal Shelter Assistance',
          organization: 'Paws & Claws Rescue',
          status: 'accepted',
          appliedAt: '2024-01-10T14:30:00Z',
          message: 'Congratulations! Your application has been accepted. Please come to Pasir Ris Farmway on February 10th at 8:00 AM. Bring comfortable clothes and closed-toe shoes.',
          responseDate: '2024-01-18T16:45:00Z',
          skills: ['Animal Care', 'Responsibility', 'Physical Labour', 'Compassion']
        },
        {
          id: '5',
          cspId: '5',
          cspTitle: 'Community Garden Project',
          organization: 'Gardens for All',
          status: 'pending',
          appliedAt: '2024-02-01T11:20:00Z',
          skills: ['Gardening', 'Sustainability', 'Teamwork', 'Physical Activity']
        },
        {
          id: '6',
          cspId: '6',
          cspTitle: 'Digital Literacy for Seniors',
          organization: 'Tech for Good',
          status: 'rejected',
          appliedAt: '2024-01-25T13:15:00Z',
          message: 'Thank you for applying. We received many qualified applications and unfortunately cannot accommodate everyone. Please consider applying for future programs.',
          responseDate: '2024-01-30T10:30:00Z',
          skills: ['Technology', 'Teaching', 'Communication', 'Patience']
        },
        {
          id: '7',
          cspId: '7',
          cspTitle: 'Food Bank Distribution',
          organization: 'Feeding Singapore',
          status: 'accepted',
          appliedAt: '2024-01-12T09:45:00Z',
          message: 'Great news! Your application has been accepted. Join us at the Food Bank warehouse on February 20th at 7:00 AM. We\'ll provide all necessary equipment.',
          responseDate: '2024-01-20T12:00:00Z',
          skills: ['Logistics', 'Teamwork', 'Physical Labour', 'Organization']
        },
        {
          id: '8',
          cspId: '8',
          cspTitle: 'Youth Mentorship Program',
          organization: 'Future Leaders Foundation',
          status: 'pending',
          appliedAt: '2024-02-03T16:00:00Z',
          skills: ['Mentoring', 'Leadership', 'Communication', 'Youth Development']
        }
      ];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoApplications));
      return demoApplications;
    }
  } catch (error) {
    console.error('Error loading applications:', error);
    return [];
  }
};

export const addApplication = (application: Omit<Application, 'id' | 'appliedAt'>): Application => {
  const applications = getApplications();
  const newApplication: Application = {
    ...application,
    id: Date.now().toString(),
    appliedAt: new Date().toISOString(),
  };
  
  const updatedApplications = [...applications, newApplication];
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApplications));
    return newApplication;
  } catch (error) {
    console.error('Error saving application:', error);
    throw error;
  }
};

export const updateApplicationStatus = (applicationId: string, status: 'pending' | 'accepted' | 'rejected', message?: string): Application | null => {
  const applications = getApplications();
  const updatedApplications = applications.map(app => {
    if (app.id === applicationId) {
      return {
        ...app,
        status,
        message,
        responseDate: new Date().toISOString(),
      };
    }
    return app;
  });
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApplications));
    return updatedApplications.find(app => app.id === applicationId) || null;
  } catch (error) {
    console.error('Error updating application:', error);
    return null;
  }
};

export const getUserApplications = (userId: string): Application[] => {
  return getApplications().filter(app => app.cspId); // For now, we'll show all applications
};

export const getRecentApplications = (limit: number = 5): Application[] => {
  return getApplications()
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, limit);
};

export const resetApplications = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Trigger a reload of applications
    getApplications();
  } catch (error) {
    console.error('Error resetting applications:', error);
  }
};
