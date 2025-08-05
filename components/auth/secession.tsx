'use client';

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function Secession() {
  const { user } = useUser();
  const [isDelete, setIsDelete] = useState(false);

  // 탈퇴 처리 함수
  const handleSecession = async () => {
    try {
      await user?.delete(); // Clerk 탈퇴
      window.location.href = "/"; // 홈으로 이동
    } catch (e) {
      console.error("Failed Secession", e);
    }
  };

  return (
    <>
      <button onClick={() => setIsDelete(true)} className="mt-2 cursor-pointer">
        <span className="font-medium">Secession</span>
      </button>
      {isDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-lg p-6 w-80 flex flex-col items-center justify-center bg-white">
            <h2 className="text-lg text-black font-semibold mb-4 text-center">
              Would you like to <br />
              delete your account?
            </h2>
            <div className="flex justify-center gap-2 w-full">
              <button
                onClick={() => setIsDelete(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                취소
              </button>
              <button
                onClick={handleSecession} 
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
