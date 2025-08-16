export default function Section({ title, desc, type }: { title: string; desc: string; type?: 'highlight' }) {
  return (
    <div className={`p-4 rounded ${type === 'highlight' ? 'bg-blue-50' : 'bg-gray-100'}`}>
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <p className="text-sm text-black whitespace-pre-line">{desc}</p>
    </div>
  );
}