import {TeamMemberRepository} from "../repository/team_member_repository";
import {TeamMember} from "../model/team_member_model";
import {UserRepository} from "../repository/user_repository";

// This is the service layer. It is responsible for handling business logic.
export class TeamMemberService {
    private teamMemberRepository: TeamMemberRepository;
    private userRepository: UserRepository;

    constructor(teamMemberRepository: TeamMemberRepository, userRepository: UserRepository) {
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }

    // This method is used to fetch a team member by teamID and uuid
    async find(teamId: string, uuid: string): Promise<TeamMember | null> {
        return await this.teamMemberRepository.find(teamId, uuid);
    }

    // This method is used to create a team member
    async create(teamMember: TeamMember): Promise<TeamMember | null> {
        if (!teamMember.email) {
            throw new Error("email is required");
        }
        // Get user by email
        let user = await this.userRepository.findByEmail(teamMember.email);
        if (!user) {
            throw new Error("User not found");
        }

        return await this.teamMemberRepository.create(teamMember, user);
    }

    // This method is used to update a team member
    async update(teamMember: TeamMember): Promise<TeamMember | null> {
        return await this.teamMemberRepository.update(teamMember);
    }

    // This method is used to delete a team member
    async delete(teamId: string, uuid: string): Promise<boolean> {
        return await this.teamMemberRepository.delete(teamId, uuid);
    }

    // This method is used to list all team members
    async list(teamId: string, uuid: string): Promise<TeamMember[]> {
        let member = await this.teamMemberRepository.find(teamId, uuid);
        if (!member) {
            return [];
        }
        if (member.role !== 'admin') {
            return [];
        }

        return await this.teamMemberRepository.list(teamId);
    }
}