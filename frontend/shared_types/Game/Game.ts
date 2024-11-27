// Game interface model
export interface Game {
  teamId: string;
  meta: string;
  id: string;
  location: string;
  name: string;
  description: string;
  startTime: string;
  duration: string;
  deadlineForRegistration: string;
  minAttendance: number;
  maxAttendance: number;
  going: string[];
  notGoing: string[];
  maybe: string[];
  estimatedExpense: string;
  images: string[];
  thumbnail: string;
  status: string;
  announcements: Announcement[];
  createdBy: string;
  createdAt: string;
  modifiedAt: string;
}

export const gameVotes = {
  YES: "yes",
  NO: "no",
  MAYBE: "maybe",
}

export const gameVotesArray = [gameVotes.YES, gameVotes.NO, gameVotes.MAYBE];

export interface Announcement {
  id: string;
  createdBy: string;
  announcement: string;
  createdAt: string;
}

export const gameStatus = {
  READY: "ready",
  VOTES_PENDING: "votes_pending",
  CANCELLED: "cancelled",
}

export const gameStatusArray = [gameStatus.READY, gameStatus.VOTES_PENDING, gameStatus.CANCELLED];

// Model validation
export function validate(game: Game): string {
  if (!game.teamId || game.teamId.length === 0) {
      return "teamId is required";
  }

  if (!game.location || game.location.length === 0) {
      return "location is required";
  }

  if (!game.name || game.name.length === 0) {
      return "name is required";
  }

  if (!game.startTime) {
      return "startTime is required";
  }

  if (!game.createdBy || game.createdBy.length === 0) {
      return "createdBy is required";
  }

  return "";
}

export interface GameAttendee {
  uuid: string;
  vote: string;
  name: string;
  preferredName?: string;
  image?: string;
  goals?: string;
  assists?: string;
}