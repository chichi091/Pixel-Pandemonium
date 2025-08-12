
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Soundboard } from '@/components/soundboard';
import { SoundboardIcon } from '@/components/icons/soundboard-icon';

export default function SoundboardPage() {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 relative overflow-hidden"
      >
      <div className="text-center z-10 relative">
        <div className="flex items-center justify-center gap-4 mb-4">
            <SoundboardIcon className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-7xl font-bold font-headline text-primary">
            Soundboard
            </h1>
        </div>
        <p className="text-xl text-muted-foreground mt-2 mb-8">
          You've found the legendary meme soundboard. Click away.
        </p>

        <Soundboard />

        <Button asChild className="mt-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Pandemonium
          </Link>
        </Button>
      </div>
    </div>
  );
}
