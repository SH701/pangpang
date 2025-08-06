import ChatTextInput from "./chattextinput";
import ChatVoiceButton from "./chatvoicebutton";

export default function ChatInputWrapper() {
  return (
    <div className="w-full px-4 py-3 flex items-center gap-2 bg-[#dde8f9]">
      <ChatTextInput />
      <ChatVoiceButton />
    </div>
  );
}
