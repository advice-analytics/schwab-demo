
'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/utilities/firebaseClient'; // Import Firebase auth service

// Define a type for user data
export interface UserData {
  uid: string | null;
}

// Create AuthContext with default values
const AuthContext = createContext<[UserData, React.Dispatch<React.SetStateAction<UserData>>]>([
  { uid: null },
  () => {}
]);

// AuthProvider component to wrap around your application
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({ uid: null });

  // Automatically sign in with predefined email and UID on component mount
  useEffect(() => {
    const signInUserAutomatically = async () => {
      try {
        // Sign in with predefined email and UID
        const predefinedEmail = 'askme@adviceanalytics.com';
        const predefinedUID = 'Dw33e1WBrVfeBr74eYi0qQKwvuz1';

        // Set user data with predefined UID
        setUserData({ uid: predefinedUID });
      } catch (error) {
        console.error('Error signing in automatically:', error);
      }
    };

    // Call the automatic sign-in function when component mounts
    signInUserAutomatically();

    // Cleanup function (unsubscribe) can be added here if needed
  }, []); // Empty dependency array means this effect runs only once on mount

  // Provide userData and setUserData through context provider
  return <AuthContext.Provider value={[userData, setUserData]}>{children}</AuthContext.Provider>;
};

// Custom hook to access userData and setUserData
export const useAuth = (): [UserData, React.Dispatch<React.SetStateAction<UserData>>] => useContext(AuthContext);
