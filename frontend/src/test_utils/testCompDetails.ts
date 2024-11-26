import { CompetitionInformation } from "../../shared_types/Competition/CompetitionDetails";

export const testCompDetails: CompetitionInformation = {
  information: 'test comp info',
  name: 'test comp',
  region: 'test land',
  startDate: new Date('2024-11-17T12:11:33.616Z'),
  earlyRegDeadline: new Date('2024-11-17T12:11:33.616Z'),
  generalRegDeadline: new Date('2024-11-17T12:11:33.616Z'),
  code: 'test1234',
  siteLocations:[{
    universityId: 1,
    universityName: 'test uni',
    siteId: 1,
    defaultSite: 'test site'
  }],
};