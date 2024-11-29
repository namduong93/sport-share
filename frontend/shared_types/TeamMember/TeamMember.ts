import { PlayerStats, validatePlayerStats } from "./PlayerStats";

// Team member interface model
export interface TeamMember {
    uuid?: string;

    teamId: string;
    meta: string;
    credit: number;
    playerStats: PlayerStats;
    joinAt: Date;
    modifiedAt: Date;
    lastTimePlayed: Date;
    bio: string;
    referrer?: string;
}

export const roles = {
    ADMIN: "admin",
    MEMBER: "member",
    DEV: "developer",
}

export const roleNames = [roles.ADMIN, roles.MEMBER, roles.DEV];

// Model validation
export function validate(teamMember: TeamMember): string {
    if (!teamMember.teamId || teamMember.teamId.length === 0) {
        return "teamId is required";
    }

    if (!teamMember.uuid || teamMember.uuid.length === 0) {
        return "uuid is required";
    }

    if (teamMember.credit === undefined || teamMember.credit === null || typeof teamMember.credit !== 'number' || teamMember.credit < 0) {
        return "credit is required";
    }

    if (!teamMember.playerStats) {
        return "playerStats is required";
    } else {
        if (validatePlayerStats(teamMember.playerStats) != "") {
            return validatePlayerStats(teamMember.playerStats);
        }
    }
    return "";
}