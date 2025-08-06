"use client";

interface LevelOption {
  level: string;
  title: string;
  description: string;
}

interface Props {
  selected: string;
  onSelect: (level: string) => void;
}

const levels: LevelOption[] = [
  {
    level: "1",
    title: "Beginner",
    description:
      "I know basic polite words, but I’m not sure when or how to use honorifics.",
  },
  {
    level: "2",
    title: "Intermediate",
    description:
      "I can use endings, but I’m not confident in using formal or respectful language correctly.",
  },
  {
    level: "3",
    title: "Advanced",
    description:
      "I understand and use honorifics naturally depending on context or relationship.",
  },
];

export default function LevelSelector({ selected, onSelect }: Props) {
  return (
    <div className="space-y-6 px-4 mt-18">
      <div className="flex justify-between items-start flex-col">
        <h2 className="text-2xl font-semibold mb-5">Please select your <br /> Korean level</h2>
        <h6 className="text-[#9CA3AF] text-sm">Tell us how comfortable you are <br />chatting in Korean!</h6>
      </div>

      {levels.map(({ level, title, description }) => (
        <button
          key={level}
          onClick={() => onSelect(level)}
          className={`flex items-center gap-4 w-full text-left p-4  transition h-31
            ${selected === level ? "bg-sky-50 text-black" : "bg-gray-100 hover:bg-gray-100"}
          `}
        >
          <div className="w-10 h-10 rounded-full bg-gray-300 shrink-0" />
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-[13px] text-gray-500 ">{description}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
