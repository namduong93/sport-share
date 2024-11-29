import { Request, Response } from "express";
import { TeamMemberService } from "../service/team_member_service";

// This is the controller layer. It is responsible for handling HTTP requests.
export class TeamMemberController {
    private teamMemberService: TeamMemberService;

    constructor(teamMemberService: TeamMemberService) {
        this.teamMemberService = teamMemberService;
    }

    // This method is used to fetch a team member by teamId and uuid
    async find(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const uuid = req.params.uuid;

            const teamMember = await this.teamMemberService.find(teamId, uuid);

            if (teamMember) {
                res.send(teamMember);
            } else {
                res.status(404).send("Team member not found");
            }
        } catch (e) {
            res.status(500).send("Failed to fetch team member");
        }
    }

    // This method is used to create a team member
    async create(req: Request, res: Response) {
        try {
            const teamMember = req.body;
            const email = req.body.email;
            const newTeamMember = await this.teamMemberService.create(teamMember, email);

            if (newTeamMember) {
                res.send(newTeamMember);
            } else {
                res.status(500).send("Failed to create team member");
            }
        } catch (e) {
            res.status(500).send("Failed to create team member");
        }
    }

    // This method is used to update a team member
    async update(req: Request, res: Response) {
        try {
            const teamMember = req.body;
            const updatedTeamMember = await this.teamMemberService.update(teamMember);

            if (updatedTeamMember) {
                res.send(updatedTeamMember);
            } else {
                res.status(500).send("Failed to update team member");
            }
        } catch (e) {
            res.status(500).send("Failed to update team member");
        }
    }

    // This method is used to delete a team member
    async delete(req: Request, res: Response) {
        try {
            const teamId = req.params.teamId;
            const uuid = req.params.uuid;

            const deleted = await this.teamMemberService.delete(teamId, uuid);

            if (deleted) {
                res.send("Team member deleted");
            } else {
                res.status(500).send("Failed to delete team member");
            }
        } catch (e) {
            res.status(500).send("Failed to delete team member");
        }
    }

    // This method is used to list all team members
    async list(req: Request, res: Response) {
        try {
            const uuid = res.locals?.uuid || '-1';
            const teamId = req.params.teamId;
            const teamMembers = await this.teamMemberService.list(teamId, uuid);

            res.send(teamMembers);
        } catch (e) {
            res.status(500).send("Failed to list team members");
        }
    }
}
