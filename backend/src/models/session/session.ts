
/**
 * Represents a user session.
 */
export interface Session {
  sessionId: string;
  createdAt: EpochTimeStamp; // seconds since epoch
  userId: number;
};

export const sessionExpirationTime = 60 * 60 * 24 * 7; // 7 days