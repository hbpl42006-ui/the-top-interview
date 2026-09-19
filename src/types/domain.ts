export const USER_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "REPORTER", "VIDEO_EDITOR", "PODCAST_MANAGER", "MODERATOR"] as const;
export type UserRole = (typeof USER_ROLES)[number];
