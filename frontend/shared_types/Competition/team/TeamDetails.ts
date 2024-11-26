import { TeamStatus } from "./TeamStatus";

export interface Student {
  userId: number;
  name: string;
  preferredName: string;
  sex: string;
  email: string;
  bio: string;
  preferredContact: string;
  ICPCEligible: boolean;
  level: string;
  boersenEligible: boolean;
  isRemote: boolean;
  universityCourses: Array<string>;
  nationalPrizes: string;
  internationalPrizes: string;
  codeforcesRating: number;
  pastRegional: boolean;
}

export interface ParticipantTeamDetails {
  compName: string;
  teamName: string;
  teamSite: string;
  siteId: number;
  teamSeat?: string;
  teamLevel: string;
  startDate: Date;
  students: Array<Student>;
  coach: {
    name: string;
    email: string;
    bio: string;
  }
}

export interface TeamDetails extends ParticipantTeamDetails {
  teamId: number;
  universityId: number;
  status: TeamStatus;
  teamNameApproved: boolean;
};