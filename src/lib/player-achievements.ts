// This function is intended to be callable from both client and server components,
// but it relies on localStorage, which is client-side only.
// It should only be called from 'use client' components.

const addAchievement = (achievement: string) => {
    if (typeof window === 'undefined') return;
    try {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (!achievements.includes(achievement)) {
            const newAchievements = [...achievements, achievement];
            localStorage.setItem('achievements', JSON.stringify(newAchievements));
            // Dispatch a storage event to notify other components (like the main page)
            // that an achievement has been added so it can handle the toast.
            window.dispatchEvent(new Event('storage'));
        }
    } catch (error) {
        console.error("Failed to save achievement", error);
    }
};

export function updatePlayerWinCount(winner: 'Thing 1' | 'Thing 2') {
    if (typeof window === 'undefined') return { 'Thing 1': 0, 'Thing 2': 0 };
    try {
        const counts = JSON.parse(localStorage.getItem('player-win-counts') || '{"Thing 1": 0, "Thing 2": 0}');
        counts[winner]++;
        localStorage.setItem('player-win-counts', JSON.stringify(counts));

        if (counts['Thing 1'] >= 3) {
            addAchievement('Thing 1 Supremacy');
        }
        if (counts['Thing 2'] >= 3) {
            addAchievement('Thing 2 Domination');
        }

        return counts;

    } catch (error) {
        console.error('Failed to update win counts', error);
        return { 'Thing 1': 0, 'Thing 2': 0 };
    }
};

export function getPlayerWinCounts() {
    if (typeof window === 'undefined') return { 'Thing 1': 0, 'Thing 2': 0 };
    try {
        const counts = localStorage.getItem('player-win-counts');
        return counts ? JSON.parse(counts) : { 'Thing 1': 0, 'Thing 2': 0 };
    } catch (error) {
        console.error('Failed to get win counts', error);
        return { 'Thing 1': 0, 'Thing 2': 0 };
    }
};

export function resetPlayerWinCounts() {
    if (typeof window === 'undefined') return { 'Thing 1': 0, 'Thing 2': 0 };
    try {
        const resetCounts = { 'Thing 1': 0, 'Thing 2': 0 };
        localStorage.setItem('player-win-counts', JSON.stringify(resetCounts));
        // We don't use the custom useToast hook here because this can be a server action.
        // For now, we will rely on UI feedback from the win counts resetting.
        return resetCounts;
    } catch (error) {
        console.error('Failed to reset win counts', error);
        return { 'Thing 1': 0, 'Thing 2': 0 };
    }
};
