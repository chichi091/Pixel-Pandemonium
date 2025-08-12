'use client';

import { cn } from "@/lib/utils";

interface Animal {
  id: number;
  type: 'cat' | 'dog';
  x: number; 
  y: number;
  vx: number;
  vy: number;
  color: string;
  isHidden?: boolean;
  isFound?: boolean;
}

export function NewCatIcon({ animal }: { animal: Animal }) {
  const isWalking = Math.abs(animal.vx) > 0.1 || Math.abs(animal.vy) > 0.1;

  return (
    <div className={cn("animal-wrapper", isWalking && "walk")}>
      <div className={cn("animal", animal.vx < 0 ? 'face-left' : 'face-right')}>
        <div className="animal-head" style={{ top: '-25px' }}>
          <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 76.4 61.2" >
              <polygon className="eyes" points="63.8,54.1 50.7,54.1 50.7,59.6 27.1,59.6 27.1,54.1 12.4,54.1 12.4,31.8 63.8,31.8 " style={{ fill: 'rgb(1, 143, 96)' }}/>
              <path d="M15.3,45.9h5.1V35.7h-5.1C15.3,35.7,15.3,45.9,15.3,45.9z M45.8,56.1V51H30.6v5.1H45.8z M61.1,35.7H56v10.2h5.1
                V35.7z M10.2,61.2v-5.1H5.1V51H0V25.5h5.1V15.3h5.1V5.1h5.1V0h5.1v5.1h5.1v5.1h5.1v5.1c0,0,15.2,0,15.2,0v-5.1h5.1V5.1H56V0h5.1v5.1
                h5.1v10.2h5.1v10.2h5.1l0,25.5h-5.1v5.1h-5.1v5.1H10.2z" style={{ fill: animal.color }}/>
            </svg>
        </div>
        <div className="animal-body">
          <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 91.7 40.8" >
            <path d="M91.7,40.8H0V10.2h5.1V5.1h5.1V0h66.2v5.1h10.2v5.1h5.1L91.7,40.8z" style={{ fill: animal.color }}/>
          </svg>
           <div className="animal-tail">
            <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 25.5 61.1" >
              <polygon points="10.2,56 10.2,50.9 5.1,50.9 5.1,40.7 0,40.7 0,20.4 5.1,20.4 5.1,10.2 10.2,10.2 10.2,5.1 15.3,5.1 
                15.3,0 25.5,0 25.5,10.2 20.4,10.2 20.4,15.3 15.3,15.3 15.3,20.4 10.2,20.4 10.2,40.7 15.3,40.7 15.3,45.8 20.4,45.8 20.4,50.9 
                25.5,50.9 25.5,61.1 15.3,61.1 15.3,56 " style={{ fill: animal.color }}/>
            </svg>
          </div>
        </div>
        <div className="animal-front-legs">
          <div className="animal-leg leg-one">
            <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5" >
              <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " style={{ fill: animal.color }}/>
            </svg>
          </div>
          <div className="animal-leg leg-two">
            <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5" >
              <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " style={{ fill: animal.color }}/>
            </svg>
          </div>  
        </div>
        <div className="animal-back-legs">
          <div className="animal-leg leg-three">
            <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5" >
              <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " style={{ fill: animal.color }}/>
            </svg>
          </div>
          <div className="animal-leg leg-four">
            <svg x="0px" y="0px" width="100%" height="100%" viewBox="0 0 14 30.5" >
              <polygon points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0 " style={{ fill: animal.color }}/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
