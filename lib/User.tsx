import { createContext, useContext, useState } from "react";

const AuthContext = createContext<{
  accessToken: string|null;
  setAccessToken: (t: string) => void;
}>({ accessToken: null, setAccessToken: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string|null>(null);
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);