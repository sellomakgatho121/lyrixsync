import { Music } from 'lucide-react';

export default function Header() {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <Music className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-bold font-headline text-primary">LyrixSync</h1>
      </div>
      <p className="text-muted-foreground mt-2">
        Sync your music libraries and get lyrics instantly.
      </p>
    </header>
  );
}
