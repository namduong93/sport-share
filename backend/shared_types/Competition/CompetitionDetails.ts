export interface SiteLocation {
  universityId: number;
  universityName: string;
  siteId?: number;
  defaultSite: string;
}

export interface OtherSiteLocation {
  universityName: string;
  siteId?: number;
  defaultSite: string;
}

export interface CompetitionInformation {
  information: string;
  name: string;
  region: string;
  // timeZone: string;
  startDate: Date;
  earlyRegDeadline?: Date;
  generalRegDeadline: Date;
  code: string;
  siteLocations: SiteLocation[];
  otherSiteLocations?: OtherSiteLocation[];
}
