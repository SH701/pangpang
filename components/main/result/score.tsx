export default function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <div className="h-2 bg-gray-300 rounded-full">
        <div className="h-2 bg-gray-800 rounded-full" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
