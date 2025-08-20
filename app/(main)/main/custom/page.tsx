/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/lib/UserContext";
import Image from "next/image";
import type { Persona } from "@/lib/types";
import Loading from "./chatroom/[id]/loading";

// ✅ 상황 옵션(역할별)
const situationOptions = {
  BOSS: [
    { value: "BOSS1", label: "Apologizing for a mistake at work." },
    { value: "BOSS2", label: "Requesting half-day or annual leave" },
    { value: "BOSS3", label: "Requesting feedback on work" },
  ],
  GF_PARENTS: [
    { value: "GF_PARENTS1", label: "Meeting for the first time" },
    { value: "GF_PARENTS2", label: "Conversation over dinner" },
    { value: "GF_PARENTS3", label: "Apologizing for breaking a picture frame" },
  ],
  CLERK: [
    { value: "CLERK1", label: "Negotiate prices" },
    { value: "CLERK2", label: "Ask about the origin of the product" },
    { value: "CLERK3", label: "Complaining about incorrect food orders" },
  ],
} as const;

// ✅ 파생 타입
type Role = keyof typeof situationOptions;
type SituationValue = (typeof situationOptions)[Role][number]["value"];

const images = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/characters/character1.png",
  "/characters/character2.png",
  "/characters/character3.png",
];

export default function PersonaAndRoom() {
  const { accessToken } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "NONE">("NONE");
  const [age, setAge] = useState<number | "">("");

  // ✅ 역할과 상황(역할 바뀌면 첫 상황으로 리셋)
  const [relationship, setRelationship] = useState<Role>("BOSS");
  const [description, setDescription] = useState<SituationValue>(
    situationOptions.BOSS[0].value
  );
  useEffect(() => {
    const first = situationOptions[relationship][0].value;
    setDescription(first); // 역할 변경 시 항상 해당 역할의 첫 상황으로 동기화
  }, [relationship]);

  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop() || "";

    try {
      const res = await fetch(`/api/files/presigned-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          fileType: file.type,
          fileExtension: ext,
        }),
      });

      if (!res.ok) throw new Error("Presigned URL 요청 실패");
      const { url } = await res.json();

      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const publicUrl = url.split("?")[0];
      setProfileImageUrl(publicUrl);
      setAvatarModalOpen(false);
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("이미지 업로드 실패");
    } finally {
      e.target.value = ""; // 같은 파일 다시 선택 가능하도록 초기화
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoading(true);
    try {
      // 1) 페르소나 생성
      const personaRes = await fetch("/api/personas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          gender,
          age: age === "" ? 20 : age,
          relationship,
          description,
          profileImageUrl,
        }),
      });
      if (!personaRes.ok) throw new Error("Persona 생성 실패");
      const persona: Persona = await personaRes.json();

      // 2) 대화방 생성
      const convoRes = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          personaId: persona.personaId,
          situation: description, // 현재 선택된 상황
        }),
      });
      if (!convoRes.ok) throw new Error("방 생성 실패");
      const convo = await convoRes.json();
      setTimeout(() => {
        router.push(`/main/custom/chatroom/${convo.conversationId}`);
      }, 1500);
    } catch (e: any) {
      alert("생성 실패: " + (e?.message ?? e));
      setShowLoading(false);
    } finally {
    }
  };
  if (showLoading) {
    return <Loading />; // 여기서 loading.tsx 보여줌
  }
  return (
    <div className="w-full max-w-md mx-auto flex flex-col relative overflow-y-auto bg-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <button
          onClick={() => router.back()}
          className="text-black cursor-pointer"
        >
          <ChevronLeftIcon className="size-6" />
        </button>
        <h1 className="flex-1 text-center font-semibold text-black text-lg">
          Create
        </h1>
        <div className="w-6" />
      </div>

      <h2 className="text-xl font-bold mb-6 px-4 text-center">
        Set up your conversation partner
      </h2>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <button
            className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 cursor-pointer"
            onClick={() => setAvatarModalOpen(true)}
          >
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                width={96}
                height={96}
                alt="avatar"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                +
              </div>
            )}
          </button>
        </div>
      </div>

      {avatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAvatarModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 z-10 shadow-xl flex flex-col items-center gap-4 min-w-[320px]">
            <h2 className="text-lg font-semibold mb-3">아바타를 선택하세요</h2>

            <div className="grid grid-cols-3 gap-4">
              {images.map((img, i) => (
                <button
                  key={img}
                  className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                    profileImageUrl === img
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    setProfileImageUrl(img);
                    setAvatarModalOpen(false);
                  }}
                >
                  <Image
                    src={img}
                    width={80}
                    height={80}
                    alt={`avatar${i + 1}`}
                  />
                </button>
              ))}
            </div>

            {/* ✅ 내 사진 업로드 버튼 */}
            <button
              onClick={() =>
                document.getElementById("fileUploadInput")?.click()
              }
              className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 cursor-pointer"
            >
              Upload Your Photo
            </button>
            <input
              id="fileUploadInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange} // presigned-url 로직 연결
            />

            <button
              className=" text-gray-400 text-sm underline cursor-pointer"
              onClick={() => setAvatarModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 px-4 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Enter name"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Gender
          </label>
          <div className="flex gap-2">
            {(["MALE", "FEMALE", "NONE"] as const).map((value) => {
              const isSelected = gender === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGender(value)}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-500"
                      : "bg-white text-gray-500 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {value === "MALE"
                    ? "Male"
                    : value === "FEMALE"
                    ? "Female"
                    : "None"}
                </button>
              );
            })}
          </div>
        </div>
        {/* AI's Role */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            AI`s role
          </label>
          <div className="space-y-2">
            {(
              [
                { value: "BOSS", label: "Boss" },
                { value: "GF_PARENTS", label: "Girlfriend's Parents" },
                { value: "CLERK", label: "Clerk" },
              ] as { value: Role; label: string }[]
            ).map(({ value, label }) => {
              const isSelected = relationship === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRelationship(value)}
                  className={`w-full px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-500"
                      : "bg-white text-gray-500 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Situation (역할별 필터링) */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Situation
          </label>
          <div className="space-y-2">
            {situationOptions[relationship].map(({ value, label }) => {
              const isSelected = description === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDescription(value as SituationValue)}
                  className={`w-full px-4 py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-500"
                      : "bg-white text-gray-500 border border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white text-sm font-semibold rounded-lg mt-8 hover:bg-blue-600 transition-colors disabled:opacity-50 mb-3 cursor-pointer"
        >
          Start Chatting
        </button>
      </form>
    </div>
  );
}
