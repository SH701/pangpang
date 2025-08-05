import ChatTextInput from "./chattextinput";
import ChatVoiceButton from "./chatvoicebutton";

export default function ChatInputWrapper() {
  return (
    <div className="w-full px-4 py-2 border-t flex items-center gap-2 bg-white">
      <ChatTextInput />
      <ChatVoiceButton />
    </div>
  );
}
