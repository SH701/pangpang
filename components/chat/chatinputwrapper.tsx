import ChatTextInput from "./chattextinput";

export default function ChatInputWrapper() {
  return (
    <div className="w-full px-4 py-2 flex items-center justify-center bg-transparent min-h-[60px]">
      <ChatTextInput />
    </div>
  );
}
