import { Sidebar } from './Sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex-1 basis-100 flex flex-col overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
    