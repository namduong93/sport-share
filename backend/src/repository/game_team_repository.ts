import { Game } from "../model/game_model";
import { GameTeam } from "../model/game_team";
import { TeamMember } from "../model/team_member_model";
import { Team } from "../model/team_model";

// This is the repository layer. It is responsible for handling database operations.
export interface GameTeamRepository {
    joinGameTeam(team: Team, game: Game, teamMember: TeamMember): Promise<GameTeam | null>;
}