interface NextButtonProps {
  info: Record<string, string>; 
  step: number;
  level: string;
  nickname: string;
  avatar: string | null;
  interests: string[];
  handleNext: () => void;
}

export default function NextButton({
  info,
  step,
  level,
  nickname,
  avatar,
  interests,
  handleNext,
}: NextButtonProps) {
  const isDisabled =
    (step === 0 && !info)||
    (step === 1 && !level) ||
    (step === 2 && !nickname && !avatar) ||
    (step === 3 && interests.length === 0);

  return (
    <div className="fixed bottom-0 inset-x-0 w-full z-50">
      <div className=" w-[calc(100vw)]">
        <button
          onClick={handleNext}
          disabled={isDisabled}
          className={`w-full py-3  bg-black transition cursor-pointer
            ${isDisabled ? "text-gray-400 font-semibold" : "text-white font-semibold"}
          `}
        >
          {step === 3 ? "Start" : "Next"}
        </button>
      </div>
    </div>
  );
}
