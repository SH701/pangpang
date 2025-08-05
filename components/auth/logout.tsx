"use client";

import { useClerk } from "@clerk/nextjs";

export default function Logout() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: "/login" }); // 로그아웃 후 첫시작으로
    } catch (e) {
      console.error("로그아웃 실패", e);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className=" mt-2 cursor-pointer border px-10"
    >
      <span className=" font-medium">Logout</span>
    </button>
  );
}
