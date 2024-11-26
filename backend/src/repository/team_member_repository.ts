import { TeamMember } from '../model/team_member_model';
import { User } from '../model/user_model';

// This is the repository layer. It is responsible for handling database operations.
export interface TeamMemberRepository {
    find(teamId: string, uuid: string): Promise<TeamMember | null>;
    create(teamMember: TeamMember, user: User): Promise<TeamMember | null>;
    update(teamMember: TeamMember): Promise<TeamMember | null>;
    delete(teamId: string, uuid: string): Promise<boolean>;
    list(teamId: string): Promise<TeamMember[]>;
}