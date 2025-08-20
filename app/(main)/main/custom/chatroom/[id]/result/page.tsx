/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/UserContext";
import Score from "@/components/main/result/score";
import Transcript from "@/components/main/result/transscript";
import Section from "@/components/main/result/section";
import { Feedback } from "@/lib/types";

// 👉 메시지 타입
type ChatMsg = {
  messageId: number;
  role: "USER" | "AI";
  content: string;
  createdAt: string;
};

// 👉 role 정규화 함수 (백엔드 type → 프론트 role)
function normalizeRole(role: string): "USER" | "AI" {
  const upper = role.toUpperCase();
  return upper === "USER" ? "USER" : "AI";
}

export default function Result() {
  const [tab, setTab] = useState<"transcript" | "mistakes">("transcript");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [aiName, setAiName] = useState("AI"); // 👈 aiPersona 이름 저장

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.id as string | undefined;

  // 📌 대화 로그 불러오기
  useEffect(() => {
    if (!conversationId || !accessToken) return;
    (async () => {
      try {
        const res = await fetch(
          `/api/messages?conversationId=${conversationId}&page=1&size=1000`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
          }
        );
        if (!res.ok) {
          setError(`대화 정보를 불러올 수 없습니다: ${res.status}`);
          return;
        }

        const data = await res.json();
        const mapped: ChatMsg[] = data.content.map((m: any) => ({
          messageId: m.messageId,
          role: normalizeRole(m.type),
          content: m.content,
          createdAt: m.createdAt,
        }));
        setMessages(mapped);
      } catch (err) {
        setError("네트워크 오류");
      }
    })();
  }, [conversationId, accessToken]);

  // 📌 aiPersona 정보 불러오기
  useEffect(() => {
    if (!conversationId || !accessToken) return;
    (async () => {
      try {
        const res = await fetch(`/api/conversations/${conversationId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        setAiName(data.aiPersona?.name || "AI");
      } catch (err) {
        console.error("aiPersona fetch 실패:", err);
      }
    })();
  }, [conversationId, accessToken]);

  // 📌 피드백 불러오기
  useEffect(() => {
    if (!conversationId || !accessToken) return;
    const loadFeedback = async () => {
      try {
        const res = await fetch(
          `/api/conversations/${conversationId}/feedback`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
          }
        );
        if (!res.ok) {
          setError(`Failed to fetch feedback: ${res.status}`);
          return;
        }
        const data: Feedback = await res.json();
        setFeedback(data);
      } catch (err) {
        setError("네트워크 오류");
      } finally {
        setLoading(false);
      }
    };
    loadFeedback();
  }, [conversationId, accessToken]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!feedback) return <p className="p-6">No feedback available</p>;

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* 헤더 */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-gray-900 text-xl font-semibold font-pretendard">
            Result
          </h1>
        </div>
      </div>

      {/* 메인 콘텐츠 (스크롤 가능 영역) */}
      <div className="flex-1 flex justify-center overflow-y-auto">
        <div className="">
          {/* Hero Section */}
          <div className="px-4 pt-6 pb-4 bg-[#EFF6FF]  w-full max-w-[500px]">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/characters/Noonchicoach.svg"
                width={34}
                height={34}
                alt="Noonchi coach"
                className="rounded-full"
              />
              <h2 className="text-gray-900 text-xl font-semibold font-pretendard leading-[130%]">
                Noonchi coach
              </h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-gray-900 text-base font-medium font-pretendard leading-[130%] mb-4">
                {feedback.overallEvaluation ||
                  "You responded appropriately to the situation, but the tone could be more polite."}
              </p>
              <div className="border-t border-gray-200 pt-4">
                <div className="space-y-3">
                  <Score label="Politeness" value={feedback.politenessScore} />
                  <Score
                    label="Naturalness"
                    value={feedback.naturalnessScore}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="px-4 pt-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setTab("transcript")}
                className={`flex-1 py-3 text-sm font-medium transition-all duration-200 border-b-2 text-center ${
                  tab === "transcript"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Transcript
              </button>
              <button
                onClick={() => setTab("mistakes")}
                className={`flex-1 py-3 text-sm font-medium transition-all duration-200 border-b-2 text-center ${
                  tab === "mistakes"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                Common Mistakes
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="px-4 pt-6 pb-6">
            {tab === "transcript" ? (
              <Transcript messages={messages} aiName={aiName} />
            ) : (
              <div className="space-y-4">
                <Section
                  title="Conversation Summary"
                  desc={feedback.summary || ""}
                />
                <Section
                  title="What you did well"
                  desc={feedback.goodPoints || ""}
                />
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <h3 className="text-gray-900 text-base font-semibold font-pretendard leading-[130%] mb-3">
                    What you can improve
                  </h3>
                  <div className="border-t border-gray-200 pt-3 flex flex-col">
                    <p className="text-gray-700 text-sm font-medium font-pretendard leading-[130%] mb-4">
                      {feedback.improvementPoints || ""}
                    </p>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-gray-600 bg-blue-200 w-10 py-1 font-semibold text-center rounded-full text-sm font-pretendard leading-[130%] mb-3">
                        Try
                      </p>
                      <p className="text-gray-700 text-sm font-medium font-pretendard leading-[130%]">
                        {feedback.improvementExamples || ""}
                      </p>
                    </div>
                  </div>
                </div>
                -
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Button */}
      <div className="px-4 pb-6 sticky bottom-0 bg-white z-50">
        <button
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-gray-900 transition "
          onClick={() => router.push("/main")}
        >
          Complete
        </button>
      </div>
    </div>
  );
}
