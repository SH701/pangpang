'use client';

export default function Score({
  label,
  value,
}: {
  label: string;
  value: number | string 
}) {
  const num = Number(value)  
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm font-medium text-blue-600">
        <span>{label}</span>
        <span>{num}%</span>
      </div>
      <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
        <div
          className="h-3 bg-blue-500 rounded-full transition-all"
          style={{ width: `${num}%` }}
        />
      </div>
    </div>
  );
}
