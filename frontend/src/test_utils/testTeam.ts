import { CompetitionLevel } from "../../shared_types/Competition/CompetitionLevel";
import { TeamDetails } from "../../shared_types/Competition/team/TeamDetails";
import { TeamStatus } from "../../shared_types/Competition/team/TeamStatus";
import { CourseCategory } from "../../shared_types/University/Course";

export const testTeam: TeamDetails = {
  teamId: 1,
  universityId: 1,
  status: TeamStatus.Pending,
  teamNameApproved: false,
  
  compName: 'test comp',
  teamName: 'test team',
  teamSite: 'test team site',
  siteId: 1,
  teamSeat: 'Bongo11',
  teamLevel: CompetitionLevel.LevelB,
  startDate: new Date('2024-11-17T12:11:33.616Z'),
  students: [
    {
      userId: 1,
      name: 'test student',
      preferredName: 'test student preferred',
      sex: 'MXL',
      email: 'student@example.com',
      bio: 'test student bio',
      preferredContact: 'discord:@test',
      ICPCEligible: true,
      level: CompetitionLevel.LevelA,
      boersenEligible: false,
      isRemote: false,
      universityCourses: [CourseCategory.Introduction],
      nationalPrizes: '',
      internationalPrizes: '',
      codeforcesRating: 0,
      pastRegional: false
    }
  ],
  coach: {
    name: 'test coach',
    email: 'coach@example.com',
    bio: 'test coach bio'
  }
};