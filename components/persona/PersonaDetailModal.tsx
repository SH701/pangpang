/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/persona/modal';
import { useAuth } from '@/lib/UserContext';
import { useRouter } from 'next/navigation';

type PersonaDetail = {
  id: number | string;
  name: string;
  gender?: string;
  age?: number;
  role?: string; // Boss 등
  description?: string; // Situation 등
  profileImageUrl?: string;
};

const normalizeSrc = (src?: string) =>
  !src ? '' : src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;

export default function PersonaDetailModal({
  open,
  onClose,
  personaId,
  onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  personaId: number | string | null;
  onDeleted: (id: number | string) => void;
}) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<PersonaDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);


  // 상세 조회 API: GET /api/personas/{personaId}
  useEffect(() => {
    if (!open || !personaId || !accessToken) return;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/personas/${personaId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        });
        const json = await res.json();
        console.log("persona json:", json);
        setData({
          id: json.id ?? personaId,
          name: json.name ?? 'Unknown',
          gender: json.gender,
          age: json.age,
          role: json.role ?? json.aiRole,
          description: json.description,
          profileImageUrl: json.profileImageUrl,
        });
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [open, personaId, accessToken]);

  // 삭제 핸들러
  const handleDelete = async () => {
    if (!personaId || !accessToken) return;
    if (!confirm('Delete This AI?.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/personas/${personaId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      });
      if (!res.ok) {
        return;
      }
      onDeleted?.(personaId);
      onClose();
      router.refresh();
    } catch (e) {
      onDeleted?.(personaId);
      onClose?.();
      router.refresh();
    } finally {
      setDeleting(false);
    }
  };



  // 새로운 채팅
  const handleStartChat = async () => {
    if (!accessToken || !data) return;
    try {
      const res = await fetch(`/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          personaId: data.id,
          situation: data.description, // sitdata에서 상황을 전달
        }),
      });

      if (!res.ok) throw new Error("Failed to create conversation");
      const json = await res.json();

      const conversationId =
        json.conversationId ?? json.id ?? json.conversation?.id;

      if (!conversationId) throw new Error("No conversationId in response");

      router.push(`/main/custom/chatroom/${conversationId}`);
    } catch (err) {
      console.error("StartChat error:", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* 헤더 */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {data?.profileImageUrl ? (
            <Image
              src={normalizeSrc(data.profileImageUrl)}
              alt={data?.name ?? 'AI'}
              width={64}
              height={64}
              className="rounded-full object-cover bg-gray-200"
              unoptimized
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-lg">
                {data?.name?.charAt(0) ?? '?'}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-xl text-gray-900 font-pretendard mb-1">
              {data?.name ?? '...'}
            </h2>
            <p className="text-gray-600 text-sm font-medium">
              {data?.role ?? 'AI Assistant'}
            </p>
          </div>
          <button
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 바디 */}
      <div className="px-6 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 프로필 정보 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 font-pretendard">Profile Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Name</span>
                  <span className="font-medium text-gray-900">{data?.name ?? '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Gender</span>
                  <span className="font-medium text-gray-900">{data?.gender ?? '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Age</span>
                  <span className="font-medium text-gray-900">{data?.age ?? '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">AI's Role</span>
                  <span className="font-medium text-gray-900">{data?.role ?? '-'}</span>
                </div>
              </div>
            </div>

            {/* 설명 */}
            {data?.description && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2 font-pretendard">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 rounded-lg p-3">
                  {data.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-3">
          <button 
            onClick={handleStartChat} 
            className="flex-1 h-12 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors font-pretendard"
          >
            Start New Chat
          </button>
          <button 
            onClick={handleDelete} 
            className="h-12 px-6 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors font-pretendard"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
