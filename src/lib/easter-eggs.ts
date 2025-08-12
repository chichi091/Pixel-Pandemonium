
export const ALL_EASTER_EGGS = ['secret_room', 'soundboard', 'right_side', 'potato_link_1', 'potato_link_2', 'colored_coffee', 'screen_flip', 'kpop_corner'];

export const addEasterEgg = (egg: string, onAllFound: () => void) => {
    try {
      const foundEggs = JSON.parse(localStorage.getItem('foundEasterEggs') || '[]');
      if (!foundEggs.includes(egg)) {
        const newFoundEggs = [...foundEggs, egg];
        localStorage.setItem('foundEasterEggs', JSON.stringify(newFoundEggs));
        onAllFound();
      }
    } catch (error) {
      console.error("Failed to save easter egg to localStorage", error);
    }
  };

export const checkAllEasterEggsFound = (
    addAchievement: (id: string) => void
    ) => {
    try {
      const foundEggs = JSON.parse(localStorage.getItem('foundEasterEggs') || '[]');
      const currentAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
      
      const allFound = ALL_EASTER_EGGS.every(egg => foundEggs.includes(egg));

      if (allFound && !currentAchievements.includes('Chaos Coordinator')) {
        addAchievement('Chaos Coordinator');
      }
    } catch (error) {
      console.error("Failed to check easter eggs in localStorage", error);
    }
  };

