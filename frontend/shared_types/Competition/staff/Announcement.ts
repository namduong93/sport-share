export interface Announcement {
  competitionId: number;
  userId?: number;
  message: string; // To update the announcement, FE just need to pass the new message
  createdAt: EpochTimeStamp;
  universityId: number;
}

