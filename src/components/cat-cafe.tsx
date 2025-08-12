
'use client';

import { useState, useEffect, useCallback, MouseEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { NewCatIcon } from './icons/new-cat-icon';
import { DogIcon } from './icons/dog-icon';

interface Animal {
  id: number;
  type: 'cat' | 'dog';
  x: number; // percentage
  y: number; // percentage
  vx: number; // velocity x
  vy: number; // velocity y
  color: string;
  isHidden?: boolean;
  isFound?: boolean;
}

const catColors = ['#6D4C41', '#212121', '#78909C', '#FFAB91', '#E6A756', '#FFFFFF'];
const getRandomColor = () => catColors[Math.floor(Math.random() * catColors.length)];

const initialHiddenDogs: Omit<Animal, 'id' | 'vx' | 'vy' | 'color' | 'type'>[] = [
  { x: 20, y: 30, isHidden: true, isFound: false },
  { x: 80, y: 70, isHidden: true, isFound: false },
  { x: 50, y: 90, isHidden: true, isFound: false },
];

const AnimalComponent = ({ animal }: { animal: Animal }) => {
    if (animal.type === 'dog') {
        return <DogIcon animal={animal} />;
    }
    return <NewCatIcon animal={animal} />
};


export function CatCafe() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const { toast } = useToast();
  const [allFound, setAllFound] = useState(false);

  const addAchievement = useCallback((achievement: string) => {
    try {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (!achievements.includes(achievement)) {
            const newAchievements = [...achievements, achievement];
            localStorage.setItem('achievements', JSON.stringify(newAchievements));
            toast({
                title: '🏆 Achievement Unlocked!',
                description: achievement,
            });
        }
    } catch (error) {
        console.error("Failed to save achievement to localStorage", error);
    }
  }, [toast]);


  useEffect(() => {
    const initialAnimals: Animal[] = [];

    // Add hidden dogs
    initialHiddenDogs.forEach((dog, i) => {
        initialAnimals.push({
            ...dog,
            id: Date.now() + i,
            type: 'dog',
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            color: '#A0522D', // Dog color
        });
    });
    
    // Add some initial wandering cats
    for(let i=0; i<12; i++) {
        initialAnimals.push({
            id: Date.now() + initialHiddenDogs.length + i,
            type: 'cat',
            x: Math.random() * 100,
            y: Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            color: getRandomColor(),
        });
    }

    setAnimals(initialAnimals);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setAnimals(prevAnimals => {
        return prevAnimals.map(animal => {
          let newX = animal.x + animal.vx;
          let newY = animal.y + animal.vy;
          let newVx = animal.vx;
          let newVy = animal.vy;

          // Wrap around screen edges
          if (newX < -10) newX = 110;
          if (newX > 110) newX = -10;
          if (newY < 20) newY = 98; // appear at bottom
          if (newY > 98) newY = 20; // appear at top

          // Randomly change direction more often
          if (Math.random() < 0.01) {
            newVx = (Math.random() - 0.5) * 0.3;
            newVy = (Math.random() - 0.5) * 0.3;
          }
          
          return { ...animal, x: newX, y: newY, vx: newVx, vy: newVy };
        });
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, []);

  useEffect(() => {
    if (allFound) {
      addAchievement('Dog Spotter');
    }
  }, [allFound, addAchievement]);

  const handleCafeClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newCat: Animal = {
      id: Date.now(),
      type: 'cat',
      x,
      y,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      color: getRandomColor(),
    };
    setAnimals(prev => [...prev, newCat]);
  };
  
  const handleAnimalClick = (animalId: number) => {
    const clickedAnimal = animals.find(a => a.id === animalId);
    if (!clickedAnimal || !clickedAnimal.isHidden || clickedAnimal.isFound) return;

    toast({
        title: 'You found a hidden dog!',
        description: 'It seems happy to be discovered.'
    });

    const newAnimals = animals.map(a => a.id === animalId ? {...a, isFound: true} : a);
    setAnimals(newAnimals);

    const hiddenAnimals = newAnimals.filter(a => a.isHidden);
    const allHiddenFound = hiddenAnimals.every(a => a.isFound);

    if (allHiddenFound && !allFound) {
      setAllFound(true);
    }
  }

  const foundCount = animals.filter(a => a.isHidden && a.isFound).length;
  const totalHiddenCount = initialHiddenDogs.length;

  return (
    <div className='flex flex-col h-full'>
      <div className="flex-shrink-0 px-6 pb-4 text-center">
        <p className="text-muted-foreground">Click anywhere to add a cat. But can you find the hidden dogs?</p>
        <Badge variant={foundCount === totalHiddenCount ? "default" : "secondary"} className="mt-2 whitespace-nowrap">
          Found Dogs: {foundCount} / {totalHiddenCount}
        </Badge>
      </div>
      <div 
        className="flex-grow w-full h-full relative overflow-hidden rounded-b-lg cursor-pointer"
        style={{
            backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAMgCAIAAABUEpE/AAAgAElEQVR4AeydB3gU17n3ByStJIRbmm3UhQDR3IgTJ7nJvcmtz3e/m+R+33O/3BiQtH1VAFHsOI5regwCIVyCbZybihsg0Uy1jU1HhWKqKAYiqSIThh3RjbKkCUqzFMVCspp2eWnt9Nll3bl3f71g0tuGxjJqg9n1vEwwrV6fV70Fh8dETRIU0goyqdoEIt+v9UKimWVu2rS5XVlmqKxaVmzZNMwe8hHmeoD8mVqkh7xx1gFplI9jBCGJukXmfL05Ye71mTcsJfJMrFFq63jZz8n4ikLMEVrLC3YWmHgCIl1uvUlhQZQY4Jzjlznqk3OElTZvmaLR0bZoXHx0Q1bDbydGvNHnv5RRaMRGOi5YQQGGXwn6ZJyzlH2nEwqHeoOQQtN2uHxlKwmBqKZngpNncCdQbqV58dbMuprdk3I6LmfKRoAkq9L0uP3o7+gSFI1uj6uOUgBTHA52y8oTU8MaJCRzmL5XLlXkImFxv91sl3szjcGRJMnAHDMnmfU6ScQQkX9ViA7STEMQlm52+HQgFTeBL1cJ6EnThRYn5SyzHfuE/g2cMcXSlTDwxLMhxS8vILjUwWFEnmDF1gQk4opmFHYb+wQYvRiztmmjl0TRZ7JK2XoFiTQKGSgIT2/UCxjggfYFgBpBrXK0BDntSk6cOE7RcxmSih8FsufXMeoey4tFTCRp4ykIT8wD8RB74lyZeX2P8IXPEz3f3A6Dnyw2EiXVDL8N3iXwf3iwXfqMeqnp11XVix9zqNfgRIfdlWAZIfPY2PyM90U8fbv3zCBX7ncmgV68T7b4ZKzx/5uFpfLb54WYXj8tWDR+EztkTKGm3BzqdA7nKOKVw/4QMsLOnDtbjoSn2F/Y9JoXVgo4LMKmNHxDPMQbw48e+RZobRuH3oDE2uR6Rxw6TImW5UmqMcMnJf5xw4eWLtfjMI44mQpPBoz8qvq2ZeELjKIFDEZs+Wh9mDPSdfD9f6Pfml2Ktf58IRy5eJX3Irrg15iTChP22th0ycnPvzV9bYXL5dXjTw4JxUuRi9osv7Pn4Cr9KgrSChZy/z46lfc/wXjzwFZwm7+wL/KG3quE4SlysrAyO3J+9/F0fo3B5ov2mhGzJ4XbL04qBgqPZCvYhI6+F/hKeSmf2i59J1w+XiRe7zO8LVw65bGHhMcnw3GV1IsZTWhGQ6GmMAVDh2Y11wGr/hn87vTsz/ElgVtGZTISc3cA92cdjaubvE9aLtjfrt6O32TXCR4UCj/09TLr9NMSP6Y39+34mBw7sFyd5fP89GxQ9D/y+8PjFbOjb+woNwti0PD7pt6Ab3+3fq4V/3z1Cfz+2zjjLPtUAY8qbsXIfR6u2z1Dcz5v2DuZxyPwy2z21NH+mpOeqxGSjOIJDKmlLwPfsg5rDCMLw6FY9v4OHBPrw+e9gWT6wXZ9crlIr+9GNTTswKXikcHz9cNlkbyXU1RiOg6wHST5+L3Jvhl9Dj//R1uK+GxyUVuOxW3ogDX49f+ixnn17ql/uL36zFf18XvDg4sPA6KpW2LtrLTVxUuOAKdPrrjeM6F75Re95B3H39l3A5G8KQK9YmBo+1zCeT63oKXszfbyCe0OemdnRo1Z2a6Wc8/HMdl9CebV2EfB4s+1yJcu50h5hDPfrZ+DnD0muvxWSy8M75VNxUXg2MKb7dJ9Tndf8XzBjjLuYFeHgEtdW6oMptDEf2ZrMBZKbNdcLQnRwfpoEd8/9nv3o5fRe2vPqYwWxfnzNNzB/b2g5HNRmAC+/5PX1hlGghJcM6WdY0Zqu3JRWt6P0kaPaZ3pNGqNzMaTiNVCSuyEzC0hTY9jHLt9SWThZKUzJxRc1c2d45UX3AsCC4o2JMQbyGJEdGyNgVqRsrw9fu0u0O5pSdZfE1yRYHzGShcnWrM94/nmZjrb30wzR6Q6IquPj4o7OEnAPxFZ2h8nLPpafPawLNoZPVZTFV1WB2Nfi1QId/ssnj5Yg22X7UToDPPU1Tu0ktZcBcd6n/qvvHAGrczhYWtMF4usT1J5t0dse1R3v9U/5Zo5/sPkjwntbmgaPR7+6dzllS/wL9MIltWGbKisFzFaz1P7Q+UJhOIJBoacJHPJ/tIebxGfD9aVbWLCnKWz53weV9HbZX4yeEC2dlI3bqjYo3RRc1v31A+dzGNeKZbXBWw4VrkA5deijzTyX9meYpZVeEsBr9Z9LzrrwSxb+vxl/6fxlbK54CXHf8+P+/6SLCN6PaUO2v+Oq09Jvg3sVJ3QidZkNuA2ruVfFpjx81F+wOLnR5g12IxeXLzbtfR07FfR3rE2sc7xM+ZzsblgmwbKaRllXSPt5IV9eP8lNV3B+RCvhj5GQcpbA7o5a48DRwzGsyjULUyx3Tg/JtyR2BLoA0OV7crsKKvFOyK1tMg+z3nBec+VvUfRZ94RscmuqhQPQ7PxaVXSPtcgc12IpaDGdHK6fQW5gUdNMWIPpG7G7xodGvP+t6TjnUpCOrjrmH7vgJ2+99S25eInh9HXbAf31d/UGx5d85An1x5gZ8V/m9i6IYb39/+W0V1+IPz6snPCi9V1fUoGNRne4/jNR/vFl0+rJr2x9VtBvgw0e3qta4b8D6pROaPVOX+xuv/w1kZ3DhztQK/Ymfc4pF4f+f8LOeTeqWqDKyImADpQnNgzL5SvrEO4GfV+4ur2EGnlgWcmVZidOtU5INu4L6RvtmK/PxAK9eD5y0FuqONVUZy2VtwzuM72ClWqT3n7H9tOQJNR+AV+cRVn9nCbgSlZroOHFGnZyL3yJfVmsMG+UynH5zvPi/h2tFfvHxMULn1e2dKJCr5pmcKpjzblhXb2qeK0VbY21izWS+IdcnA+aZmT7p92Jq1U0J6pGmzvhuMYyoYlhgOu+pCHN6Z21L19bdouNQ9Du+ftEsfwcfQ03nNZDmyxxMCu4lj/9t2b2K4K5Xy5aM04smAqTwE4iXpsH6/v6i+R69TrQdIMCVmrj0eJ5dw+mlK2fD4/lj7fc7FkIrc/RxiLZedtdhA26yzfLnDK8gPE+E6u7PVMeayw3o8TsFTa+mGfKs8J+uFHDL3J4IrQ9/cx/NpQz7KfjYxLLpbueguYyT8b6myO1HYK9crnZbnD0z/AsezF5JfWDs9MW67PzxXZqeEdlXL2C4rzFVmpz55gpdZhR1mZ9V9exgikOQ/bEKyTRwxywLjcI0eU+vr+oxRvbqnQYOssWekLIXcGq5qz9OlT/VaUmdnGviPt5Sg4BbuNsmqTXKvXJ+ktbM0Rj1cZcklBlNUs3GJ9U3FqhvTDRe3KPPaj1SoF1BZYlZkL55vZglUPixvkbnd/xx5ua+NqWtr2N72PKaY+82WJG2H2XU5ZqI7RU6VSiV1yMiZPgW2Wk2h6q7epZRxVrbDYmV6mEDZ20kqOZpZkuVebngvddHfrup/qxAqLEwl6FWk/7xvA9aDczP8SPZqHDPZo+qY5XWJ+PWiP+PqnTUtY3nb7eW65hMe5B6bA+Nv9HzLpuDFkqTK47bjsQJOC2M/Nxwr1rtDL3a9jOyIrPYpU+M2oPMp+LmMZZQGlsX1R4PE5acqN1O0mMbd/jM5lqU3uyWj5tl6w4NffEfpM7pHmf5VpdLUtm8k09tm7Je83lKTuZoHwF37tsMX/dKNrCSP3dXwDN2p+n8NnkYjz0NuB6Z/qPEr0TOV8fa6tfjUmBlNYW30jvpNQOj7q36k6+yX35Ovj5vv7KLsy/OGt82jzoIUGXXduh80SLtAb0nlN7w0Qmbz/Grmv/qblInC3qO8nrPThAX8L8vkHeuXLyQfZdDDrWy/dAglDL8H8FY82kjHaVY6yGlckPhKcZhOuT9VfzfUU3DrIcmIirXG9P9mKrgV2jfUjVOpnGvWozWD7wtOAv0zu43kA+ZHkpgt80jF88so99Vge86WHrpB0V92bTvy8fS/zriwht5Vm8XcLzzF89cTrjv6sFzTbFsQ2Mf8/lDUZvCwJ77RP1epvkhT/5Mmpc2t0fwxI6yAVcHtI1UmKrr2yZBf/AxV0RZ0b6G8gZz9K0HnOmLk7NzPUt2efThn4GnpFfckjAHvXZQ5dz4rA/joOhX4dc/ZbhpYfWc1zlv+tdZle4hPjE2ZhXfP2eLhWdsmG+dXOwT1CzBz/NBZq0cno6KPVozbV+ypcKr8PUozDPTAAuY3ryq3DtrTTs5blq9BjjmJsoKjKf44QjFWw9jvG5K4w9tTfZucTv50L9kZzzL7B5oPCcxtiqaVb5Of2l9CkTDnsK9N4tq1AqAecK1TnifRzQ8Kh6xLQOVzeG68ZFdj5Y1SscDpx9QHiJ5xyyOB8iPNR/jKHxZY7bMXiRzU4Rn9K7jK1S7EuJpejI/LGHdXeoZsLOJq9LtbI12nYQu6s3yHw1oO2fS6Pc+iNkUe51DibXcZ/zMwc53hbgqsOiNUNLtuHgCcqPPfi/4zw8wByIHiI7IDoUrhXPKXAHk5FPdv6o6q0Wqz5zYrBrQZLHQWhF5wZRT25KmyZ2Fzvck9sxJX0mv87B9URrXj4bgyWHo24txMumXcSpKrCN8J1WGV1cDSXHPsOZrTwj6I5n9eCPiCcpt5TUE78lBIPq5mBf0zEid0dQU+YZ9FlUL/G6dfYRYVeeZ9vDPpgXIfDMTNZ4wdE6s2NWgn+uDXvT3P7b9atKZfS4NqH92TLD+72oSy2u5pxOBbCD8N+QdVRkEwwAqjcZQ7ibKZzkHgL6OfX38+MI/tZEOHDC11CXy7eC3ZuzXns5aB8rKXr0EoPymS6NZROvgU6YdpQk/NxLOHb0xYrm1Cv4jwq8FiPb7z/P1J+y6wa6RvnuQHaJ9pU1PZ4LVyyec0S4reGyJZr7AKhYr6M8uRQ+7RfYHKh5w34g6EVUpapz6vO5LPS2ssvtjOwtCBH13D9y1OcBz68fw3U51FXTskT8cyxkVzXZx61UgY5d55QceFPdZfA6s/fYl85RuyCBPoTeAf4ZVxeWT+rYRtUupOfgm9us+tvvgnP9W+p6yNY17hpg7YFwrbkKuF6Qnq2z1Z2BHTk7pNLCrwaV3d9MbMgj5sWW3OILU8LB0YZ/PejXh/aLJrs4eKRM1a2S/1Hu2R6MT3HthmZzIr+QG2Ckjkfi6RRzR9c+PFi4eJYSLzsbNjwe4bjjpn6VOgrw77MiCbv0dMZya2rOvh2y7T9wtMJm79AK/JeiFZrO5zVYPFPiPnVPWtcmb1CVOoYoFVTfz1Lmu5PkXLjZnt2dSYzucCccntkNSkgI7rmsPvZBrsUBn0ueLrpiKZQMbA9Qk3r3eRwxoz85qlfgVXqd78pwG6B/d7x0XJL+mr/wkuyJ24j3HApieApYHz3D3yQz+X1uWQHbG/6qZb+jkXhZ+lu6o0OkvWbbfLUQ0TdFXypqfydPaHfHEb13eEVjU5nXoJeHvwwTmR8jv5w48NcMr4hzJm4pqs+LQmcD4eOp2aP/s1aLhYWBce+YcT1zsbOScM2WN6EvRHzvSM/jphQctcDg==')`,
        }}
        onClick={handleCafeClick}
    >
        {animals.map((animal) => (
          <button
            key={animal.id}
            className="absolute"
            style={{ 
                top: `${animal.y}%`, 
                left: `${animal.x}%`, 
                transform: 'translate(-50%, -50%)',
                zIndex: Math.round(animal.y) + 20, // ensure animals are above tables
                filter: (animal.isHidden && !animal.isFound) ? 'brightness(0.5)' : 'none',
                transition: 'filter 0.3s'
             }}
            onClick={() => handleAnimalClick(animal.id)}
            aria-label={animal.isHidden ? 'A hidden dog' : 'A wandering cat'}
          >
            <AnimalComponent animal={animal} />
          </button>
        ))}

        {allFound && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 pointer-events-none z-50">
                <div className="text-center p-8 rounded-lg bg-secondary shadow-2xl">
                    <h3 className="text-3xl font-headline text-primary mb-2">Dog Spotter!</h3>
                    <p className="text-muted-foreground">You've found all the shy puppies. The café is now full of barks and purrs.</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
