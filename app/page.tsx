import { Calendar } from '@/components/calendar';
import { MainNav } from '@/components/main-nav';
import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Calendar />
      </main>
    </div>
  );
}
