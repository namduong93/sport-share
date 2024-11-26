import { CompetitionInput, CompetitionShortDetailsObject, CompetitionSiteObject } from '../models/competition/competition.js';
import { CompetitionUserRole } from '../models/competition/competitionUser.js';
import { University } from '../models/university/university.js';
import { UserType } from '../models/user/user.js';
import './competition/SqlDbCompetitionRepository.js';
import { CompetitionSite, CompetitionSiteCapacity } from '../../shared_types/Competition/CompetitionSite.js';
import { Announcement } from '../../shared_types/Competition/staff/Announcement.js';

export type CompetitionRole = 'Participant' | 'Coach' | 'Admin' | 'Site-Coordinator';

export interface CompetitionRepository {
  // All
  getUserUniversityId(userId: number): Promise<number>;
  competitionSites(compId: number): Promise<Array<CompetitionSite>>;
  competitionRoles(userId: number, compId: number): Promise<Array<CompetitionUserRole>>;
  competitionGetDetails(competitionId: number): Promise<CompetitionInput>;
  competitionUniversityDefaultSite(competitionId: number, university: University): Promise<CompetitionSiteObject>;
  competitionAnnouncement(compId: number, university: University): Promise< Announcement | undefined>;
  competitionCoachIdFromCompId(compId: number, userId: number): Promise<number>;
  competitionIdFromCode(code: string): Promise<number>;
  competitionsList(userId: number, userType: UserType): Promise<Array<CompetitionShortDetailsObject>>;
  competitionSiteCapacity(compId: number, siteIds: number[]): Promise<Array<CompetitionSiteCapacity> | undefined>;
  
  encrypt(id: number): string;
  decrypt(encoded: string): number;
}