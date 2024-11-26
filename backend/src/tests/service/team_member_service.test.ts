// import { TeamMemberService} from "../../service/team_member_service";
// import { TeamMemberRepository} from "../../repository/team_member_repository";
// import { UserRepository } from "../../repository/user_repository";
// import { TeamMember } from "../../model/team_member_model";
// import { User } from "../../model/user_model";
// import { Position } from "../../model/player_stats_model";

// describe('TeamMemberService', () => {
//     let teamMemberService: TeamMemberService;
//     let mockTeamMemberRepository: jest.Mocked<TeamMemberRepository>;
//     let mockUserRepository: jest.Mocked<UserRepository>;

//     beforeEach(() => {
//         mockTeamMemberRepository = {
//             find: jest.fn(),
//             create: jest.fn(),
//             update: jest.fn(),
//             delete: jest.fn(),
//             list: jest.fn()
//         } as jest.Mocked<TeamMemberRepository>;

//         mockUserRepository = {
//             authenticate: jest.fn(),
//             findByEmail: jest.fn(),
//             create: jest.fn(),
//             update: jest.fn(),
//             delete: jest.fn(),
//             list: jest.fn()
//         } as jest.Mocked<UserRepository>;

//         teamMemberService = new TeamMemberService(mockTeamMemberRepository, mockUserRepository);
//     });

//     describe('find', () => {
//         it('should return team member when found', async () => {
//             const mockTeamMember: TeamMember = {
//                 teamId: '1',
//                 meta: 'mockMeta',
//                 uuid: '1',
//                 name: 'mockName',
//                 email: 'mockEmail',
//                 mobile: 'mockMobile',
//                 image: 'mockImage',
//                 credit: 0,
//                 role: 'mockRole',
//                 playerStats: {
//                     preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                     goalkeeping: 80,
//                     defense: 85,
//                     attack: 90,
//                     control: 75,
//                     physique: 80,
//                     speed: 95
//                 },
//                 createdAt: new Date(),
//                 modifiedAt: new Date()
//             };

//             mockTeamMemberRepository.find.mockResolvedValue(mockTeamMember);

//             const result = await teamMemberService.find('1', '1');

//             expect(result).toEqual(mockTeamMember);
//             expect(mockTeamMemberRepository.find).toHaveBeenCalledWith('1', '1');
//         });

//         it('should return null when team member not found', async () => {
//             mockTeamMemberRepository.find.mockResolvedValue(null);

//             const result = await teamMemberService.find('1', '1');

//             expect(result).toBeNull();
//             expect(mockTeamMemberRepository.find).toHaveBeenCalledWith('1', '1');
//         });
//     });

//     describe('create', () => {
//         it('should create a team member successfully', async () => {
//             const newTeamMember: TeamMember = {
//                 teamId: '1',
//                 meta: 'mockMeta',
//                 uuid: '1',
//                 name: 'mockName',
//                 email: 'mockEmail',
//                 mobile: 'mockMobile',
//                 image: 'mockImage',
//                 credit: 0,
//                 role: 'mockRole',
//                 playerStats: {
//                     preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                     goalkeeping: 80,
//                     defense: 85,
//                     attack: 90,
//                     control: 75,
//                     physique: 80,
//                     speed: 95
//                 },
//                 createdAt: new Date(),
//                 modifiedAt: new Date()
//             };

//             mockTeamMemberRepository.create.mockResolvedValue(newTeamMember);

//             const mockUser: User = {
//                 email: 'mockEmail',
//                 uuid: '1',
//                 token: 'mockToken',
//                 password: 'mockPassword',
//                 name: 'mockName',
//                 mobile: 'mockMobile',
//                 image: 'mockImage',
//                 createdAt: '12312',
//             }

//             mockUserRepository.findByEmail.mockResolvedValue(mockUser);

//             const result = await teamMemberService.create(newTeamMember);

//             expect(result).toEqual(newTeamMember);
//             expect(mockTeamMemberRepository.create).toHaveBeenCalledWith(newTeamMember, mockUser);
//         });

//         it('should handle failure to create a team member', async () => {
//             const newTeamMember: TeamMember = {
//                 teamId: '1',
//                 meta: 'mockMeta',
//                 uuid: '1',
//                 name: 'mockName',
//                 email: 'mockEmail',
//                 mobile: 'mockMobile',
//                 image: 'mockImage',
//                 credit: 0,
//                 role: 'mockRole',
//                 playerStats: {
//                     preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                     goalkeeping: 80,
//                     defense: 85,
//                     attack: 90,
//                     control: 75,
//                     physique: 80,
//                     speed: 95
//                 },
//                 createdAt: new Date(),
//                 modifiedAt: new Date()
//             };

//             const errorMessage = "Failed to create team member";
//             mockTeamMemberRepository.create.mockRejectedValue(new Error(errorMessage));

//             const mockUser: User = {
//                 email: 'mockEmail',
//                 uuid: '1',
//                 token: 'mockToken',
//                 password: 'mockPassword',
//                 name: 'mockName',
//                 mobile: 'mockMobile',
//                 image: 'mockImage',
//                 createdAt: '12312',
//             }

//             mockUserRepository.findByEmail.mockResolvedValue(mockUser);

//             try {
//                 await teamMemberService.create(newTeamMember);
//             } catch (error) {
//                 if (error instanceof Error) {
//                     expect(error.message).toBe(errorMessage);
//                 } else {
//                     expect (error).toBe("Unknown error");
//                 }
//             }

//             expect(mockTeamMemberRepository.create).toHaveBeenCalledWith(newTeamMember, mockUser);
//         });
//     });

//     describe('update', () => {
//         it('should update a team member successfully', async () => {
//             const updatedTeamMember: TeamMember = {
//                 teamId: '1',
//                 meta: 'mockMeta',
//                 uuid: '1',
//                 name: 'updatedMockName',
//                 email: 'updatedMockEmail',
//                 mobile: 'updatedMockMobile',
//                 image: 'updatedMockImage',
//                 credit: 100,
//                 role: 'updatedMockRole',
//                 playerStats: {
//                     preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                     goalkeeping: 80,
//                     defense: 85,
//                     attack: 90,
//                     control: 75,
//                     physique: 80,
//                     speed: 95
//                 },
//                 createdAt: new Date(),
//                 modifiedAt: new Date()
//             };

//             mockTeamMemberRepository.update.mockResolvedValue(updatedTeamMember);

//             const result = await teamMemberService.update(updatedTeamMember);

//             expect(result).toEqual(updatedTeamMember);
//             expect(mockTeamMemberRepository.update).toHaveBeenCalledWith(updatedTeamMember);
//         });

//         it('should handle failure to update a team member', async () => {
//             const updatedTeamMember: TeamMember = {
//                 teamId: '1',
//                 meta: 'mockMeta',
//                 uuid: '1',
//                 name: 'updatedMockName',
//                 email: 'updatedMockEmail',
//                 mobile: 'updatedMockMobile',
//                 image: 'updatedMockImage',
//                 credit: 100,
//                 role: 'updatedMockRole',
//                 playerStats: {
//                     preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                     goalkeeping: 80,
//                     defense: 85,
//                     attack: 90,
//                     control: 75,
//                     physique: 80,
//                     speed: 95
//                 },
//                 createdAt: new Date(),
//                 modifiedAt: new Date()
//             };

//             const errorMessage = "Failed to update team member";
//             mockTeamMemberRepository.update.mockRejectedValue(new Error(errorMessage));

//             try {
//                 await teamMemberService.update(updatedTeamMember);
//             } catch (error) {
//                 if (error instanceof Error) {
//                     expect(error.message).toBe(errorMessage);
//                 } else {
//                     expect (error).toBe("Unknown error");
//                 }
//             }

//             expect(mockTeamMemberRepository.update).toHaveBeenCalledWith(updatedTeamMember);
//         });
//     });

//     describe('delete', () => {
//         it('should delete a team member successfully', async () => {
//             mockTeamMemberRepository.delete.mockResolvedValue(true);

//             const result = await teamMemberService.delete('1', '1');

//             expect(result).toBe(true);
//             expect(mockTeamMemberRepository.delete).toHaveBeenCalledWith('1', '1');
//         });

//         it('should handle failure to delete a team member', async () => {
//             const errorMessage = "Failed to delete team member";
//             mockTeamMemberRepository.delete.mockRejectedValue(new Error(errorMessage));

//             try {
//                 await teamMemberService.delete('1', '1');
//             } catch (error) {
//                 if (error instanceof Error) {
//                     expect(error.message).toBe(errorMessage);
//                 } else {
//                     expect (error).toBe("Unknown error");
//                 }
//             }

//             expect(mockTeamMemberRepository.delete).toHaveBeenCalledWith('1', '1');
//         });
//     });

//     describe('list', () => {
//         it('should return list of team members when found', async () => {
//             const mockTeamMembers: TeamMember[] = [
//                 {
//                     teamId: '1',
//                     meta: 'mockMeta1',
//                     uuid: '1',
//                     name: 'mockName1',
//                     email: 'mockEmail1',
//                     mobile: 'mockMobile1',
//                     image: 'mockImage1',
//                     credit: 0,
//                     role: 'mockRole1',
//                     playerStats: {
//                         preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                         goalkeeping: 71,
//                         defense: 71,
//                         attack: 71,
//                         control: 71,
//                         physique: 71,
//                         speed: 71
//                     },
//                     createdAt: new Date(),
//                     modifiedAt: new Date()
//                 },
//                 {
//                     teamId: '1',
//                     meta: 'mockMeta2',
//                     uuid: '2',
//                     name: 'mockName2',
//                     email: 'mockEmail2',
//                     mobile: 'mockMobile2',
//                     image: 'mockImage2',
//                     credit: 0,
//                     role: 'mockRole2',
//                     playerStats: {
//                         preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                         goalkeeping: 72,
//                         defense: 72,
//                         attack: 72,
//                         control: 72,
//                         physique: 72,
//                         speed: 72
//                     },
//                     createdAt: new Date(),
//                     modifiedAt: new Date()
//                 }
//             ];

//             mockTeamMemberRepository.list.mockResolvedValue(mockTeamMembers);
//             mockTeamMemberRepository.find.mockResolvedValue({
//                 teamId: '1',
//                 meta: 'mockMeta',
//                 uuid: '1',
//                 name: 'mockName',
//                 email: 'mockEmail',
//                 mobile: 'mockMobile',
//                 image: 'mockImage',
//                 credit: 0,
//                 role: 'admin',
//                 playerStats: {
//                     preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                     goalkeeping: 80,
//                     defense: 85,
//                     attack: 90,
//                     control: 75,
//                     physique: 80,
//                     speed: 95
//                 },
//                 createdAt: new Date(),
//                 modifiedAt: new Date()
//             });

//             const result = await teamMemberService.list('1', '1');

//             expect(result).toEqual(mockTeamMembers);
//             expect(mockTeamMemberRepository.list).toHaveBeenCalledWith('1');
//         });

//         it('should return empty list when no team members found', async () => {
//             mockTeamMemberRepository.list.mockResolvedValue([]);
//             mockTeamMemberRepository.find.mockResolvedValue({
//                 teamId: '1',
//                 meta: 'mockMeta',
//                 uuid: '1',
//                 name: 'mockName',
//                 email: 'mockEmail',
//                 mobile: 'mockMobile',
//                 image: 'mockImage',
//                 credit: 0,
//                 role: 'admin',
//                 playerStats: {
//                     preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
//                     goalkeeping: 80,
//                     defense: 85,
//                     attack: 90,
//                     control: 75,
//                     physique: 80,
//                     speed: 95
//                 },
//                 createdAt: new Date(),
//                 modifiedAt: new Date()
//             });

//             const result = await teamMemberService.list('1', '1');

//             expect(result).toEqual([]);
//             expect(mockTeamMemberRepository.list).toHaveBeenCalledWith('1');
//         });
//     });
// });