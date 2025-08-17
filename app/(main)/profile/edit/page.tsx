'use client';

import { useRef, useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Face0 from '@/components/character/face0';
import Face1 from '@/components/character/face1';
import Face2 from '@/components/character/face2';
import Face3 from '@/components/character/face3';
import { useAuth } from '@/lib/UserContext';

type Profile = {
  email: string;
  nickname: string;
  koreanLevel: string;
  profileImageUrl: string; // either avatar id like 'face0' or a full URL
  interests: string[];
};

const FACES = [
  { Component: Face0, id: 'face0' },
  { Component: Face1, id: 'face1' },
  { Component: Face2, id: 'face2' },
  { Component: Face3, id: 'face3' },
];

export default function ProfileEditPage() {
  const router = useRouter();
  const { accessToken, selectedFace, setSelectedFace, profileImageUrl, setProfileImageUrl } =
    useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load original profile on mount
  useEffect(() => {
    if (!accessToken) return;
    fetch('/api/users/me', {
      method: 'GET',
      credentials: 'include',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
        return data as Profile;
      })
      .then(profile => {
        setOriginalProfile(profile);
        setNickname(profile.nickname);
        setProfileImageUrl(profile.profileImageUrl)
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      });
  }, [accessToken, setProfileImageUrl, setSelectedFace]);

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // 1) 로컬 미리보기
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      setProfileImageUrl(reader.result);
    }
  };
  reader.readAsDataURL(file);

  // 2) presign URL 요청
  const ext = file.name.split('.').pop()!;
  const presignRes = await fetch('/api/files/presigned-url', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fileType: file.type, fileExtension: ext,fileName: file.name }),
  })
  const { url: uploadUrl } = await presignRes.json();

  // 3) S3에 파일 PUT
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  console.log(uploadRes)
  if (!uploadRes.ok) throw new Error('S3 업로드 실패');


  const publicUrl = uploadUrl.split('?')[0];
  setProfileImageUrl(publicUrl);

  const apiRes = await fetch('/api/users/me/profile', {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ profileImageUrl: publicUrl }),
  });
  if (!apiRes.ok) {
    const err = await apiRes.json().catch(() => ({}));
    console.error('Update Failed:', err.message || apiRes.status);
  } else {
    console.log('Update Success.');
  }
};

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!originalProfile) return;
    setSubmitting(true);
    setError(null);

    const body: Partial<{ nickname: string; profileImageUrl: string }> = {};

    if (nickname && nickname !== originalProfile.nickname) {
      body.nickname = nickname;
    }
    // if user selected an SVG face
    if (selectedFace !== null) {
      const faceId = FACES[selectedFace].id;
      if (faceId !== originalProfile.profileImageUrl) {
        body.profileImageUrl = faceId;
      }
    } else if (
      profileImageUrl &&
      profileImageUrl !== originalProfile.profileImageUrl
    ) {
      body.profileImageUrl = profileImageUrl;
    }
    if (!Object.keys(body).length) {
      setSubmitting(false);
      return; // nothing changed
    }
    const res = await fetch('/api/users/me/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('업데이트 실패:', data.message);
      setError(data.message || 'Update failed');
      setSubmitting(false);
      return;
    }
    router.push('/profile');
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!originalProfile)
    return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto p-4 space-y-6 mt-15">
      {/* Back & Title */}
      <div className="relative py-4">
  <Link href="/profile" className="absolute left-4 top-1/2 transform -translate-y-1/2">
    <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
  </Link>
  <h2 className="text-lg font-semibold text-center">
    Edit Profile
  </h2>
</div>

      {/* Avatar */}
      <div className="flex justify-center">
        <div
          onClick={openFileDialog}
          className="w-32 h-32 rounded-full ring-2 ring-blue-500 p-2 bg-blue-100 flex items-center justify-center overflow-hidden cursor-pointer"
        >
          {profileImageUrl.startsWith('http') || profileImageUrl.startsWith('data:') ? (
            <Image
              src={profileImageUrl}
              alt="avatar"
              width={128}
              height={128}
              className="object-cover w-full h-full"
              unoptimized
            />
          ) : profileImageUrl ? (
            (() => {
              
             const C = FACES.find(f => f.id === profileImageUrl)?.Component;
return C ? <C className="w-full h-full" /> : <div className="w-full h-full bg-blue-100" />;
            })()
          ) : (
            <div className="w-full h-full bg-blue-100" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Nickname */}
      <div className="space-y-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Nickname"
            maxLength={15}
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {nickname && (
            <button
              type="button"
              onClick={() => setNickname('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-10">
          Nickname should be 15 characters or less
        </p>
      </div>
      <p className="text-center text-gray-600">Pick your favorite one!</p>
      <div className="flex justify-center space-x-4">
        {FACES.map(({ Component }, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setSelectedFace(idx);
              setProfileImageUrl(FACES[idx].id);
            }}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
              selectedFace === idx
                ? 'border-blue-500'
                : 'border-gray-200'
            } bg-gray-100`}
          >
            <Component className="w-8 h-8" />
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
      >
        {submitting ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}
