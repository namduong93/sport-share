import { Request, Response } from 'express';
import { GameTeamService } from '../service/game_team_service';

// This is the controller layer. It is responsible for handling HTTP requests.
export class GameTeamController {
    private gameTeamService: GameTeamService;

    constructor(gameTeamService: GameTeamService) {
        this.gameTeamService = gameTeamService;
    }

    // This method is used to join user into gameTeam
    async joinGameTeam(req: Request, res: Response) {
      try {
          const teamId = req.params.teamId;
          const gameId = req.params.id;
          const uuid = res.locals.uuid;

          const joined = await this.gameTeamService.joinGameTeam(teamId, gameId, uuid);

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