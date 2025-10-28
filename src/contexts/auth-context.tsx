
// 'use client';

// import { type ReactNode, createContext, useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';

// export type UserRole = 'Super Admin' | 'School Admin' | 'Teacher' | 'Student';
// export interface User {
//   name: string;
//   role: UserRole;
//   profilePic: string;
//   mobile: string;
//   class?: string;
//   section?: string;
//   id: string;
//   gender?: 'male' | 'female';
// }

// interface AuthContextType {
//   user: User | null;
//   login: (user: User) => void;
//   logout: () => void;
//   isLoading: boolean;
// }

// export const AuthContext = createContext<AuthContextType | null>(null);

// // This is a mock of a real user database
// const mockUsers = [
//   {
//     id: 'usr_5e88488a7558f62f3e36f4d7',
//     name: 'Aarav Sharma',
//     email: 'aarav@example.com',
//     mobile: '+91-9876543210',
//     role: 'Teacher',
//     school: 'Greenwood High',
//     schoolId: 'JSN-123',
//     class: '10',
//     section: 'A',
//     experience: '5 years',
//     status: 'Active',
//     expiresOn: '2025-06-30',
//     avatar: 'https://picsum.photos/100/100?q=11',
//   },
//   {
//     id: 'usr_5e88488a7558f62f3e36f4d8',
//     name: 'Diya Patel',
//     email: 'diya@example.com',
//     mobile: '+91-9876543211',
//     role: 'Student',
//     school: 'Oakridge International',
//     schoolId: 'JSN-456',
//     class: '9',
//     section: 'B',
//     status: 'Active',
//     expiresOn: '2026-03-15',
//     avatar: 'https://picsum.photos/100/100?q=12',
//   },
//   {
//     id: 'usr_5e88488a7558f62f3e36f4d9',
//     name: 'Rohan Gupta',
//     email: 'rohan@example.com',
//     mobile: '+91-9876543212',
//     role: 'School Admin',
//     school: 'Northwood Academy',
//     schoolId: 'JSN-789',
//     status: 'Inactive',
//     expiresOn: 'N/A',
//     avatar: 'https://picsum.photos/100/100?q=13',
//   },
//   {
//     id: 'usr_5e88488a7558f62f3e36f4da',
//     name: 'Priya Singh',
//     email: 'priya@example.com',
//     mobile: '+91-9876543213',
//     role: 'Teacher',
//     school: 'Sunflower Prep',
//     schoolId: 'JSN-101',
//     class: '12',
//     section: 'C',
//     experience: '8 years',
//     status: 'Active',
//     expiresOn: '2024-11-20',
//     avatar: 'https://picsum.photos/100/100?q=14',
//   },
//   {
//     id: 'usr_5e88488a7558f62f3e36f4db',
//     name: 'Arjun Kumar',
//     email: 'arjun@example.com',
//     mobile: '+91-9876543214',
//     role: 'Student',
//     school: 'Riverdale Public School',
//     schoolId: 'JSN-212',
//     class: '8',
//     section: 'A',
//     status: 'Active',
//     expiresOn: '2025-09-01',
//     avatar: 'https://picsum.photos/100/100?q=15',
//   },
//   {
//     id: 'usr_5e88488a7558f62f3e36f4dc',
//     name: 'Sneha Reddy',
//     email: 'sneha@example.com',
//     mobile: '+91-9876543215',
//     role: 'Teacher',
//     school: 'Greenwood High',
//     schoolId: 'JSN-123',
//     class: '11',
//     section: 'B',
//     experience: '3 years',
//     status: 'Active',
//     expiresOn: '2025-06-30',
//     avatar: 'https://picsum.photos/100/100?q=16',
//   },
//   {
//     id: '4444444444',
//     name: 'Bobby Tables',
//     email: 'bobby@example.com',
//     mobile: '+91-4444444444',
//     role: 'Student',
//     school: 'Greenwood High',
//     schoolId: 'JSN-123',
//     class: '10',
//     section: 'B',
//     status: 'Active',
//     expiresOn: '2025-06-30',
//     avatar: 'https://picsum.photos/100/100?q=17',
//   },
// ];

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem('educentral-user');
//       if (storedUser) {
//         const userData = JSON.parse(storedUser);
//         let fullUserData = { ...userData };
//         if (userData.role === 'Student') {
//             const studentData = mockUsers.find(u => u.id === userData.id);
//             if (studentData) {
//                 fullUserData = { ...fullUserData, class: studentData.class, section: studentData.section };
//             }
//         }
//         setUser(fullUserData);
//       }
//     } catch (error) {
//       console.error('Failed to parse user from localStorage', error);
//       localStorage.removeItem('educentral-user');
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const login = useCallback((userData: User) => {
//     let fullUserData = { ...userData };
//     if (userData.role === 'Student') {
//       const studentData = mockUsers.find(u => u.id === userData.id);
//       if (studentData) {
//         fullUserData = { ...fullUserData, class: studentData.class, section: studentData.section };
//       }
//     }
//     setUser(fullUserData);
//     localStorage.setItem('educentral-user', JSON.stringify(fullUserData));
//     router.push('/homepage');
//   }, [router]);

//   const logout = useCallback(() => {
//     setUser(null);
//     localStorage.removeItem('educentral-user');
//     router.push('/login');
//   }, [router]);

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


'use client';
import { createContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { USER_STORAGE_KEY } from '@/lib/utils/constants';
//import type {  User } from '@/types/loginresponse';
import type { User as LoginUser } from '@/types/loginresponse';

 //export type UserRole = 'tenantadmin' | 'schooladmin' | 'teacher' | 'student';
export type User = LoginUser;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) setUser(JSON.parse(storedUser));
    setIsLoading(false);
  }, []);

  const login = useCallback((userData: User) => {

    setUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
            console.log('✅ Login called with:', userData);

    router.push('/homepage');
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
