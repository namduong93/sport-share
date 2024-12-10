import { GameTeam } from "../model/game_team";
import { GameRepository } from '../repository/game_repository';
import { GameTeamRepository } from "../repository/game_team_repository";
import { TeamMemberRepository } from "../repository/team_member_repository";
import { TeamRepository } from "../repository/team_repository";

// This is the service layer. It is responsible for handling business logic.
export class GameTeamService {
    private gameTeamRepository: GameTeamRepository;
    private gameRepository: GameRepository;
    private teamMemberRepository: TeamMemberRepository;
    private teamRepository: TeamRepository;

    constructor(gameTeamRepository: GameTeamRepository, gameRepository: GameRepository, teamMemberRepository: TeamMemberRepository, teamRepository: TeamRepository) {
        this.gameTeamRepository = gameTeamRepository;
        this.gameRepository = gameRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.teamRepository = teamRepository;
    }

    // This method is used to join user into gameTeam
    async joinGameTeam(teamId: string, gameId: string, uuid: string): Promise<GameTeam | null> {
        // Find the team
        const team = await this.teamRepository.find(teamId);
        if (!team) {
            throw new Error("Team not found");
        }

        // Find the game
        const game = await this.gameRepository.find(teamId, gameId);
        if (!game) {
            throw new Error("Game not found");
        }

        // Find the team member
        const teamMember = await this.teamMemberRepository.find(teamId, uuid);
        if (!teamMember) {
            throw new Error("Team member not found");
        }

        return await this.gameTeamRepository.joinGameTeam(team, game, teamMember);
    }
}