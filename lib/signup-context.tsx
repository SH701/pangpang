'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SignupState {
  email: string;
  password: string;
  nickname: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setNickname: (v: string) => void;
  setGender: (v: 'MALE' | 'FEMALE') => void;
  setBirthDate: (v: string) => void;
}

const SignupContext = createContext<SignupState | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [birthDate, setBirthDate] = useState('');
  return (
    <SignupContext.Provider
      value={{
        email, password, nickname, gender, birthDate,
        setEmail, setPassword, setNickname, setGender, setBirthDate,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignup must be inside SignupProvider');
  return ctx;
}
