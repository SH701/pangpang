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
    if (typeof window !== 'undefined') {
      console.log('[UserContext] 초기화: localStorage에서 토큰 확인');
      const saved = localStorage.getItem('accessToken');
      
      if (saved) {
        console.log('[UserContext] localStorage에서 토큰 발견:', saved.substring(0, 10) + '...');
        _setAccessToken(saved);
        
        // 쿠키에도 저장 (API 요청에서 사용)
        const cookieValue = `accessToken=${encodeURIComponent(saved)}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = cookieValue;
        console.log('[UserContext] 초기화 시 쿠키에도 토큰 설정 완료');
      } else {
        console.log('[UserContext] localStorage에 토큰이 없음');
      }
    }
  }, []);

  const setAccessToken = (token: string | null) => {
    if (token) {
      console.log('[UserContext] 토큰 설정:', token.substring(0, 10) + '...');
      localStorage.setItem('accessToken', token);
      
      // 쿠키에도 저장 (API 요청에서 사용)
      const cookieValue = `accessToken=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = cookieValue;
      console.log('[UserContext] 쿠키 설정 완료');
      
      _setAccessToken(token);
    } else {
      console.log('[UserContext] 토큰 제거');
      localStorage.removeItem('accessToken');
      
      // 쿠키도 삭제
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
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
