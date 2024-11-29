import { Game, GameAttendee, gameVotes, gameVotesArray } from "../model/game_model";
import { GameRepository } from '../repository/game_repository';
import { TeamMemberRepository } from "../repository/team_member_repository";
import { TeamRepository } from "../repository/team_repository";
import { UserRepository } from "../repository/user_repository";

// This is the service layer. It is responsible for handling business logic.
export class GameService {
    private gameRepository: GameRepository;
    private teamMemberRepository: TeamMemberRepository;
    private teamRepository: TeamRepository;
    private userRepository: UserRepository

    constructor(gameRepository: GameRepository, teamMemberRepository: TeamMemberRepository, teamRepository: TeamRepository, userRepository: UserRepository) {
        this.gameRepository = gameRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    // This method is used to fetch a game by id
    async find(teamId: string, id: string): Promise<Game | null> {
        return await this.gameRepository.find(teamId, id);
    }

    // This method is used to create a game
    async create(game: Game): Promise<Game | null> {
        return await this.gameRepository.create(game);
    }

    // This method is used to update a game
    async update(game: Game): Promise<Game | null> {
        return await this.gameRepository.update(game);
    }

    // This method is used to delete a game
    async delete(teamId: string, id: string): Promise<boolean> {
        return await this.gameRepository.delete(teamId, id);
    }

    // This method is used to list all games
    async list(teamId: string): Promise<Game[]> {
        return await this.gameRepository.list(teamId);
    }

    // This method is used to vote on a game
    async vote(teamId: string, id: string, uuid: string, vote: string): Promise<boolean> {
        return await this.gameRepository.vote(teamId, id, uuid, vote);
    }

    // This method is used to remove a vote on a game
    async removeVote(teamId: string, id: string, uuid: string): Promise<boolean> {
        return await this.gameRepository.removeVote(teamId, id, uuid);
    }

    // This method is used to announce on a game
    async announce(teamId: string, id: string, uuid: string, announcement: string): Promise<boolean> {
        return await this.gameRepository.announce(teamId, id, uuid, announcement);
    }

    // This method is used to remove an announcement on a game
    async removeAnnouncement(teamId: string, id: string, announcementId: string): Promise<boolean> {
        return await this.gameRepository.removeAnnouncement(teamId, id, announcementId);
    }

    // This method is used to update the status of a game
    async status(teamId: string, id: string, status: string): Promise<boolean> {
        return await this.gameRepository.status(teamId, id, status);
    }

    // This method is used to fetch going attendees details of a game
    async attendees(teamId: string, id: string, vote: string): Promise<GameAttendee[]> {
        const game = await this.gameRepository.find(teamId, id);
        if (!game) {
            throw new Error("Game not found");
        }
        const gameAttendees: GameAttendee[] = [];
        if (!gameVotesArray.includes(vote)) {
            throw new Error("Vote is invalid")
        }

        let attendees: string[] = [];
        if (vote === gameVotes.YES) {
            if (!game.going) {
                return gameAttendees;
            }
            attendees = game.going;
        } else if (vote === gameVotes.NO) {
            if (!game.notGoing) {
                return gameAttendees;
            }
            attendees = game.notGoing;
        } else if (vote === gameVotes.MAYBE) {
            if (!game.maybe) {
                return gameAttendees;
            }
            attendees = game.maybe;
        }

        for (const attendeeId of attendees) {
            const teamMember = await this.teamMemberRepository.find(teamId, attendeeId);
            if (teamMember) {
                const user = await this.userRepository.findById(teamMember.uuid);
                gameAttendees.push(
                    {
                        uuid: teamMember.uuid,
                        vote: gameVotes.YES,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        preferredName: user.preferredName,
                        image: user.image
                    }
                );
            }
        }

        return gameAttendees;
    }

    // This method is used to indicate MVP of a game
    async voteMVP(teamId: string, id: string, uuid: string): Promise<boolean> {
        // Find the team
        const team = await this.teamRepository.find(teamId);
        if (!team) {
            throw new Error("Team not found");
        }

        // Find the game
        const game = await this.gameRepository.find(teamId, id);
        if (!game) {
            throw new Error("Game not found");
        }

        // Find the team member
        const teamMember = await this.teamMemberRepository.find(teamId, uuid);
        if (!teamMember) {
            throw new Error("Team member not found");
        }

        return await this.gameRepository.voteMVP(team, game, teamMember);
    }

    // This method is used to fetch the MVP of a game
    async findMVP(teamId: string, id: string): Promise<GameAttendee | null> {
        return await this.gameRepository.findMVP(teamId, id);
    }

    // This method is used to upsert goals of a team member in a game
    async upsertGoals(teamId: string, gameId: string, memberId: string, goals: string): Promise<boolean> {
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
        const teamMember = await this.teamMemberRepository.find(teamId, memberId);
        if (!teamMember) {
            throw new Error("Team member not found");
        }

        return await this.gameRepository.upsertGoals(team, game, teamMember, goals);
    }

    // This method is used to fetch goals of a team member in a game
    async findGoalsOfMember(teamId: string, gameId: string, uuid: string): Promise<GameAttendee | null> {
        return await this.gameRepository.findGoalsOfMember(teamId, gameId, uuid);
    }

    // This method is used to upsert assists of a team member in a game
    async upsertAssists(teamId: string, gameId: string, memberId: string, assists: string): Promise<boolean> {
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
        const teamMember = await this.teamMemberRepository.find(teamId, memberId);
        if (!teamMember) {
            throw new Error("Team member not found");
        }

        return await this.gameRepository.upsertAssists(team, game, teamMember, assists);
    }

    // This method is used to fetch assists of a team member in a game
    async findAssistsOfMember(teamId: string, gameId: string, uuid: string): Promise<GameAttendee | null> {
        return await this.gameRepository.findAssistsOfMember(teamId, gameId, uuid);
    }
}