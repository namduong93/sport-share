import { Request, Response } from 'express';
import { GameService } from '../service/game_service';

// This is the controller layer. It is responsible for handling HTTP requests.
export class GameController {
    private gameService: GameService;

    constructor(gameService: GameService) {
        this.gameService = gameService;
    }

    // This method is used to fetch a game by id
    async find(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;

            const game = await this.gameService.find(teamId, id);

            if (game) {
                res.send(game);
            } else {
                res.status(404).send('Game not found');
            }
        } catch (e) {
            res.status(500).send('Failed to fetch game');
        }
    }

    // This method is used to create a game
    async create(req: Request, res: Response) {
        try {
            const game = req.body;
            const newGame = await this.gameService.create(game);

            if (newGame) {
                res.send(newGame);
            } else {
                res.status(500).send('Failed to create game');
            }
        } catch (e) {
            res.status(500).send('Failed to create game');
        }
    }

    // This method is used to update a game
    async update(req: Request, res: Response) {
        try {
            const game = req.body;
            const updatedGame = await this.gameService.update(game);

            if (updatedGame) {
                res.send(updatedGame);
            } else {
                res.status(500).send('Failed to update game');
            }
        } catch {
            res.status(500).send('Failed to update game');
        }
    }

    // This method is used to delete a game
    async delete(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;

            const deleted = await this.gameService.delete(teamId, id);

            if (deleted) {
                res.send('Game deleted');
            } else {
                res.status(500).send('Failed to delete game');
            }
        } catch {
            res.status(500).send('Failed to delete game');
        }
    }

    // This method is used to list all games
    async list(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const games = await this.gameService.list(teamId);

            res.send(games);
        } catch {
            res.status(500).send('Failed to list games');
        }
    }

    // This method is used to vote on a game
    async vote(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;
            const vote = req.body.vote;
            const uuid = res.locals.uuid;

            const voted = await this.gameService.vote(teamId, id, uuid, vote);

            if (voted) {
                res.send('Voted successfully');
            } else {
                res.status(500).send('Failed to vote');
            }
        } catch (e) {
            res.status(500).send('Failed to vote');
        }
    }

    // This method is used to remove a vote on a game
    async removeVote(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;
            const uuid = res.locals.uuid;

            const removed = await this.gameService.removeVote(teamId, id, uuid);

            if (removed) {
                res.send('Vote removed successfully');
            } else {
                res.status(500).send('Failed to remove vote');
            }
        } catch (e) {
            res.status(500).send('Failed to remove vote');
        }
    }

    // This method is used to announce on a game
    async announce(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;
            const announcement = req.body.announcement;
            const uuid = res.locals.uuid;

            const announced = await this.gameService.announce(teamId, id, uuid, announcement);

            if (announced) {
                res.send('Announced successfully');
            } else {
                res.status(500).send('Failed to announce');
            }
        } catch (e) {
            res.status(500).send('Failed to announce');
        }
    }

    // This method is used to remove an announcement on a game
    async removeAnnouncement(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;
            const announcementId = req.body.announcementId;

            const removed = await this.gameService.removeAnnouncement(teamId, id, announcementId);

            if (removed) {
                res.send('Announcement removed successfully');
            } else {
                res.status(500).send('Failed to remove announcement');
            }
        } catch (e) {
            res.status(500).send('Failed to remove announcement');
        }
    }

    // This method is used to update the status of a game
    async status(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;
            const status = req.body.status;

            const updated = await this.gameService.status(teamId, id, status);

            if (updated) {
                res.send('Status updated successfully');
            } else {
                res.status(500).send('Failed to update status');
            }
        } catch (e) {
            res.status(500).send('Failed to update status');
        }
    }


    // This method is used to check if user has attend a game
    async hasAttended(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;
            const uuid = res.locals.uuid;

            const joined = await this.gameService.hasAttended(teamId, id, uuid);

            res.send(joined);
        } catch (e) {
            res.status(500).send('Failed to check join');
        }
    }

    // This method is used to fetch attendees details of a game
    async attendees(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;
            const vote = req.params.vote;
            const attendees = await this.gameService.attendees(teamId, id, vote);

            res.send(attendees);
        } catch (e) {
            res.status(500).send('Failed to fetch going attendees');
        }
    }

    // This method is used to indicate MVP of a game
    async voteMVP(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;
            const memberId = req.body.uuid;

            const mvpSelected = await this.gameService.voteMVP(teamId, id, memberId);

            if (mvpSelected) {
                res.send('MVP selected successfully');
            } else {
                res.status(500).send('Failed to select MVP');
            }
        } catch (e) {
            res.status(500).send('Failed to select MVP');
        }
    }

    // This method is used to fetch the MVP of a game
    async findMVP(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const id = req.params.id;

            const mvp = await this.gameService.findMVP(teamId, id);

            if (mvp) {
                res.send(mvp);
            } else {
                res.status(404).send('MVP not found');
            }
        } catch (e) {
            res.status(500).send('Failed to fetch MVP');
        }
    }

    // This method is used to upsert goals of a team member in a game
    async upsertGoals(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const gameId = req.params.id;
            const uuid = req.body.uuid;
            const goals = req.body.goals;

            const goalsUpserted = await this.gameService.upsertGoals(teamId, gameId, uuid, goals);

            if (goalsUpserted) {
                res.send('Goals upserted successfully');
            } else {
                res.status(500).send('Failed to upsert goals');
            }
        } catch (e) {
            res.status(500).send('Failed to upsert goals');
        }
    }

    // This method is used to fetch goals of a team member in a game
    async findGoalsOfMember(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const gameId = req.params.id;
            const uuid = req.params.uuid;

            const goals = await this.gameService.findGoalsOfMember(teamId, gameId, uuid);

            if (goals) {
                res.send(goals);
            } else {
                res.status(404).send('Goals not found');
            }
        } catch (e) {
            res.status(500).send('Failed to fetch goals');
        }
    }

    // This method is used to upsert assists of a team member in a game
    async upsertAssists(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const gameId = req.params.id;
            const uuid = req.body.uuid;
            const assists = req.body.assists;

            const assistsUpserted = await this.gameService.upsertAssists(teamId, gameId, uuid, assists);

            if (assistsUpserted) {
                res.send('Assists upserted successfully');
            } else {
                res.status(500).send('Failed to upsert assists');
            }
        } catch (e) {
            res.status(500).send('Failed to upsert assists');
        }
    }

    // This method is used to fetch assists of a team member in a game
    async findAssistsOfMember(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const gameId = req.params.id;
            const uuid = req.params.uuid;

            const assists = await this.gameService.findAssistsOfMember(teamId, gameId, uuid);

            if (assists) {
                res.send(assists);
            } else {
                res.status(404).send('Assists not found');
            }
        } catch (e) {
            res.status(500).send('Failed to fetch assists');
        }
    }

    // This method is used to join user into gameTeam
    async joinGameTeam(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const gameId = req.params.id;
            const uuid = res.locals.uuid;

            const joined = await this.gameService.joinGameTeam(teamId, gameId, uuid);

            if (joined) {
                res.send('Joined successfully');
            } else {
                res.status(500).send('Failed to join');
            }
        } catch (e) {
            res.status(500).send('Failed to join');
        }
    }
}