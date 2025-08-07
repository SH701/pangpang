/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/UserContext';
import Face0 from '../character/select/face0';
import Face1 from '../character/select/face1';
import Face2 from '../character/select/face2';
import Face3 from '../character/select/face3';

const FACES = [
  { Component: Face0, avatarId: 'face0' },
  { Component: Face1, avatarId: 'face1' },
  { Component: Face2, avatarId: 'face2' },
  { Component: Face3, avatarId: 'face3' },
];

export default function ProfileChange() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { accessToken } = useAuth();
  const {
    selectedFace,
    setSelectedFace,
    profileImageUrl,
    setProfileImageUrl,
  } = useAuth();

  // SVG avatar 선택: 로컬 상태만 변경
  const handleFaceSelect = (avatarId: string, idx: number) => {
    setSelectedFace(idx);
    setProfileImageUrl(avatarId);
  };

  // 원형 클릭 → 파일 선택창 열기
  const handleCircleClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 → presign + S3 업로드 후 로컬 상태만 변경
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 1) 파일 확장자 추출
  const ext = file.name.split('.').pop() || '';
  
  try {
    // 2) 프록시 업로드: Next.js 서버 → S3
    const uploadRes = await fetch(`/api/files/upload?ext=${ext}`, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'Authorization': `Bearer ${accessToken}`, // JWT 검사 필요 없으면 제거 가능
      },
      body: file,
    });
    if (!uploadRes.ok) {
      const text = await uploadRes.text();
      throw new Error(`Upload failed: ${uploadRes.status} ${text}`);
    }

    // 3) 응답에서 public URL 꺼내서 상태 업데이트
    const { url: publicUrl } = await uploadRes.json();
    setProfileImageUrl(publicUrl);
  } catch (err: any) {
    console.error('File upload error', err);
  }
};

  return (
    <div className="px-4 pt-8 flex flex-col items-center w-full">
      <h2 className="text-xl font-semibold mb-4">프로필 사진 설정</h2>

      {/* 업로드 / SVG 선택 원형 */}
      <div
        onClick={handleCircleClick}
        className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer mb-6"
      >
        {selectedFace !== null ? (
          // SVG 컴포넌트 렌더
          React.createElement(FACES[selectedFace].Component, { className: 'w-full h-full' })
        ) : profileImageUrl ? (
          // 업로드된 이미지 미리보기
          <Image
            src={profileImageUrl}
            alt="avatar"
            width={128}
            height={128}
            className="object-cover"
          />
        ) : (
          <span className="text-gray-400">Click to upload</span>
        )}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* SVG 선택 버튼 그리드 */}
      <div className="grid grid-cols-4 gap-4">
        {FACES.map(({ Component, avatarId }, idx) => (
          <button
            key={idx}
            onClick={() => handleFaceSelect(avatarId, idx)}
            className={`w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center transition ${
              selectedFace === idx
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 bg-white'
            }`}
          >
            <Component className="w-full h-full" />
          </button>
        ))}
      </div>
    </div>
  );
}
