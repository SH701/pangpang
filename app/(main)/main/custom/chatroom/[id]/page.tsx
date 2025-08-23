/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MyAI } from "@/lib/types";
import { useAuth } from "@/lib/UserContext";
import Link from "next/link";
import MessageList from "@/components/chats/MessageList";
import { HonorificResults } from "@/components/chats/HonorificSlider";
import Image from "next/image";
import LoadingModal from "@/components/chats/LoadingModal";
import { useRecorder } from "@/hooks/userRecorder";

type ConversationDetail = {
  conversationId: number;
  userId: number;
  aiPersona: MyAI;
  status: "ACTIVE" | "ENDED";
  situation: string;
  chatNodeId: string;
  createdAt: string;
  endedAt: string | null;
};

type ChatMsg = {
  messageId: string;
  conversationId: number;
  role: "USER" | "AI";
  content: string;
  createdAt: string;
  feedback?: string;
  isLoading?: boolean;
  politenessScore?: number;
  naturalnessScore?: number;
};

export default function ChatroomPage() {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [myAI, setMyAI] = useState<MyAI | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canCall = Boolean(accessToken);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [feedbackOpenId, setFeedbackOpenId] = useState<string | null>(null);
  const router = useRouter();
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [honorificResults, setHonorificResults] = useState<
    Record<string, HonorificResults>
  >({});
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [hidden, setHidden] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const { isRecording, startRecording, stopRecording } = useRecorder();
  const [isTyping, setIsTyping] = useState(false);

  const handleKeyboardClick = () => {
    setIsTyping((prev) => !prev);
  };
  // 대화 정보 로드
  useEffect(() => {
    if (!canCall || !id) return;
    (async () => {
      try {
        const res = await fetch(`/api/conversations/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        });
        if (!res.ok) {
          const errorText = await res.text();
          console.error("대화 정보 조회 실패:", res.status, errorText);
          setError(`대화 정보를 불러올 수 없습니다: ${res.status}`);
          return;
        }
        const data: ConversationDetail = await res.json();
        setMyAI(data.aiPersona);
        setConversationId(data.conversationId);
        setError(null);
      } catch (err) {
        console.error("대화 정보 조회 오류:", err);
        setError("네트워크 오류가 발생했습니다");
      }
    })();
  }, [accessToken, id, canCall]);

  // 메시지 목록 로드
  const fetchMessages = async () => {
    if (!canCall) return;
    try {
      setError(null);
      const res = await fetch(
        `/api/messages?conversationId=${id}&page=1&size=20`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: "no-store",
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error("메시지 조회 실패:", res.status, errorText);
        setError(`메시지를 불러올 수 없습니다: ${res.status}`);
        return;
      }
      const data = await res.json();
      const list = (data?.content ?? data ?? []) as any[];
      const mapped: ChatMsg[] = list.map((m) => ({
        messageId: String(m.messageId),
        conversationId: m.conversationId,
        role: (m.role ?? m.type) as "USER" | "AI",
        content: m.content ?? "",
        createdAt: m.createdAt ?? new Date().toISOString(),
        politenessScore: m.politenessScore ?? -1,
        naturalnessScore: m.naturalnessScore ?? -1,
      }));

      setMessages(mapped);

      // 첫 메시지에서 conversationId 확보
      if (!conversationId && list.length > 0 && list[0].conversationId) {
        setConversationId(list[0].conversationId);
      }
    } catch (err) {
      console.error("메시지 조회 오류:", err);
      setError("메시지를 불러오는 중 오류가 발생했습니다");
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
  const sendMessage = async (content?: string, audioUrl?: string) => {
    if (!canCall || loading) return;
    if (!conversationId) {
      setError("대화방 ID를 불러올 수 없습니다");
      return;
    }

    if ((!content || !content.trim()) && !audioUrl) return;

    const optimistic: ChatMsg = {
      messageId: `user_${Date.now()}`,
      conversationId,
      role: "USER",
      content: content ?? "[음성메시지]",
      createdAt: new Date().toISOString(),
      politenessScore: -1, // 아직 없음
      naturalnessScore: -1,
    };
    setMessages((prev) => [...prev, optimistic]);
    setMessage("");

    try {
      // 유저 메시지 POST
      const userRes = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          conversationId,
          content: content ?? "",
          audioUrl,
        }),
      });

      console.log(userRes);
      if (userRes.status === 409) {
        const errData = await userRes.json();
        setError(errData.error || "STT 변환실패");
        return;
      }
      if (!userRes.ok) {
        const errorText = await userRes.text();
        setError(`메시지 전송 실패: ${userRes.status} ${errorText}`);
        setMessages((prev) =>
          prev.filter((msg) => msg.messageId !== optimistic.messageId)
        );
        return;
      }

      const userMsgData = await userRes.json();
      if (userMsgData?.messageId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === optimistic.messageId
              ? {
                  ...msg,
                  messageId: String(userMsgData.messageId),
                  politenessScore: userMsgData.politenessScore ?? -1,
                  naturalnessScore: userMsgData.naturalnessScore ?? -1,
                }
              : msg
          )
        );
      }

      // 여기서 AI 로딩용 메시지를 미리 넣음
      const aiLoadingMsg: ChatMsg = {
        messageId: `ai_loading_${Date.now()}`,
        conversationId,
        role: "AI",
        content: "...", // placeholder
        createdAt: new Date().toISOString(),
        isLoading: true, // 👈 플래그
      };
      setMessages((prev) => [...prev, aiLoadingMsg]);

      // AI reply 요청
      const aiRes = await fetch(
        `/api/messages/ai-reply?conversationId=${conversationId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (!aiRes.ok) return;

      const aiData = await aiRes.json();
      if (aiData?.content?.trim()) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.messageId === aiLoadingMsg.messageId
              ? {
                  messageId: String(aiData.messageId ?? `ai_${Date.now()}`),
                  conversationId,
                  role: "AI",
                  content: aiData.content,
                  createdAt: aiData.createdAt ?? new Date().toISOString(),
                  isLoading: false,
                }
              : msg
          )
        );
      }
    } catch (e) {
      setError("네트워크 오류로 메시지를 전송할 수 없습니다");
      setMessages((prev) =>
        prev.filter((msg) => msg.messageId !== optimistic.messageId)
      );
    } finally {
      setLoading(false);
    }
  };

  // 대화 종료
  const handleEnd = async () => {
    setEndModalOpen(false);
    setLoadingModalOpen(true);
    try {
      const res = await fetch(`/api/conversations/${id}/end`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        setError("대화를 종료할 수 없습니다");
        setLoadingModalOpen(false);
        return;
      }
      router.push(`/main/custom/chatroom/${id}/result`);
    } catch (error) {
      setError("대화 종료 중 오류가 발생했습니다");
    } finally {
      setLoadingModalOpen(false);
    }
  };

  const handleFeedbacks = async (messageId: string) => {
    if (!accessToken) {
      setError("인증 토큰이 없습니다.");
      return;
    }
    if (feedbackOpenId === messageId) {
      setFeedbackOpenId(null);
      return;
    }
    try {
      const res = await fetch(`/api/messages/${messageId}/feedback`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const errText = await res.text();
        setError(`피드백 요청 실패: ${res.status} ${errText}`);
        return;
      }

      const feedbackData = await res.json();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.messageId === messageId
            ? { ...msg, feedback: feedbackData } // ✅ 그대로 객체 저장
            : msg
        )
      );

      setFeedbackOpenId(messageId);
    } catch (err) {
      setError("네트워크 오류로 피드백 요청 실패");
    }
  };

  const handleHonorific = async (messageId: string) => {
    // 토글: 이미 있으면 제거
    if (honorificResults[messageId]) {
      setHonorificResults((prev) => {
        const copy = { ...prev };
        delete copy[messageId];
        return copy;
      });
      setSliderValues((prev) => {
        const copy = { ...prev };
        delete copy[messageId];
        return copy;
      });
      return;
    }

    try {
      // ✅ messageId만 path에 넣음, 쿼리 파라미터 제거
      const res = await fetch(
        `/api/messages/${messageId}/honorific-variations`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok) {
        console.error("존댓말 변환 실패");
        return;
      }

      const data = await res.json();

      // 결과 저장
      setHonorificResults((prev) => ({
        ...prev,
        [messageId]: data,
      }));

      // 기본 슬라이더 값 1로 설정
      setSliderValues((prev) => ({
        ...prev,
        [messageId]: 1,
      }));
    } catch (err) {
      console.error("handleHonorific error:", err);
    }
  };

  const handleMicClick = async () => {
    if (isRecording) {
      const file = await stopRecording();

      // 1. presigned URL 요청
      const res = await fetch("/api/files/presigned-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fileType: "audio.wav",
          fileExtension: "wav",
        }),
      });

      if (!res.ok) throw new Error("presigned-url 요청 실패");
      const { url: presignedUrl } = await res.json();

      // 2. S3 업로드
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/wav" },
        body: file,
      });

      // 3. 최종 URL
      const audioUrl = presignedUrl.split("?")[0];

      // 4. 메시지 전송 (텍스트 없이 오디오만)
      await sendMessage("", audioUrl);
    } else {
      startRecording();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col max-w-[500px] w-full">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
          <div className="flex items-center justify-between w-full">
            <Link
              href="/main"
              aria-label="Back"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <span className="text-lg font-semibold text-gray-900 font-pretendard">
              {myAI?.name ?? "..."}
            </span>
            <button
              onClick={() => setEndModalOpen(true)} // 모달 열기
              aria-label="End conversation"
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <Image
                src="/etc/exit_to_app.svg"
                alt="exit"
                width={24}
                height={24}
              />
            </button>
          </div>
          {!hidden && (
            <button
              className="absolute right-3"
              onClick={() => setHidden(true)}
            >
              <Image src="/etc/exit2.png" alt="exit" width={84} height={33} />
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
            <div className="flex justify-between">
              <p className="text-sm text-red-700">{error}</p>
              <button onClick={() => setError(null)}>X</button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 bg-white px-4 py-4 overflow-y-auto mb-[139px]">
          {" "}
          {/* 여기서 입력란의 높이 만큼 마진을 주어 겹치지 않도록 */}
          <MessageList
            messages={messages}
            myAI={myAI}
            feedbackOpenId={feedbackOpenId}
            honorificResults={honorificResults}
            sliderValues={sliderValues}
            handleFeedbacks={handleFeedbacks}
            handleHonorific={handleHonorific}
            setSliderValues={setSliderValues}
          />
          <div ref={bottomRef} />
        </div>

        {/* Input - Fixed at bottom */}
        <div className="bg-blue-50 py-4 h-[139px] border-t border-gray-200 max-w-[500px] w-full flex justify-center items-center gap-4 fixed bottom-0 z-50">
          {!isTyping && (
            <>
              <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100">
                <Image
                  src="/chatroom/refresh.png"
                  alt="Refresh"
                  width={24}
                  height={24}
                />
              </button>
              <button onClick={handleMicClick}>
                <Image
                  src={
                    isRecording ? "/chatroom/pause.png" : "/chatroom/mic.png"
                  }
                  alt="Mic"
                  width={82}
                  height={82}
                />
              </button>
              <button
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                onClick={handleKeyboardClick}
              >
                <Image
                  src="/chatroom/keyboard_alt.png"
                  alt="Keyboard"
                  width={24}
                  height={24}
                />
              </button>
            </>
          )}

          {/* Typing Section */}
          {isTyping && (
            <div className="flex items-center w-full max-w-[375px] border border-blue-300 rounded-full bg-white mx-4">
              <button onClick={handleKeyboardClick} className="p-2">
                <Image
                  src="/chatroom/mic.png"
                  alt="Mic"
                  width={44}
                  height={44}
                  className="flex-shirink-0"
                />
              </button>
              <input
                type="text"
                placeholder="Reply here"
                className="flex-grow p-2 text-gray-500 placeholder-gray-400 border-none outline-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Image
                src="/chatroom/up.png"
                alt="Send"
                width={28}
                height={28}
                className="mr-3"
                onClick={() => sendMessage(message)}
              />
            </div>
          )}
        </div>
      </div>

      {/* End Modal */}
      {endModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setEndModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-[320px] shadow-lg z-50 flex flex-col items-center text-center">
            <Image
              src="/etc/exitchar.svg"
              alt="exit"
              width={118}
              height={94}
              className="my-5"
            />

            <p className="text-lg font-semibold mb-2">
              Would you like to end the conversation
            </p>
            <p className="text-sm text-gray-600 mb-6">and receive feedback?</p>

            <button
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
              onClick={handleEnd}
            >
              Get Feedback
            </button>

            <button
              className="w-full mt-2 bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold cursor-pointer"
              onClick={() => setEndModalOpen(false)}
            >
              Keep Conversation
            </button>
          </div>
        </div>
      )}
      {loadingModalOpen && <LoadingModal open={loadingModalOpen} />}
    </>
  );
}
