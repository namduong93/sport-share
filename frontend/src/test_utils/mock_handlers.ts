import { http, HttpResponse } from 'msw';
import { backendURL } from '../../config/backendURLConfig';
import { CourseCategory } from '../../shared_types/University/Course';
import { StaffAccess, StaffInfo } from '../../shared_types/Competition/staff/StaffInfo';
import { UserAccess } from '../../shared_types/User/User';
import { CompetitionRole } from '../../shared_types/Competition/CompetitionRole';
import { Notification } from '../components/page_header/components/NotificationButton';
import { CompetitionInformation } from '../../shared_types/Competition/CompetitionDetails';
import { StudentInfo } from '../../shared_types/Competition/student/StudentInfo';
import { CompetitionLevel } from '../../shared_types/Competition/CompetitionLevel';
import { AttendeesDetails } from '../../shared_types/Competition/staff/AttendeesDetails';
import { CompetitionSite, CompetitionSiteCapacity } from '../../shared_types/Competition/CompetitionSite';
import { ParticipantTeamDetails, TeamDetails } from '../../shared_types/Competition/team/TeamDetails';
import { TeamStatus } from '../../shared_types/Competition/team/TeamStatus';
import { testStudent } from './testStudent';
import { Announcement } from '../../shared_types/Competition/staff/Announcement';
import { testCompDetails } from './testCompDetails';
import { EditRego } from '../../shared_types/Competition/staff/Edit';
import { Competition } from '../screens/dashboard/Dashboard';
import { testTeam } from './testTeam';

export const handlers = [

  http.get(`${backendURL.HOST}:${backendURL.PORT}/user/type`, async () => {

    const res = HttpResponse.json({ type: 'system_admin' }, { status: 200 });
    return res;
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/students/rego_toggles`, async () => {
    return HttpResponse.json({
      regoFields: {
        enableCodeforcesField: true,
        enableNationalPrizesField: true,
        enableInternationalPrizesField: true,
        enableRegionalParticipationField: true,
      }
    });
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/university/courses`, async () => {
    return HttpResponse.json({
      courses: [
        {
          category: CourseCategory.Introduction, courseName: '1511',
        },
        {
          category: CourseCategory.DataStructures, courseName: '2521',
        },
        {
          category: CourseCategory.AlgorithmDesign, courseName: '3121',
        },
        {
          category: CourseCategory.ProgrammingChallenges, courseName: '4128'
        }
      ]}
    );
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/user/staff_requests`, async () => {
    return HttpResponse.json<{staffRequests: Array<StaffInfo>}>({
      staffRequests: [
        {
          userId: 1,
          universityId: 1,
          universityName: 'UNSW',
          name: 'person 1 name',
          email: 'person1@example.com',
          sex: 'M',
          pronouns: 'he/him',
          tshirtSize: 'MXL',
          allergies: '',
          dietaryReqs: '',
          accessibilityReqs: '',
          userAccess: UserAccess.Pending,
          
          bio: 'person 1 bio',
          roles: [CompetitionRole.Coach],
          access: StaffAccess.Pending
        },
        {
          userId: 2,
          universityId: 2,
          universityName: 'UNSW',
          name: 'person 2 name',
          email: 'person2@example.com',
          sex: 'M',
          pronouns: 'he/him',
          tshirtSize: 'MXL',
          allergies: '',
          dietaryReqs: '',
          accessibilityReqs: '',
          userAccess: UserAccess.Pending,
          
          bio: 'person 2 bio',
          roles: [CompetitionRole.Coach],
          access: StaffAccess.Pending
        },
      ]
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/user/notifications`, async () => {

    return HttpResponse.json<Notification[]>(
      [
        {
          id: 1,
          type: 'name',
          message: 'msg',
          createdAt: new Date(),
        }
      ]
    )
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/details`, async () => {
    return HttpResponse.json<{ competition: CompetitionInformation }>({
      competition: {
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
      }
    });
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/students`, async () => {
    return HttpResponse.json<{ students: Array<StudentInfo> }>({
      students: [
        testStudent
      ]
    });
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/attendees`, async () => {
    return HttpResponse.json<{ attendees: Array<AttendeesDetails> }>({
      attendees: [
        {
          userId: 1,
          universityId: 1,
          universityName: 'test uni',
          name: 'test name',
          preferredName: 'test preferred name',
          email: 'test@example.com',
          sex: 'M',
          tshirtSize: 'MXL',
          dietaryNeeds: '',
          accessibilityNeeds: '',
          allergies: '',
          teamSeat: 'Bongo11',

          roles: [CompetitionRole.Participant],

          siteId: 1,
          pendingSiteId: 1,
          siteName: 'test site',
          pendingSiteName: 'test pending site',
          siteCapacity: 100,
          pendingSiteCapacity: 200,
        }
      ]
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/staff`, async () => {
    
    return HttpResponse.json<{ staff: Array<StaffInfo> }>({
      staff: [
        {
          userId: 1,
          universityId: 1,
          universityName: 'test uni',
          name: 'person 1 name',
          email: 'person1@example.com',
          sex: 'M',
          pronouns: 'he/him',
          tshirtSize: 'MXL',
          allergies: '',
          dietaryReqs: '',
          accessibilityReqs: '',
          userAccess: UserAccess.Pending,
          
          bio: 'person 1 bio',
          roles: [CompetitionRole.Coach],
          access: StaffAccess.Pending
        },
        {
          userId: 2,
          universityId: 2,
          universityName: 'test uni',
          name: 'person 2 name',
          email: 'person2@example.com',
          sex: 'M',
          pronouns: 'he/him',
          tshirtSize: 'MXL',
          allergies: '',
          dietaryReqs: '',
          accessibilityReqs: '',
          userAccess: UserAccess.Pending,
          
          bio: 'person 2 bio',
          roles: [CompetitionRole.Coach],
          access: StaffAccess.Pending
        },
      ]
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/sites`, async () => {
    return HttpResponse.json<{ sites: Array<CompetitionSite> }>({
      sites: [
        {
          id: 1,
          name: 'test site'
        }
      ]
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/universities/list`, async () => {
    return HttpResponse.json<{ universities: Array<{ id: number, name: string }> }>({
      universities: [
        {
          id: 1,
          name: 'test uni',
        }
      ]
    });
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/roles`, async () => {
    return HttpResponse.json<{ roles: Array<CompetitionRole> }>({
      roles: [
        CompetitionRole.Admin
      ]
    });
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/teams`, async () => {
    return HttpResponse.json<{ teamList: Array<TeamDetails> }>({
      teamList: [
        {
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
        }
      ]
    });
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/user/profile_info`, async () => {
    return HttpResponse.json({
      role: 'staff',
      profilePic: 'test profilepic',
      name: 'test name',
      preferredName: 'test preferred name',
      email: 'test@example.com',
      affiliation: 'test affiliation',
      gender: 'Male',
      pronouns: 'He/Him',
      tshirtSize: 'MXL',
      allergies: '',
      dietaryReqs: 'test chicken nuggets',
      accessibilityReqs: ''
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/images/:imageName`, async () => {
    return new HttpResponse('test img', {
      status: 200,
      headers: { 'Content-Type': 'image/png' }
    });
  }),

  http.put(`${backendURL.HOST}:${backendURL.PORT}/competition/student/team_name_change`, async () => {
    return HttpResponse.json({}, { status: 200 });
  }),

  http.put(`${backendURL.HOST}:${backendURL.PORT}/competition/student/site_change`, async () => {
    return HttpResponse.json({}, { status: 200 });
  }),

  http.post(`${backendURL.HOST}:${backendURL.PORT}/competition/student/withdraw`, async () => {
    return HttpResponse.text('code1234', { status: 200 });
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/site/capacity`, async () => {
    return HttpResponse.json<{ site: CompetitionSiteCapacity[] }>({
      site: [
        {
          id: 1,
          capacity: 100
        }
      ]}
    )
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/staff/details`, async () => {
    return HttpResponse.json<{ staffDetails: StaffInfo }>({
      staffDetails: {
        userId: 1,
        universityId: 1,
        universityName: 'test uni',
        name: 'test name',
        email: 'test@example.com',
        sex: 'Male',
        pronouns: 'He/Him',
        tshirtSize: 'MXL',
        allergies: '',
        dietaryReqs: '',
        accessibilityReqs: '',
        userAccess: UserAccess.Accepted,

        bio: 'test bio',
        roles: [CompetitionRole.Coach],
        access: StaffAccess.Accepted,
      }
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/announcement`, async () => {
    return HttpResponse.json<{ announcement: Announcement }>({
      announcement: {
        competitionId: 1,
        userId: 1,
        message: 'test announcement',
        createdAt: Date.now(),
        universityId: 1,
      }
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/information`, async () => {
    return HttpResponse.json<{ compInfo: CompetitionInformation }>({
      compInfo: testCompDetails
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/staff/rego_toggles`, async () => {
    return HttpResponse.json<{ regoFields: EditRego }>({
      regoFields: {
        enableCodeforcesField: true,
        enableInternationalPrizesField: true,
        enableNationalPrizesField: true,
        enableRegionalParticipationField: true
      }
    })
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competitions/list`, async () => {
    return HttpResponse.json<{ competitions: Competition[] }>(
      {
        competitions: [
          {
            compId: '1',
            compName: 'test comp',
            compCreatedDate: '2024-09-23',
            compDate: '2025-09-23',
            location: 'Australia',
            roles: [CompetitionRole.Admin, CompetitionRole.SiteCoordinator, CompetitionRole.Coach],
          }
        ]
      }
    )
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/student/details`, () => {
    return HttpResponse.json<{ studentDetails: StudentInfo }>({
      studentDetails: testStudent
    });
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/team/details`, () => {
    return HttpResponse.json<ParticipantTeamDetails>(testTeam)
  }),

  http.get(`${backendURL.HOST}:${backendURL.PORT}/competition/team/invite_code`, () => {
    return HttpResponse.json<{ code: string }>(
      {
        code: 'code1234'
      }
    )
  }),
]