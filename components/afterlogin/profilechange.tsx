/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/UserContext';

// ✅ 로컬 아바타는 public/characters/* 에 넣고 경로 문자열로 관리
const FACES: string[] = [
  '/characters/character1.png',
  '/characters/character2.png',
  '/characters/character3.png',
  '/characters/character4.png',
];

export default function ProfileChange() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ useAuth 한 번만 호출해서 필요한 값 모두 구조분해
  const {
    accessToken,
    selectedFace,                 // number | null
    setSelectedFace,              // (v: number | null) => void
    profileImageUrl,              // string
    setProfileImageUrl,           // (v: string) => void
  } = useAuth();
  const handleFaceSelect = (idx: number) => {
    setSelectedFace(idx);
    setProfileImageUrl(FACES[idx]); // 로컬 파일 경로 자체를 avatarId로 사용
  };

  const handleCircleClick = () => {
    fileInputRef.current?.click();
  };
  useEffect(() => {
    if (profileImageUrl && !profileImageUrl.startsWith('http')) {
      const idx = FACES.findIndex((p) => p === profileImageUrl);
      setSelectedFace(idx !== -1 ? idx : null);
    } else {
      setSelectedFace(null); // 외부 URL(업로드 이미지)이면 선택 해제
    }
  }, [profileImageUrl]);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop() || '';

    try {
      const presignRes = await fetch('/api/files/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fileType: file.type,
          fileExtension: ext,
        }),
      });

      if (!presignRes.ok) {
        const text = await presignRes.text();
        throw new Error(`Presign failed: ${presignRes.status} ${text}`);
      }

      const { url: uploadUrl } = await presignRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(`Upload failed: ${uploadRes.status} ${text}`);
      }

      const publicUrl = uploadUrl.split('?')[0];
      setProfileImageUrl(publicUrl);
      setSelectedFace(null); // 외부 URL로 전환되었으니 선택 해제
    } catch (err: any) {
      console.error('File upload error', err);
    } finally {
      // input 재선택 가능하도록 value 비우기
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="px-4 pt-8 flex flex-col items-center w-full">
      <h2 className="text-xl font-semibold mb-4">Please select a profile</h2>

      <div
        onClick={handleCircleClick}
        className="rounded-full bg-gray-100 border-2 border-blue-500 overflow-hidden flex items-center justify-center cursor-pointer mb-6"
        style={{
          width: '152px',
          height: '152px',
          flexShrink: 0
        }}
        aria-label="프로필 이미지 업로드"
      >
        {selectedFace !== null ? (
          <Image
            src={FACES[selectedFace]}
            alt="avatar"
            width={152}
            height={152}
            className="object-cover"
            priority
          />
        ) : profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt="avatar"
            width={152}
            height={152}
            className="object-cover"
            priority
          />
        ) : (
          <span className="text-gray-400 text-center">Click to upload</span>
        )}
      </div>
      
      <p 
        className="text-center font-pretendard"
        style={{
          color: '#374151',
          fontSize: '13px',
          fontWeight: 500,
          lineHeight: '140%',
          paddingTop: '56px'
        }}
      >
        Pick your favorite one!
      </p>

      {/* ✅ 파일 업로드 인풋 */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ✅ 로컬 아바타 그리드 */}
      <div className="grid grid-cols-4 gap-4 mt-4">
        {FACES.map((src, idx) => (
          <button
            key={src}
            onClick={() => handleFaceSelect(idx)}
            className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 transition ${
              selectedFace === idx ? 'border-blue-600' : 'border-gray-300'
            }`}
            aria-label={`choose avatar ${idx + 1}`}
          >
            <Image
              src={src}
              alt={`avatar-${idx + 1}`}
              width={48}
              height={48}
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}