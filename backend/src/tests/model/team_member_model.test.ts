import { Position } from '../../model/player_stats_model';
import {roles, TeamMember, validate} from '../../model/team_member_model';

describe('Team Member Model', () => {
    it('should create a valid Team Member object', () => {
        const teamMember: TeamMember = {
            teamId: "teamId",
            meta: "sortKey",
            uuid: "uuid",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            mobile: "1234567890",
            image: "image-url",
            credit: 100,
            role: roles.ADMIN,
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

        expect(teamMember).toBeDefined();
        expect(teamMember).toHaveProperty('teamId', 'teamId');
        expect(teamMember).toHaveProperty('meta', 'sortKey');
        expect(teamMember).toHaveProperty('uuid', 'uuid');
        expect(teamMember).toHaveProperty('name', 'John Doe');
        expect(teamMember).toHaveProperty('email', 'john@example.com');
        expect(teamMember).toHaveProperty('mobile', '1234567890');
        expect(teamMember).toHaveProperty('image', 'image-url');
        expect(teamMember).toHaveProperty('credit', 100);
        expect(teamMember).toHaveProperty('createdAt');
        expect(teamMember).toHaveProperty('modifiedAt');
        expect(teamMember).toHaveProperty('playerStats');
        expect(teamMember.createdAt).toBeInstanceOf(Date);
        expect(teamMember.modifiedAt).toBeInstanceOf(Date);
    });
});

describe('Team Member Model Validation', () => {
    it('should return empty string for valid Team Member', () => {
        const teamMember: TeamMember = {
            teamId: "teamId",
            meta: "sortKey",
            uuid: "uuid",
            firstName: "John",
            lastName: "John",
            email: "john@example.com",
            mobile: "1234567890",
            image: "image-url",
            credit: 100,
            role: roles.MEMBER,
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

        const validationResult = validate(teamMember);
        expect(validationResult).toBe("");
    });
    it('should return error message for Team Member with missing fields', () => {
        const teamMember: TeamMember = {
            teamId: "",
            meta: "",
            uuid: "",
            firstName: "",
            lastName: "",
            email: "",
            mobile: "",
            image: "",
            credit: 0,
            role: "",
            playerStats: {
                preferredPosition: [],
                goalkeeping: 0,
                defense: 0,
                attack: 0,
                control: 0,
                physique: 0,
                speed: 0
            },
            createdAt: new Date(),
            modifiedAt: new Date()
        };

        const validationResult = validate(teamMember);
        expect(validationResult).not.toBe("");
    });
    it('should return error message for invalid credit', () => {
        const teamMember: TeamMember = {
            teamId: "teamId",
            meta: "sortKey",
            uuid: "uuid",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            mobile: "1234567890",
            image: "image-url",
            credit: -1,
            role: roles.MEMBER,
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

        let validationResult = validate(teamMember);
        expect(validationResult).not.toBe("");
        teamMember.credit = 0;
        validationResult = validate(teamMember);
        expect(validationResult).toBe("");
    });
});