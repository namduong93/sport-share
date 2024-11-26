import {Game, GameAttendee} from "../model/game_model";
import { Team } from "../model/team_model";
import { TeamMember } from "../model/team_member_model";

// This is the repository layer. It is responsible for handling database operations.
export interface GameRepository {
    find(teamId: string, id: string): Promise<Game | null>;
    create(game: Game): Promise<Game | null>;
    update(game: Game): Promise<Game | null>;
    delete(teamId: string, id: string): Promise<boolean>;
    list(teamId: string): Promise<Game[]>;
    vote(teamId: string, id: string, uuid: string, vote: string): Promise<boolean>;
    removeVote(teamId: string, id: string, uuid: string): Promise<boolean>;
    announce(teamId: string, id: string, uuid: string, announcement: string): Promise<boolean>;
    removeAnnouncement(teamId: string, id: string, announcementId: string): Promise<boolean>;
    status(teamId: string, id: string, status: string): Promise<boolean>;
    voteMVP(team: Team, game: Game, teamMember: TeamMember): Promise<boolean>;
    findMVP(teamId: string, id: string): Promise<GameAttendee | null>;
    upsertGoals(team: Team, game: Game, teamMember: TeamMember, goals: string): Promise<boolean>
    findGoalsOfMember(teamId: string, gameId: string, uuid: string): Promise<GameAttendee | null>
    upsertAssists(team: Team, game: Game, teamMember: TeamMember, assists: string): Promise<boolean>
    findAssistsOfMember(teamId: string, gameId: string, uuid: string): Promise<GameAttendee | null>
}