/* eslint-disable @typescript-eslint/no-explicit-any */
import Face0 from "../character/select/face0";
import Face1 from "../character/select/face1";
import Face2 from "../character/select/face2";
import Face3 from "../character/select/face3";
import ProfileChange from "./profilechange";

interface ProfileSelectorProps {
  user: any;
  nickname: string;
  setNickname: (val: string) => void;
  avatar: string | null;
  setAvatar: (val: string) => void;
}

export const faces = [Face0, Face1, Face2, Face3];

export default function ProfileSelector({
  user,
  nickname,
  setNickname,
  avatar,
  setAvatar,
}: ProfileSelectorProps) {
  return (
    <div className="flex flex-col items-center space-y-6 gap-3 pt-7 w-[334px]">
      <h2 className="text-2xl font-semibold pr-18">Please select a profile</h2>
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
          <button
            onClick={() => setNickname("")}
            className=" hover:text-gray-600 pl-1.5 pb-1 text-sm absolute right-3 top-1.5"
          >
            X
          </button>

        <p className="text-xs text-gray-400 mt-1 text-center">
          Nickname should be 15 characters or less
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500 text-center">Pick your favorite one!</p>
       <div className=" grid grid-cols-2 gap-5">
 {faces.map((Face, index) => (
  <button
    key={index}
    onClick={() => setAvatar(`option-${index}`)}
    className={`w-18 h-18 overflow-hidden  2 gap-4
      ${avatar === `option-${index}` ? "ring-2 ring-black" : ""}`}
  >
    <Face className="w-full h-full" />
  </button>
))}
</div>
      </div>
    </div>
  );
}
