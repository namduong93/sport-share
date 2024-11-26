import { CompetitionTeamNameObject, CompetitionWithdrawalReturnObject } from '../models/competition/competition.js';
import { CompetitionUser } from '../models/competition/competitionUser.js';
import { University } from '../models/university/university.js';
import './competition/SqlDbCompetitionRepository.js';
import { ParticipantTeamDetails } from '../../shared_types/Competition/team/TeamDetails.js';
import { StudentInfo } from '../../shared_types/Competition/student/StudentInfo.js';
import { EditRego } from '../../shared_types/Competition/staff/Edit.js';

export interface CompetitionStudentRepository {
  competitionStudentsRegoToggles(userId: number, code: string): Promise<EditRego>;
  competitionTeamDetails(userId: number, compId: number): Promise<ParticipantTeamDetails>;
  competitionTeamInviteCode(userId: number, compId: number): Promise<string>;
  competitionTeamJoin(userId: number, compId: number, teamCode: string, university: University): Promise<CompetitionTeamNameObject>;
  competitionStudentDetails(userId: number, compId: number): Promise<StudentInfo>;
  competitionStudentDetailsUpdate(userId: number, compId: number, studentInfo: StudentInfo): Promise<{}>;
  competitionStudentJoin(competitionUserInfo: CompetitionUser, university: University): Promise<{}>;
  competitionStudentWithdraw(userId: number, compId: number): Promise<CompetitionWithdrawalReturnObject>;
  competitionRequestSiteChange(userId: number, compId: number, newSiteId: number): Promise<number>;
}