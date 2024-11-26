import { CompetitionUser } from '../competition/competitionUser';

/**
 * Represents a team participating in a competition.
 */
export interface Team {
  id?: number;
  name: string;
  teamStatus: TeamStatus;
  teamNameApproved: boolean;
  teamSize: number;
  participants: Array<CompetitionUser>;
  universityId: number;
  competitionId: number;
}

/**
 * Enum representing the status of a team.
 */
export const enum TeamStatus {
  PENDING = 'Pending',
  REGISTERED = 'Registered',
  UNREGISTERED = 'Unregistered'
}

/**
 * Represents the assignment of a team to a specific seat at a site.
 */
export interface SeatAssignment {
  siteId: string; // ID of the site
  teamSite: string; // e.g. "CSE Building K17"
  teamSeat: string; // e.g. "Bongo01"
  teamId: string; // ID of team who have been assigned that seat
  teamName: string; // name of team at the assigned seat
  teamLevel: string; // level of the team
}

// Default team size for ICPC is 3
export const DEFAULT_TEAM_SIZE = 3;