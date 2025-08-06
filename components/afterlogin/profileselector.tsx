/* eslint-disable @typescript-eslint/no-explicit-any */
import ProfileChange from "./profilechange";

interface ProfileSelectorProps {
  user: any;
  nickname: string;
  setNickname: (val: string) => void;
  avatar: string | null;
  setAvatar: (val: string) => void;
}

export default function ProfileSelector({
  user,
  nickname,
  setNickname,
  avatar,
  setAvatar,
}: ProfileSelectorProps) {
  return (
    <div className="flex flex-col items-center space-y-6 gap-3 pt-7 w-[334px]">
      <h2 className="text-xl font-semibold pr-24">Please select a profile</h2>
      <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden">
        <ProfileChange user={user} />
      </div>
      <div className="relative w-5/6 max-w-sm">
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-50 text-sm focus:outline-none placeholder:text-gray-400"
          maxLength={15}
        />
        <div className="bg-gray-300 rounded-full size-6 absolute right-1 top-1.5">
          <button
            onClick={() => setNickname("")}
            className=" hover:text-gray-600 pl-1.5 pb-1 text-sm"
          >
            x
          </button>
          </div>
        <p className="text-xs text-gray-400 mt-1 text-center">
          Nickname should be 15 characters or less
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500 text-center">Pick your favorite one!</p>
        <div className="flex gap-4 justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full bg-gray-300 cursor-pointer transition ${
                avatar === `option-${i}` ? "ring-2 ring-gray-500" : ""
              }`}
              onClick={() => setAvatar(`option-${i}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
