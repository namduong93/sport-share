import { OtherSiteLocation, SiteLocation } from '../../../shared_types/Competition/CompetitionDetails';
import { CompetitionUserRole } from './competitionUser';

/**
 * Represents a competition.
 */
export interface Competition {
  id?: number,
  name: string,
  teamSize?: number,
  createdDate: EpochTimeStamp,
  earlyRegDeadline: EpochTimeStamp,
  startDate: EpochTimeStamp;
  generalRegDeadline: EpochTimeStamp,
  siteLocations?: SiteLocation[],
  otherSiteLocations?: OtherSiteLocation[],
  code?: string,
  region: string,
  information?: string,
}

export interface CompetitionInput {
  id?: number,
  name: string,
  teamSize?: number,
  createdDate: EpochTimeStamp,
  earlyRegDeadline: EpochTimeStamp,
  startDate: EpochTimeStamp;
  generalRegDeadline: EpochTimeStamp,
  siteLocations?: CompetitionSiteObject[],
  otherSiteLocations?: CompetitionSiteObject[],
  code?: string,
  region: string,
  information?: string,
}

/**
 * Enum representing different levels of competition.
 */
export enum CompetitionLevel {
  LEVELA = 'Level A',
  LEVELB = 'Level B',
  NOPREFERENCE = 'No Preference'
}

// Client is ICPC South Pacific, so default region is Australia.
export const DEFAULT_COUNTRY = 'Australia';


/**
 * Represents an object containing a competition ID.
 */
export type CompetitionIdObject = { competitionId: number };

/**
 * Represents a short details for a competition.
 */
export type CompetitionShortDetailsObject = { 
  compId: number,
  compName: string,
  location: string,
  compDate: string,
  roles: CompetitionUserRole[],
  compCreatedDate: string
 };

/**
 * Represents an a normal site associated with a university.
 */
export type CompetitionSiteObject = { id: number, name: string, universityId?: number, capacity?: number };

/**
 * Represents an object containing a site that does not belong to a university.
 */
export type CompetitionOtherSiteObject = { universityName: number, name: string, capacity?: number };

/**
 * Represents an object containing a team name.
 */
export type CompetitionTeamNameObject = { teamName: string };

/**
 * A return object for the competition withdrawal that gives competition code to return to frontend and compName, teamId, and teamName to generate relevant notifications
 */
export type CompetitionWithdrawalReturnObject = { competitionCode: string, competitionName: string, teamId: number, teamName: string };