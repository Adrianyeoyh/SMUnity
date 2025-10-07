import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  studentId?: string;
  role: 'student' | 'csp_leader' | 'admin';
  skills?: string[];
  profilePicture?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  studentId: string;
  role: 'student' | 'csp_leader' | 'admin';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Demo login logic
      const demoUsers = {
        'student@smu.edu.sg': {
          id: '1',
          email: 'student@smu.edu.sg',
          firstName: 'John',
          lastName: 'Doe',
          studentId: '2024001234',
          role: 'student' as const,
          skills: ['Teaching', 'Communication'],
          createdAt: '2024-01-01'
        },
        'leader@smu.edu.sg': {
          id: '2',
          email: 'leader@smu.edu.sg',
          firstName: 'Jane',
          lastName: 'Smith',
          studentId: '2023005678',
          role: 'csp_leader' as const,
          skills: ['Leadership', 'Project Management'],
          createdAt: '2024-01-01'
        },
        'admin@smu.edu.sg': {
          id: '3',
          email: 'admin@smu.edu.sg',
          firstName: 'Admin',
          lastName: 'User',
          studentId: '2022009999',
          role: 'admin' as const,
          skills: ['Administration', 'Analytics'],
          createdAt: '2024-01-01'
        }
      };

      if (password === 'password' && demoUsers[email as keyof typeof demoUsers]) {
        const userData = demoUsers[email as keyof typeof demoUsers];
        const token = 'demo-token-' + userData.id;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
