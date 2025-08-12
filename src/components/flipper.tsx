
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { addEasterEgg, checkAllEasterEggsFound } from '@/lib/easter-eggs';
import { useToast } from '@/hooks/use-toast';


const EXIT_PHRASE = 'rightsideup';

export function Flipper() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickPos, setLastClickPos] = useState<{ x: number; y: number } | null>(null);
  const [userInput, setUserInput] = useState('');
  const { toast } = useToast();

  const addAchievement = useCallback((achievement: string) => {
     try {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (achievements.includes(achievement)) {
            return;
        }
        const newAchievements = [...achievements, achievement];
        localStorage.setItem('achievements', JSON.stringify(newAchievements));
        
        // We can't toast directly from here because it might be called during render.
        // The main page will handle toasting.
        window.dispatchEvent(new Event('storage'));

    } catch (error) {
        console.error("Failed to save achievements to localStorage", error);
    }
  }, []);

  // Check cookie on mount
  useEffect(() => {
    try {
        const flippedFromCookie = localStorage.getItem('is-flipped') === 'true';
        if (flippedFromCookie) {
          setIsFlipped(true);
          document.body.classList.add('flipped-screen');
        }
    } catch (e) {
        // local storage not available
    }
  }, []);

  const toggleFlip = useCallback(() => {
    setIsFlipped(prev => {
      const newState = !prev;
      if (newState) {
        document.body.classList.add('flipped-screen');
        localStorage.setItem('is-flipped', 'true');
        // This is where we register that the easter egg has been found.
        addEasterEgg('screen_flip', () => checkAllEasterEggsFound(addAchievement));

      } else {
        document.body.classList.remove('flipped-screen');
        localStorage.removeItem('is-flipped');
      }
      return newState;
    });
  }, [addAchievement]);

  // Click handler to trigger the flip
  const handleClick = useCallback((e: MouseEvent) => {
    // Do nothing if the screen is already flipped.
    if (isFlipped) return;

    const currentPos = { x: e.clientX, y: e.clientY };

    if (!lastClickPos || currentPos.x !== lastClickPos.x || currentPos.y !== lastClickPos.y) {
        // If it's the first click or a click in a new position, start the count at 1.
        setClickCount(1);
        setLastClickPos(currentPos);
        return;
    }

    // If click is in the same position, increment the count.
    setClickCount(prev => prev + 1);

  }, [lastClickPos, isFlipped]);

  // Effect to watch click count
  useEffect(() => {
    if (clickCount >= 3) {
      toggleFlip();
      setClickCount(0);
      setLastClickPos(null);
    }
  }, [clickCount, toggleFlip]);
  
  // Keyboard handler to exit flip mode
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isFlipped) return;

    const key = event.key.toLowerCase();
    
    // Ignore non-character keys (like Shift, Ctrl, etc.)
    if (key.length > 1) return;
    if (key === ' ') return; // explicitly ignore spaces
    
    setUserInput(prev => {
        const newText = (prev + key).slice(-EXIT_PHRASE.length);
        if (newText === EXIT_PHRASE) {
            setIsFlipped(false);
            document.body.classList.remove('flipped-screen');
            localStorage.removeItem('is-flipped');
            return ''; // Reset input
        }
        return newText;
    });

  }, [isFlipped]);

  const handleMouseMove = useCallback(() => {
    // If the mouse moves, reset the click sequence.
    if (clickCount > 0) {
        setClickCount(0);
        setLastClickPos(null);
    }
  }, [clickCount]);

  // Attach global event listeners
  useEffect(() => {
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleClick, handleKeyDown, handleMouseMove]);


  return null; // This is a logic-only component, it doesn't render anything
}
