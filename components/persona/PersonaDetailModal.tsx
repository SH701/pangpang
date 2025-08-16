// components/persona/PersonaDetailModal.tsx
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
  role?: string;             // Boss 등
  description?: string;      // Situation 등
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
  onDeleted:(id:number|string)=>void
}) {
  const { accessToken } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<PersonaDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting,setDeleting] = useState(false)

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
        aiPersona: {
          id: data.id,
          name: data.name,
          gender: data.gender,
          age: data.age,
          role: data.role,
          description: data.description,
          profileImageUrl: data.profileImageUrl,
        },
      }),
    });

    if (!res.ok) throw new Error("Failed to create conversation");
    const json = await res.json();

    // 응답에 conversationId가 있다고 가정
    router.push(`/main/custom/chatroom/${json.conversationId}`);
  } catch (err) {
    console.error("StartChat error:", err);
  }
};
  return (
    <Modal open={open} onClose={onClose}>
      {/* 헤더 */}
      <div className="p-5 border-b flex items-center gap-3">
        {data?.profileImageUrl ? (
          <Image
            src={normalizeSrc(data.profileImageUrl)}
            alt={data?.name ?? 'AI'}
            width={56}
            height={56}
            className="rounded-full object-cover bg-gray-200"
            unoptimized
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gray-200" />
        )}
        <div className="min-w-0">
          <div className="font-semibold text-lg truncate">{data?.name ?? '...'}</div>
           <div className="font-semibold text-gray-500 text-sm truncate">{data?.role ?? '...'}</div>
        </div>
        <button
          className="ml-auto text-sm px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* 바디 */}
      <div className="p-5 space-y-3">
        {loading ? (
          <div className="text-sm text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{data?.name ?? '-'}</span>

              <span className="text-gray-500">Gender</span>
              <span className="font-medium">{data?.gender ?? '-'}</span>

              <span className="text-gray-500">Age</span>
              <span className="font-medium">{data?.age ?? '-'}</span>

              <span className="text-gray-500">AI’s role</span>
              <span className="font-medium">{data?.role ?? '-'}</span>
            </div>
          </>
        )}
      </div>

      {/* 푸터 */}
      <div className="p-5 border-t flex items-center gap-3">
        <button onClick={handleStartChat} className="flex-1 h-11 rounded-xl bg-blue-600 text-white font-medium">
          Start New chatting
        </button>
        <button onClick={handleDelete} className="h-11 px-4 rounded-xl bg-gray-100 text-gray-700">
          Delete
        </button>
      </div>
    </Modal>
  );
}
