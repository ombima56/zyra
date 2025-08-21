"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  secretKey: string | null;
  setSecretKey: (key: string | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSetSecretKey = (key: string | null) => {
    setSecretKey(key);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ secretKey, setSecretKey: handleSetSecretKey, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};