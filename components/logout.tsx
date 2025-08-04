"use client";

import { useClerk } from "@clerk/nextjs";

export default function Logout() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: "/" }); // 로그아웃 후 리다이렉트 위치
    } catch (e) {
      console.error("로그아웃 실패", e);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-2 py-1 rounded border mt-2 cursor-pointer"
    >
      <span className="text-xs">로그아웃</span>
    </button>
  );
}
