interface NextButtonProps {
  step: number;
  level: string;
  nickname: string;
  avatar: string | null;
  interests: string[];
  handleNext: () => void;
}

export default function NextButton({
  step,
  level,
  nickname,
  avatar,
  interests,
  handleNext,
}: NextButtonProps) {
  const isDisabled =
    (step === 0 && !level) ||
    (step === 1 && !nickname && !avatar) ||
    (step === 2 && interests.length === 0);

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white py-4 shadow-md z-50">
      <div className="w-full max-w-md mx-auto px-4">
        <button
          onClick={handleNext}
          disabled={isDisabled}
          className={`w-full py-3 rounded bg-black transition
            ${isDisabled ? "text-gray-400 font-semibold" : "text-white font-semibold"}
          `}
        >
          {step === 2 ? "Start" : "Next"}
        </button>
      </div>
    </div>
  );
}
