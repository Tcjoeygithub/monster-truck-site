import Sidebar from "./Sidebar";

interface Props {
  children: React.ReactNode;
}

export default function TwoColumnLayout({ children }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8">
        <main className="min-w-0">{children}</main>
        <div className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
