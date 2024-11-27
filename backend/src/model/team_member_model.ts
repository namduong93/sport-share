import { PlayerStats, validatePlayerStats } from "./player_stats_model";

// Team member interface model
export interface TeamMember {
    teamId: string;
    meta: string;
    uuid: string;
    firstName: string;
    lastName: string;
    preferredName?: string;
    email: string;
    mobile: string;
    image?: string;
    credit: number;
    role: string;
    playerStats: PlayerStats;
    createdAt: Date;
    modifiedAt: Date;
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

    if (!teamMember.firstName || teamMember.lastName.length === 0) {
        return "name is required";
    }

    if (!teamMember.email || teamMember.email.length === 0) {
        return "email is required";
    }

    if (!teamMember.mobile || teamMember.mobile.length === 0) {
        return "mobile is required";
    }

    if (teamMember.credit === undefined || teamMember.credit === null || typeof teamMember.credit !== 'number' || teamMember.credit < 0) {
        return "credit is required";
    }
    
    if (!teamMember.role || roleNames.indexOf(teamMember.role) === -1){
        return "valid role is required";
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