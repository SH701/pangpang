/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/UserContext';
import Face0 from '../character/face0';
import Face1 from '../character/face1';
import Face2 from '../character/face2';
import Face3 from '../character/face3';

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

  const handleFaceSelect = (avatarId: string, idx: number) => {
    setSelectedFace(idx);
    setProfileImageUrl(avatarId);
  };

  const handleCircleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 확장자
    const ext = file.name.split('.').pop() || '';

    try {
      // 1) presigned-url 요청
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
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        const text = await uploadRes.text();
        throw new Error(`Upload failed: ${uploadRes.status} ${text}`);
      }

      // 3) public URL 얻기 (쿼리스트링 제거)
      const publicUrl = uploadUrl.split('?')[0];
      setProfileImageUrl(publicUrl);
    } catch (err: any) {
      console.error('File upload error', err);
    }
  };

  return (
    <div className="px-4 pt-8 flex flex-col items-center w-full">
      <h2 className="text-xl font-semibold mb-4">프로필 사진 설정</h2>

      <div
        onClick={handleCircleClick}
        className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer mb-6"
      >
        {selectedFace !== null ? (
          React.createElement(FACES[selectedFace].Component, { className: 'w-full h-full' })
        ) : profileImageUrl ? (
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

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-4 gap-4">
        {FACES.map(({ Component, avatarId }, idx) => (
          <button
            key={idx}
            onClick={() => handleFaceSelect(avatarId, idx)}
            className={`w-12 h-12 overflow-hidden flex items-center justify-center transition ${
              selectedFace === idx
                ? 'border-blue-600 '
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
