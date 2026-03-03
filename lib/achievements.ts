import { createClient } from "@/lib/supabase/client";
import { logAchievementUnlocked } from "./activityLogging";

interface AchievementDefinition {
  type: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  points: number;
}

// Achievement definitions
const ACHIEVEMENTS: Record<string, AchievementDefinition> = {
  first_lesson: {
    type: "first_lesson",
    title: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    category: "learning",
    points: 10,
  },
  lessons_10: {
    type: "lessons_10",
    title: "Dedicated Learner",
    description: "Complete 10 lessons",
    icon: "📚",
    category: "learning",
    points: 50,
  },
  lessons_50: {
    type: "lessons_50",
    title: "Knowledge Seeker",
    description: "Complete 50 lessons",
    icon: "🎓",
    category: "learning",
    points: 200,
  },
  level_5: {
    type: "level_5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: "⭐",
    category: "level",
    points: 25,
  },
  level_10: {
    type: "level_10",
    title: "Skilled Scholar",
    description: "Reach level 10",
    icon: "🌟",
    category: "level",
    points: 100,
  },
  level_20: {
    type: "level_20",
    title: "Master Learner",
    description: "Reach level 20",
    icon: "👑",
    category: "level",
    points: 500,
  },
  first_challenge: {
    type: "first_challenge",
    title: "Challenge Accepted",
    description: "Complete your first challenge",
    icon: "🏆",
    category: "challenges",
    points: 20,
  },
  challenges_10: {
    type: "challenges_10",
    title: "Challenge Champion",
    description: "Complete 10 challenges",
    icon: "🥇",
    category: "challenges",
    points: 150,
  },
  perfect_quiz: {
    type: "perfect_quiz",
    title: "Perfect Score",
    description: "Get 100% on a quiz",
    icon: "💯",
    category: "quizzes",
    points: 30,
  },
  streak_7: {
    type: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    category: "streaks",
    points: 100,
  },
};

/**
 * Checks and awards an achievement if not already earned
 */
export async function checkAndAwardAchievement(
  userId: string,
  achievementType: string
): Promise<boolean> {
  try {
    const supabase = createClient();

    // Check if already earned
    const { data: existing } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", userId)
      .eq("badge_id", achievementType)
      .maybeSingle();

    if (existing) {
      return false; // Already earned
    }

    const achievement = ACHIEVEMENTS[achievementType];
    if (!achievement) {
      console.warn(`Unknown achievement type: ${achievementType}`);
      return false;
    }

    // Award the achievement
    const { error } = await supabase.from("user_badges").insert({
      user_id: userId,
      badge_id: achievement.type,
    });

    if (error) {
      console.error("Failed to award achievement:", error);
      return false;
    }

    // Log the achievement
    await logAchievementUnlocked(userId, achievement.type, achievement.title);

    return true; // Newly earned
  } catch (error) {
    console.error("Error checking/awarding achievement:", error);
    return false;
  }
}

/**
 * Check and award achievements based on lesson completion count
 */
export async function checkLessonAchievements(
  userId: string,
  lessonsCompleted: number
): Promise<void> {
  if (lessonsCompleted === 1) {
    await checkAndAwardAchievement(userId, "first_lesson");
  }
  if (lessonsCompleted === 10) {
    await checkAndAwardAchievement(userId, "lessons_10");
  }
  if (lessonsCompleted === 50) {
    await checkAndAwardAchievement(userId, "lessons_50");
  }
}

/**
 * Check and award achievements based on level
 */
export async function checkLevelAchievements(
  userId: string,
  level: number
): Promise<void> {
  if (level >= 5) {
    await checkAndAwardAchievement(userId, "level_5");
  }
  if (level >= 10) {
    await checkAndAwardAchievement(userId, "level_10");
  }
  if (level >= 20) {
    await checkAndAwardAchievement(userId, "level_20");
  }
}

/**
 * Check and award achievements based on challenge completion count
 */
export async function checkChallengeAchievements(
  userId: string,
  challengesCompleted: number
): Promise<void> {
  if (challengesCompleted === 1) {
    await checkAndAwardAchievement(userId, "first_challenge");
  }
  if (challengesCompleted === 10) {
    await checkAndAwardAchievement(userId, "challenges_10");
  }
}

/**
 * Check and award perfect quiz achievement
 */
export async function checkQuizAchievements(
  userId: string,
  accuracy: number
): Promise<void> {
  if (accuracy === 100) {
    await checkAndAwardAchievement(userId, "perfect_quiz");
  }
}

/**
 * Check and award streak achievements
 */
export async function checkStreakAchievements(
  userId: string,
  streak: number
): Promise<void> {
  if (streak >= 7) {
    await checkAndAwardAchievement(userId, "streak_7");
  }
}
