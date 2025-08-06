import { ReactNode } from "react";

interface SettingItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

export function SettingItem({ icon, title, description, onClick }: SettingItemProps) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-100 transition"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-medium">{title}</span>
        <span className="text-xs text-gray-500">{description}</span>
      </div>
    </div>
  );
}