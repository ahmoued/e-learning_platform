import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'instructor' | 'student';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  enrolled: number;
  maxStudents: number;
  image?: string;
  pdfs?: PDF[];
}

export interface PDF {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  enrolledCourses: Course[];
  setEnrolledCourses: (courses: Course[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

// Mock data for demonstration
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the fundamentals of React including components, state, and props.',
    instructor: 'John Smith',
    enrolled: 24,
    maxStudents: 30,
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Deep dive into advanced JavaScript concepts and ES6+ features.',
    instructor: 'Sarah Johnson',
    enrolled: 18,
    maxStudents: 25,
  },
  {
    id: '3',
    title: 'Web Design Principles',
    description: 'Master the principles of modern web design and user experience.',
    instructor: 'Mike Davis',
    enrolled: 32,
    maxStudents: 40,
  },
  {
    id: '4',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js and Express.',
    instructor: 'John Smith',
    enrolled: 15,
    maxStudents: 20,
  },
];

const mockEnrolledCourses: Course[] = [mockCourses[0], mockCourses[2]];

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>(mockEnrolledCourses);

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      courses,
      setCourses,
      enrolledCourses,
      setEnrolledCourses,
    }}>
      {children}
    </AppContext.Provider>
  );
};