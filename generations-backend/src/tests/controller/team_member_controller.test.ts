import { Request, Response } from "express";
import { TeamMemberController } from "../../controller/team_member_controller";
import { TeamMemberService} from "../../service/team_member_service";
import { Position } from "../../model/player_stats_model";

describe('TeamMemberController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let teamMemberService: jest.Mocked<TeamMemberService>;
    let teamMemberController: TeamMemberController;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            send: jest.fn(),
            status: jest.fn(() => mockResponse)
        } as unknown as Partial<Response>;
        teamMemberService = {
            find: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            list: jest.fn()
        } as unknown as jest.Mocked<TeamMemberService>;
        teamMemberController = new TeamMemberController(teamMemberService);
    });

    describe('find', () => {
        it('should send team member when found', async () => {
            const mockTeamMember = {
                teamId: '1',
                meta: 'mockMeta',
                uuid: '1',
                name: 'mockName',
                email: 'mockEmail',
                mobile: 'mockMobile',
                image: 'mockImage',
                credit: 0,
                role: 'mockRole',
                playerStats: {
                    preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
                    goalkeeping: 80,
                    defense: 85,
                    attack: 90,
                    control: 75,
                    physique: 80,
                    speed: 95
                },
                createdAt: new Date(),
                modifiedAt: new Date()
            };
            teamMemberService.find.mockResolvedValue(mockTeamMember);

            mockRequest.params = { teamId: '1', uuid: '1' };
            await teamMemberController.find(mockRequest as Request, mockResponse as Response);

            expect(teamMemberService.find).toHaveBeenCalledWith('1', '1');
            expect(mockResponse.send).toHaveBeenCalledWith(mockTeamMember);
        });

        it('should send 404 when team member not found', async () => {
            teamMemberService.find.mockResolvedValue(null);

            mockRequest.params = { teamId: '1', uuid: '1' };
            await teamMemberController.find(mockRequest as Request, mockResponse as Response);

            expect(teamMemberService.find).toHaveBeenCalledWith('1', '1');
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.send).toHaveBeenCalledWith("Team member not found");
        });
    });

    describe('create', () => {
        it('should send new team member when created', async () => {
            const mockTeamMember = {
                teamId: '1',
                meta: 'mockMeta',
                uuid: '1',
                name: 'mockName',
                email: 'mockEmail',
                mobile: 'mockMobile',
                image: 'mockImage',
                credit: 0,
                role: 'mockRole',
                playerStats: {
                    preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
                    goalkeeping: 80,
                    defense: 85,
                    attack: 90,
                    control: 75,
                    physique: 80,
                    speed: 95
                },
                createdAt: new Date(),
                modifiedAt: new Date()
            };
            teamMemberService.create.mockResolvedValue(mockTeamMember);

            mockRequest.body = mockTeamMember;
            await teamMemberController.create(mockRequest as Request, mockResponse as Response);

            expect(teamMemberService.create).toHaveBeenCalledWith(mockTeamMember);
            expect(mockResponse.send).toHaveBeenCalledWith(mockTeamMember);
        });

        it('should send 500 when creation fails', async () => {
            teamMemberService.create.mockResolvedValue(null);

            mockRequest.body = { /* mock team member object */ };
            await teamMemberController.create(mockRequest as Request, mockResponse as Response);

            expect(teamMemberService.create).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Failed to create team member");
        });
    });

    describe('update', () => {
        it('should send updated team member when updated', async () => {
            const mockTeamMember = {
                teamId: '1',
                meta: 'mockMeta',
                uuid: '1',
                name: 'mockName',
                email: 'mockEmail',
                mobile: 'mockMobile',
                image: 'mockImage',
                credit: 0,
                role: 'mockRole',
                playerStats: {
                    preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
                    goalkeeping: 80,
                    defense: 85,
                    attack: 90,
                    control: 75,
                    physique: 80,
                    speed: 95
                },
                createdAt: new Date(),
                modifiedAt: new Date()
            };
            teamMemberService.update.mockResolvedValue(mockTeamMember);

            mockRequest.body = mockTeamMember;
            await teamMemberController.update(mockRequest as Request, mockResponse as Response);

            expect(teamMemberService.update).toHaveBeenCalledWith(mockTeamMember);
            expect(mockResponse.send).toHaveBeenCalledWith(mockTeamMember);
        });

        it('should send 500 when update fails', async () => {
            teamMemberService.update.mockResolvedValue(null);

            mockRequest.body = { /* mock team member object */ };
            await teamMemberController.update(mockRequest as Request, mockResponse as Response);

            expect(teamMemberService.update).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Failed to update team member");
        });
    });

    describe('delete', () => {
        it('should send success message when deleted', async () => {
            teamMemberService.delete.mockResolvedValue(true);

            mockRequest.params = { teamId: '1', uuid: '1' };
            await teamMemberController.delete(mockRequest as Request, mockResponse as Response);

            expect(teamMemberService.delete).toHaveBeenCalledWith('1', '1');
            expect(mockResponse.send).toHaveBeenCalledWith("Team member deleted");
        });

        it('should send 500 when delete fails', async () => {
            teamMemberService.delete.mockResolvedValue(false);

            mockRequest.params = { teamId: '1', uuid: '1' };
            await teamMemberController.delete(mockRequest as Request, mockResponse as Response);

            expect(teamMemberService.delete).toHaveBeenCalledWith('1', '1');
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith("Failed to delete team member");
        });
    });

    describe('list', () => {
        it('should send list of team members when found', async () => {
            const mockTeamMembers = [
                {
                    teamId: '1',
                    meta: 'mockMeta',
                    uuid: '1',
                    name: 'mockName',
                    email: 'mockEmail',
                    mobile: 'mockMobile',
                    image: 'mockImage',
                    credit: 0,
                    role: 'mockRole',
                    playerStats: {
                        preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
                        goalkeeping: 71,
                        defense: 71,
                        attack: 71,
                        control: 71,
                        physique: 71,
                        speed: 71
                    },
                    createdAt: new Date(),
                    modifiedAt: new Date()
                },
                {
                    teamId: '1',
                    meta: 'mockMeta',
                    uuid: '2',
                    name: 'mockName',
                    email: 'mockEmail',
                    mobile: 'mockMobile',
                    image: 'mockImage',
                    credit: 0,
                    role: 'mockRole',
                    playerStats: {
                        preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
                        goalkeeping: 72,
                        defense: 72,
                        attack: 72,
                        control: 72,
                        physique: 72,
                        speed: 72
                    },
                    createdAt: new Date(),
                    modifiedAt: new Date()
                },
                {
                    teamId: '1',
                    meta: 'mockMeta',
                    uuid: '3',
                    name: 'mockName',
                    email: 'mockEmail',
                    mobile: 'mockMobile',
                    image: 'mockImage',
                    credit: 0,
                    role: 'mockRole',
                    playerStats: {
                        preferredPosition: [Position.GOALKEEPER, Position.MIDFIELDER],
                        goalkeeping: 73,
                        defense: 73,
                        attack: 73,
                        control: 73,
                        physique: 73,
                        speed: 73
                    },
                    createdAt: new Date(),
                    modifiedAt: new Date()
                }
            ];
            teamMemberService.list.mockResolvedValue(mockTeamMembers);

            mockRequest.params = { teamId: '1' };
            await teamMemberController.list(mockRequest as Request, mockResponse as Response);

            expect(teamMemberService.list).toHaveBeenCalledWith('1', '-1');
            expect(mockResponse.send).toHaveBeenCalledWith(mockTeamMembers);
        });
    });
});