export default function Section({ title, desc, type }: { title: string; desc: string; type?: 'highlight' }) {
  return (
    <div className="space-y-3">
      <h3 className="text-gray-900 text-base font-semibold font-pretendard leading-[130%] px-4">
        {title}
      </h3>
      <div className={`p-4 rounded-2xl border border-gray-200 ${type === 'highlight' ? 'bg-blue-50' : 'bg-white'}`}>
        <p className="text-gray-700 text-sm font-medium font-pretendard leading-[130%] whitespace-pre-line">
          {desc}
        </p>
      </div>
    </div>
  );
}