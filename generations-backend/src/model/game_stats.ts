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

export interface GameAttendee {
    uuid: string;
    vote: string;
    name: string;
    preferredName?: string;
    image?: string;
    goals?: string;
    assists?: string;
}