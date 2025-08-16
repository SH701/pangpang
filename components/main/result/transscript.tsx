export default function Transcript({ aiMsg, userMsg }: { aiMsg: string; userMsg: string }) {
  return (
    <div className="space-y-4">
      {/* AI */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">사장님</p>
        <div className="bg-gray-100 p-3 rounded">
          <p className="text-sm">{aiMsg}</p>
          <div className="text-xs text-gray-400 mt-2 flex gap-2">
            <span>🔊</span>
            <span>🌐</span>
            <span className="bg-gray-200 px-2 py-0.5 rounded">존댓말</span>
          </div>
        </div>
      </div>

      {/* 사용자 */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-1">나</p>
        <div className="border border-red-400 p-3 rounded">
          <p className="text-sm">{userMsg}</p>
          <div className="text-xs text-gray-400 mt-2 flex gap-2">
            <span className="bg-gray-200 px-2 py-0.5 rounded">존댓말</span>
          </div>
        </div>
      </div>
    </div>
  );
}