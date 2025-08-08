import { ReactNode } from 'react';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full">
      {/* 공통 헤더나 네비가 있으면 여기 */}
      {children}  {/* ← 이 줄이 꼭 있어야 /profile/edit 페이지가 보입니다 */}
    </div>
  );
}
