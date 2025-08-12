
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Draggable from 'react-draggable';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface Meme {
  id: number;
  url: string;
  x: number;
  y: number;
}

const memeUrls = [
  'https://i.imgflip.com/1ur9b0.jpg', // Distracted Boyfriend
  'https://i.imgflip.com/345v97.jpg', // Woman Yelling at a Cat
  'https://i.imgflip.com/30b1gx.jpg', // Drake Hotline Bling
  'https://i.imgflip.com/1bgw.jpg',   // Grumpy Cat
  'https://i.imgflip.com/1otk96.jpg', // Mocking Spongebob
  'https://i.imgflip.com/1bh617.jpg', // This Is Fine
  'https://i.imgflip.com/4f5d1x.jpg', // Buff Doge vs. Cheems
  'https://i.imgflip.com/23ls.jpg',   // Disaster Girl
  'https://i.imgflip.com/1h7in3.jpg', // Roll Safe
  'https://i.imgflip.com/2kbn1e.jpg', // Surprised Pikachu
  'https://i.imgflip.com/1j423u.jpg', // Expanding Brain
  'https://i.imgflip.com/1g8my4.jpg', // Two Buttons
  'https://i.imgflip.com/24y43o.jpg', // Change My Mind
  'https://i.imgflip.com/2fm6x.jpg',  // Is This A Pigeon?
  'https://i.imgflip.com/26am.jpg',   // Ancient Aliens
  'https://i.imgflip.com/1bij.jpg',   // The Rock Driving
  'https://i.imgflip.com/28j0te.jpg', // American Chopper Argument
  'https://i.imgflip.com/3o5bzx.jpg', // Bernie I Am Once Again Asking
  'https://i.imgflip.com/3mcplf.jpg', // Unsettled Tom
  'https://i.imgflip.com/29v4f.jpg',  // I Don't Need It
];

const KONAMI_CODE_SEQUENCE = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
const MEME_WORD_SEQUENCE = ['m', 'e', 'm', 'e'];


const DraggableMeme = ({ meme, onClose }: { meme: Meme; onClose: (id: number) => void }) => {
  const nodeRef = useRef(null);
  return (
      <Draggable
        nodeRef={nodeRef}
        defaultPosition={{ x: meme.x, y: meme.y }}
        handle=".handle"
      >
        <div ref={nodeRef} className="absolute pointer-events-auto w-64 bg-secondary rounded-lg shadow-2xl border-2 border-primary animate-wobble">
          <div className="handle w-full h-8 bg-primary/80 cursor-move rounded-t-md flex items-center justify-end px-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-primary-foreground hover:bg-primary"
              onClick={() => onClose(meme.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <img src={meme.url} alt="meme" className="w-full h-auto rounded-b-md" />
        </div>
      </Draggable>
  );
};

export function MemeVault() {
  const { toast } = useToast();
  const [konamiProgress, setKonamiProgress] = useState<string[]>([]);
  const [memeProgress, setMemeProgress] = useState<string[]>([]);
  const [activeMemes, setActiveMemes] = useState<Meme[]>([]);

  const triggerMemeSequence = useCallback(() => {
    try {
      const vaultUnlocked = localStorage.getItem('meme_vault_unlocked') === 'true';
      if (!vaultUnlocked) {
        toast({
          title: 'You found the Meme Vault 🏆',
          description: 'Your expertise in internet culture is unparalleled.',
        });
        localStorage.setItem('meme_vault_unlocked', 'true');
      }
    } catch (e) {
      console.error("Could not access localStorage for meme vault", e);
    }
    
    const spawnCount = Math.floor(Math.random() * 11) + 20; // 20-30 memes
    const spawnInterval = 10000 / spawnCount;

    const shuffledMemes = [...memeUrls].sort(() => 0.5 - Math.random());
    const memesToShow = shuffledMemes.slice(0, spawnCount);

    for (let i = 0; i < memesToShow.length; i++) {
      setTimeout(() => {
        const newMeme: Meme = {
          id: Date.now() + i,
          url: memesToShow[i],
          x: Math.random() * (window.innerWidth - 300),
          y: Math.random() * (window.innerHeight - 300),
        };
        setActiveMemes(prev => [...prev, newMeme]);
      }, i * spawnInterval);
    }
  }, [toast]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    // Konami Code Logic
    const newKonamiProgress = [...konamiProgress, key];
    if (KONAMI_CODE_SEQUENCE[newKonamiProgress.length - 1] === key) {
      if (newKonamiProgress.length === KONAMI_CODE_SEQUENCE.length) {
        triggerMemeSequence();
        setKonamiProgress([]);
      } else {
        setKonamiProgress(newKonamiProgress);
      }
    } else {
      setKonamiProgress([]);
    }

    // "meme" word logic
    const newMemeProgress = [...memeProgress, key];
     if (MEME_WORD_SEQUENCE[newMemeProgress.length - 1] === key) {
      if (newMemeProgress.length === MEME_WORD_SEQUENCE.length) {
        triggerMemeSequence();
        setMemeProgress([]);
      } else {
        setMemeProgress(newMemeProgress);
      }
    } else {
       // Reset if the key is not the next one in the sequence, unless it's the first key
       if (MEME_WORD_SEQUENCE[0] === key) {
         setMemeProgress([key]);
       } else {
         setMemeProgress([]);
       }
    }

  }, [konamiProgress, memeProgress, triggerMemeSequence]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  const closeMeme = (id: number) => {
    setActiveMemes(prev => prev.filter(meme => meme.id !== id));
  };

  if (activeMemes.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {activeMemes.map(meme => (
        <DraggableMeme key={meme.id} meme={meme} onClose={closeMeme} />
      ))}
    </div>
  );
}
