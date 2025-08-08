'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/UserContext';

const LEVELS = [
  {
    value: 'BEGINNER',
    title: 'Beginner',
    description:
      "I know basic polite words, but I'm not sure when or how to use honorifics.",
  },
  {
    value: 'INTERMEDIATE',
    title: 'Intermediate',
    description:
      "I can use endings, but I'm not confident in using formal or respectful language correctly.",
  },
  {
    value: 'ADVANCED',
    title: 'Advanced',
    description:
      "I understand and use honorifics naturally depending on context or relationship.",
  },
] as const;

type Level = (typeof LEVELS)[number]['value'];

export default function LevelSelectPage() {
  const router = useRouter();
  const { accessToken, koreanLevel, setKoreanLevel } = useAuth();
  const [selected, setSelected] = useState<Level>(koreanLevel);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    if (selected === koreanLevel) {
      router.back();
      return;
    }
    setLoading(true);
    const res = await fetch('/api/users/me/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ koreanLevel: selected }),
    });
    if (res.ok) {
      setKoreanLevel(selected);
      router.back();
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.message || 'Level update failed');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-xl font-bold">Select your level</h1>
      <p className="text-sm text-gray-500">
        Feedback and suggestions will match your level.
      </p>

      <div className="space-y-4">
        {LEVELS.map(({ value, title, description }) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`w-full flex items-start space-x-4 p-4 border rounded-lg transition ${
              selected === value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div
              className={`mt-1 w-5 h-5 rounded-full border-2 ${
                selected === value ? 'border-blue-600 bg-blue-600' : 'border-gray-400'
              }`}
            />
            <div className="text-left">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        disabled={loading}
        onClick={save}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded disabled:opacity-50"
      >
        {loading ? 'Saving…' : 'Save Level'}
      </button>
    </div>
  );
}
