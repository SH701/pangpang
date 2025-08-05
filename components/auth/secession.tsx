'use client';

import { useState } from "react";
import { useUser, useReverification } from "@clerk/nextjs";

export default function Secession() {
  const { user } = useUser();
  const [isDelete, setIsDelete] = useState(false);

  const deleteAccount = useReverification(
    async () => {
      if (!user) return;
      await user.delete();
      window.location.href = "/";
    },
  );

  return (
    <>
      <button
        onClick={() => setIsDelete(true)}
        className="mt-2 cursor-pointer border px-10"
      >
        <span className="font-medium">Secession</span>
      </button>

      {isDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-lg p-6 w-80 flex flex-col items-center bg-white">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex gap-2 w-full justify-center">
              <button
                onClick={() => setIsDelete(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteAccount()}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Secession
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
