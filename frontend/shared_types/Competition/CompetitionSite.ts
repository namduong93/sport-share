import { TeamDetails } from "./team/TeamDetails";

export interface CompetitionSite {
  id: number;
  name: string;
}

export interface SiteDetails extends CompetitionSite {
  levelGroups: LevelGroup[]
}

interface LevelGroup {
  level: string;
  teams: TeamDetails[];
}

export interface CompetitionSiteCapacity {
  id: number;
  capacity: number;
}