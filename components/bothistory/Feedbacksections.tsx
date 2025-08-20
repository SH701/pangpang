"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/UserContext";
import { useRouter } from "next/navigation";

type Feedback = {
  overallEvaluation: string;
  politenessScore: number;
  naturalnessScore: number;
};

export default function FeedbackSection({ id }: { id: number | string }) {
  const { accessToken } = useAuth();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) return;
    fetch(`/api/conversations/${id}/feedback`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setFeedback(data));
  }, [id, accessToken]);

  if (!feedback) return null;

  const viewfeedback = () => {
    router.push(`/main/custom/chatroom/${id}/result`);
  };

  const handleDeleteChat = async (conversationId: string | number) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete chat");
      }
    } catch (err) {
      console.error("Delete chat error:", err);
    }
  };

  return (
    <div className="px-5 py-3 bg-gray-50 space-y-3">
      <div className="bg-white p-4 border rounded-2xl border-[#E5E7EB]">
        <p className="text-sm text-gray-700">{feedback.overallEvaluation}</p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Politeness</span>
          <span>{feedback.politenessScore} %</span>
        </div>
        <div className="w-full h-2 bg-blue-100 rounded-full">
          <div
            className="h-full bg-blue-400 rounded-full"
            style={{ width: `${feedback.politenessScore}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm">
          <span>Naturalness</span>
          <span>{feedback.naturalnessScore} %</span>
        </div>
        <div className="w-full h-2 bg-blue-100 rounded-full">
          <div
            className="h-full bg-blue-400 rounded-full"
            style={{ width: `${feedback.naturalnessScore}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-[34px]">
        <button
          onClick={viewfeedback}
          className="px-4 min-w-[120px] h-9 text-white bg-blue-600 rounded-[8px] cursor-pointer"
        >
          <p className="text-xs">View Feedback</p>
        </button>
        <button
          onClick={() => handleDeleteChat(id)}
          className="px-4 min-w-[80px] h-9 text-white bg-gray-300 rounded-[8px] cursor-pointer"
        >
          <p className="text-xs"> Delete</p>
        </button>
      </div>
    </div>
  );
}
