import TabBar from "@/components/tab-bar";

export const dynamic = "force-dynamic";

export default function MainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-lg min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
      <div>
        <TabBar />
      </div>
    </div>
  );
}
