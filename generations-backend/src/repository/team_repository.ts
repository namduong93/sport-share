import { Team } from '../model/team_model';

// This is the repository layer. It is responsible for handling database operations.
export interface TeamRepository {
    find(id: string): Promise<Team | null>;
    create(team: Team): Promise<Team | null>;
    update(team: Team): Promise<Team | null>;
    delete(id: string): Promise<boolean>;
    list(): Promise<Team[]>;
}