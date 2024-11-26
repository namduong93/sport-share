import {Request, Response} from 'express';
import {TeamService} from '../service/team_service';

// This is the controller layer. It is responsible for handling HTTP requests.
export class TeamController {
    private teamService: TeamService;

    constructor(teamService: TeamService) {
        this.teamService = teamService;
    }

    // This method is used to fetch a team by teamId
    async find(req: Request, res: Response) {
        try {
            const teamId = req.params.id;

            const team = await this.teamService.find(teamId);

            if (team) {
                res.send(team);
            } else {
                res.status(404).send('Team not found');
            }
        } catch (e) {
            res.status(500).send('Failed to fetch team');
        }

    }

    // This method is used to create a team
    async create(req: Request, res: Response) {
        try {
            const team = req.body;
            const newTeam = await this.teamService.create(team);

            if (newTeam) {
                res.send(newTeam);
            } else {
                res.status(500).send('Failed to create team');
            }
        } catch (e) {
            res.status(500).send('Failed to create team');
        }
    }

    // This method is used to update a team
    async update(req: Request, res: Response) {
        try {
            const team = req.body;
            const updatedTeam = await this.teamService.update(team);

            if (updatedTeam) {
                res.send(updatedTeam);
            } else {
                res.status(500).send('Failed to update team');
            }
        } catch (e) {
            res.status(500).send('Failed to update team');
        }
    }

    // This method is used to delete a team
    async delete(req: Request, res: Response) {
        try {
            const teamId = req.params.id;

            const deleted = await this.teamService.delete(teamId);

            if (deleted) {
                res.send('Team deleted');
            } else {
                res.status(500).send('Failed to delete team');
            }
        } catch (e) {
            res.status(500).send('Failed to delete team');
        }
    }

    // This method is used to list all teams
    async list(req: Request, res: Response) {
        try {
            const teams = await this.teamService.list();

            res.send(teams);
        } catch (e) {
            res.status(500).send('Failed to list teams');
        }
    }
}