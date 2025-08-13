import ChatTextInput from "./chattextinput";

export default function ChatInputWrapper() {
  return (
    <div className="w-full px-4 py-3 flex items-center gap-2 bg-[#dde8f9] h-15 mb-14">
      <ChatTextInput />
    </div>
  );
}
