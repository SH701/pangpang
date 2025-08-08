'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type Interest = string;

interface UserContextType {
  // 기존 상태
  koreanLevel: Level;
  selectedFace: number | null;
  profileImageUrl: string;
  interests: Interest[];
  // 토큰 관련 상태 추가
  accessToken: string | null;
  setKoreanLevel: (v: Level) => void;
   setSelectedFace: (i: number | null) => void;
  setProfileImageUrl: (v: string) => void;
  setInterests: (v: Interest[]) => void;
  setAccessToken: (token: string | null) => void;
};

const UserContext = createContext<UserContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [koreanLevel, setKoreanLevel] = useState<Level>('BEGINNER');
  const [selectedFace, setSelectedFace] = useState<number | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const [interests, setInterests] = useState<Interest[]>([]);

  // 토큰 상태
  const [accessToken, _setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('accessToken');
    if (saved) _setAccessToken(saved);
  }, []);

  const setAccessToken = (token: string | null) => {
    if (token) {
      localStorage.setItem('accessToken', token);
      _setAccessToken(token);
    } else {
      localStorage.removeItem('accessToken');
      _setAccessToken(null);
    }
  };

  return (
    <UserContext.Provider
      value={{
        koreanLevel,
        setKoreanLevel,
        selectedFace,
        setSelectedFace,
        profileImageUrl,
        setProfileImageUrl,
        interests,
        setInterests,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
