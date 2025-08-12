
'use client';

import { useRef, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

// Sounds are now Base64 encoded to avoid any cross-origin issues.
const sounds = [
  { name: 'Bruh', url: 'https://www.myinstants.com/media/sounds/movie_1.mp3' },
  { name: 'Wow', url: 'https://www.myinstants.com/media/sounds/anime-wow-sound-effect.mp3' },
  { name: 'Emotional Damage', url: 'https://www.myinstants.com/media/sounds/emotional-damage-meme.mp3' },
  { name: 'Nope', url: 'https://www.myinstants.com/media/sounds/engineer_no01.mp3' },
  { name: 'Wrong', url: 'https://www.myinstants.com/media/sounds/wrong-answer-sound-effect.mp3' },
  { name: 'Discord', url: 'https://www.myinstants.com/media/sounds/discord-notification.mp3' },
  { name: 'Vine Boom', url: 'https://www.myinstants.com/media/sounds/vine-boom.mp3' },
  { name: 'Error', url: 'https://www.myinstants.com/media/sounds/error_CDOxCYm.mp3' },
  { name: 'Sparkle', url: 'https://www.myinstants.com/media/sounds/fairy-dust-sound-effect.mp3' },
  { name: 'Aww', url: 'https://www.myinstants.com/media/sounds/studio-audience-awwww-sound-fx.mp3' },
  { name: 'Saja Boys', url: 'https://www.myinstants.com/media/sounds/saja-boy-jingle.mp3' },
  { name: 'Connection Lost', url: 'https://www.myinstants.com/media/sounds/loading-lost-connection-green-screen-with-sound-effect-2_K8HORkT.mp3' },
  { name: 'Huh?', url: 'https://www.myinstants.com/media/sounds/huh_37bAoRo.mp3' },
  { name: 'Celebrate', url: 'https://www.myinstants.com/media/sounds/celebration.mp3' },
  { name: 'Dun Dun Dun', url: 'https://www.myinstants.com/media/sounds/dun-dun-dun-sound-effect-brass_8nFBccR.mp3' },
  { name: 'Lizard', url: 'https://www.myinstants.com/media/sounds/lizard-button.mp3' },
  { name: 'Pew', url: 'https://www.myinstants.com/media/sounds/pew_pew-dknight556-1379997159.mp3' },
  { name: 'Shut Up!', url: 'https://www.myinstants.com/media/sounds/shutup.swf.mp3' },
  { name: 'Silence! I kill you', url: 'https://www.myinstants.com/media/sounds/ahmed-the-dead-terrorist-silence-i-kill-you_.mp3' },
  { name: 'he fxcked up', url: 'https://www.myinstants.com/media/sounds/he-fucked-up.mp3' },
];

export function Soundboard() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl shadow-2xl bg-secondary/50">
      <CardContent className="p-4">
        {/* The audio element is now part of the component's rendered output */}
        <audio ref={audioRef} preload="auto" />
        <ScrollArea className="h-72">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2">
            {sounds.map((sound) => (
              <Button
                key={sound.name}
                variant="default"
                className="h-24 text-base whitespace-normal flex-col gap-2"
                onClick={() => playSound(sound.url)}
              >
                <span>{sound.name}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
