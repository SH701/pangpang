"use client";

import Image from "next/image";
import { UserResource } from "@clerk/types";

interface Props {
  user: UserResource | null | undefined;
  size?: number; // 이미지 크기 (선택)
}

export default function ProfileChange({ user, size = 120 }: Props) {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    await user.setProfileImage({ file });
    await user.reload();
     alert("Change Profile!");
  };

  if (!user?.imageUrl) return null;

  return (
    <div className="flex justify-center">
      <label className="cursor-pointer relative group">
        <Image
          src={user.imageUrl}
          alt="Profile"
          width={size}
          height={size}
          className="rounded-full object-cover"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
}
