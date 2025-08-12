'use client';

import { useState, useEffect } from 'react';

const animals = ['🐱', '🐶', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🦄', '🦖', '🐙', '🦀'];

interface Animal {
  id: number;
  emoji: string;
  y: number;
  speed: number;
  size: number;
  left: number;
  direction: 'left' | 'right';
}

export function AnimalParade() {
  const [parade, setParade] = useState<Animal[]>([]);

  useEffect(() => {
    const createAnimal = () => {
      const direction = Math.random() > 0.5 ? 'left' : 'right';
      const newAnimal: Animal = {
        id: Date.now() + Math.random(),
        emoji: animals[Math.floor(Math.random() * animals.length)],
        y: Math.random() * 90, // Percentage from top
        speed: Math.random() * 2 + 1,
        size: Math.random() * 4 + 2, // rem size
        left: direction === 'left' ? 110 : -10, // Start off-screen
        direction,
      };
      setParade((prev) => [...prev, newAnimal]);
    };

    const creationInterval = setInterval(createAnimal, 700);

    const moveInterval = setInterval(() => {
      setParade((prev) =>
        prev
          .map((animal) => ({
            ...animal,
            left: animal.left + (animal.direction === 'right' ? animal.speed : -animal.speed),
          }))
          .filter(
            (animal) =>
              (animal.direction === 'right' && animal.left < 120) ||
              (animal.direction === 'left' && animal.left > -20)
          )
      );
    }, 50);

    // Stop creating animals after 18 seconds
    setTimeout(() => {
      clearInterval(creationInterval);
    }, 18000);

    return () => {
      clearInterval(creationInterval);
      clearInterval(moveInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {parade.map((animal) => (
        <div
          key={animal.id}
          className="absolute"
          style={{
            top: `${animal.y}%`,
            left: `${animal.left}%`,
            fontSize: `${animal.size}rem`,
            animation: 'spin-slow 5s linear infinite alternate'
          }}
          aria-hidden="true"
        >
          {animal.emoji}
        </div>
      ))}
    </div>
  );
}
