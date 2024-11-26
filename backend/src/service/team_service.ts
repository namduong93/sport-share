import {TeamRepository} from "../repository/team_repository";
import {Team} from "../model/team_model";

// This is the service layer. It is responsible for handling business logic.
export class TeamService {
    private teamRepository: TeamRepository;

    constructor(teamRepository: TeamRepository) {
        this.teamRepository = teamRepository;
    }

    // This method is used to fetch a team by teamID
    async find(teamId: string): Promise<Team | null> {
        return await this.teamRepository.find(teamId);
    }

    // This method is used to create a team
    async create(team: Team): Promise<Team | null> {
        return await this.teamRepository.create(team);
    }

    // This method is used to update a team
    async update(team: Team): Promise<Team | null> {
        return await this.teamRepository.update(team);
    }

    // This method is used to delete a team
    async delete(teamId: string): Promise<boolean> {
        return await this.teamRepository.delete(teamId);
    }

    // This method is used to list all teams
    async list(): Promise<Team[]> {
        return await this.teamRepository.list();
    }
}