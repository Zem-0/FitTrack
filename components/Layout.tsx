import { MainNav } from "@/components/MainNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-[#1c1c1c] border-r border-white/10">
        <MainNav />
      </div>
      <main className="md:pl-72 min-h-screen bg-[#111111]">
        {children}
      </main>
    </div>
  );
} 