/**
 * Activity logging utility.
 * The activity_log table does not exist yet, so all logging is stubbed
 * to console.log to prevent runtime errors.
 */

export type ActivityType =
  | "lesson_completed"
  | "quiz_taken"
  | "challenge_completed"
  | "level_up"
  | "streak_milestone"
  | "achievement_unlocked"
  | "daily_goal_reached"
  | "topic_mastered";

interface LogActivityParams {
  userId: string;
  activityType: ActivityType;
  relatedId?: string;
  xpEarned?: number;
  metadata?: Record<string, unknown>;
}

export async function logActivity({
  userId,
  activityType,
  relatedId,
  xpEarned = 0,
  metadata = {},
}: LogActivityParams): Promise<void> {
  // activity_log table does not exist — stub to console
  console.debug("[activity_log stub]", { userId, activityType, relatedId, xpEarned, metadata });
}

export async function logLessonCompleted(
  userId: string,
  lessonId: string,
  lessonTitle: string,
  xpEarned: number
): Promise<void> {
  await logActivity({ userId, activityType: "lesson_completed", relatedId: lessonId, xpEarned, metadata: { lesson_title: lessonTitle } });
}

export async function logQuizCompleted(
  userId: string,
  lessonId: string,
  lessonTitle: string,
  score: number,
  totalQuestions: number,
  xpEarned: number
): Promise<void> {
  await logActivity({ userId, activityType: "quiz_taken", relatedId: lessonId, xpEarned, metadata: { lesson_title: lessonTitle, score, total_questions: totalQuestions, accuracy: Math.round((score / totalQuestions) * 100) } });
}

export async function logChallengeCompleted(
  userId: string,
  sessionId: string,
  topicName: string,
  score: number,
  totalQuestions: number,
  difficulty: string,
  xpEarned: number
): Promise<void> {
  await logActivity({ userId, activityType: "challenge_completed", relatedId: sessionId, xpEarned, metadata: { topic_name: topicName, score, total_questions: totalQuestions, difficulty } });
}

export async function logLevelUp(
  userId: string,
  newLevel: number,
  totalXp: number
): Promise<void> {
  await logActivity({ userId, activityType: "level_up", xpEarned: 0, metadata: { new_level: newLevel, total_xp: totalXp } });
}

export async function logAchievementUnlocked(
  userId: string,
  achievementId: string,
  achievementTitle: string
): Promise<void> {
  await logActivity({ userId, activityType: "achievement_unlocked", relatedId: achievementId, metadata: { achievement_title: achievementTitle } });
}
