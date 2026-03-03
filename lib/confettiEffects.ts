import confetti from "canvas-confetti";

/**
 * Trigger a level-up confetti celebration
 */
export const triggerLevelUpConfetti = () => {
  // Main burst
  confetti({
    particleCount: 200,
    spread: 120,
    origin: { y: 0.5 },
    colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#9370DB'],
    startVelocity: 45,
  });

  // Side bursts
  setTimeout(() => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FFD700', '#FFA500'],
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FFD700', '#FFA500'],
    });
  }, 200);
};

/**
 * Trigger a lesson completion confetti celebration
 */
export const triggerLessonCompleteConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 90,
    origin: { y: 0.6 },
    colors: ['#4CAF50', '#8BC34A', '#CDDC39'],
  });
};

/**
 * Trigger a simple success confetti
 */
export const triggerSuccessConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};
