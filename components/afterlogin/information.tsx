'use client';



interface InformationProps {
  info: Record<string, string>;
  setInfo: (val: Record<string, string>) => void;
}

export default function Information({ info, setInfo }: InformationProps) {
  return (
    <div className="space-y-6 px-4 mt-25">
      <div className="flex justify-between items-start flex-col gap-3">
        <h2 className="text-2xl font-semibold mb-5">Enter your details</h2>
        <h6 className="text-[#9CA3AF] text-sm">
          Enter it exactly as shown on your ID
        </h6>
      </div>
      <div className="flex flex-col">
        <span>Name</span>
        <input
          type="text"
          placeholder="Jisoo"
          value={info.name || ""}
         onChange={(e) => setInfo({ ...info, birth: e.target.value })}
        />
        <span>Date of Birth</span>
        <input
          type="date"
          value={info.birth}
          onChange={(e) => setInfo({ ...info, birth: e.target.value })}
        />
        <span>Gender</span>
        <select
          value={info.gender}
         onChange={(e) => setInfo({ ...info, birth: e.target.value })}
        >
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
    </div>
  );
}
