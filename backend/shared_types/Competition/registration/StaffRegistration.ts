import { CompetitionRole } from '../CompetitionRole';

export interface StaffRegistration {
  roles: CompetitionRole[];
  capacity?: number;
  site?: {
    id: number;
    name: string;
    capacity?: number;
  };
  institution?: {
    id: number;
    name: string;
  };
  competitionBio?: string;
}

export interface University {
  id: string;
  name: string;
}
