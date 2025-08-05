import TabBar from "@/components/tab-bar";

export const dynamic = "force-dynamic";

export default function MainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-[640px] min-h-screen flex flex-col mx-auto">
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
      <div className="h-15"/>
      <div className="sticky bottom-0 w-full">
        <TabBar />
      </div>
    </div>
  );
}
