'use client';

import { createContext, useContext } from 'react';
import type { Session } from 'next-auth';
import { SessionProvider, useSession } from 'next-auth/react';

// Type for context value
interface AuthContextType {
  session: Session | null;
  user: Session['user'] | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to consume context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// Hook to generate context value from `useSession`
export function useAuthValue(): AuthContextType {
  const { data: session, status } = useSession();
  const user = session?.user ?? null;

  return {
    session,
    user,
    status,
  };
}

// Internal component that uses the auth value
function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const authValue = useAuthValue();

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

// Main AuthProvider that wraps everything
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}

export default AuthContext;
