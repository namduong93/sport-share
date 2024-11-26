import express, {json, Express, NextFunction, Request, Response} from "express";
import dotenv from "dotenv";
import serverless from "serverless-http";
import * as AWS from "aws-sdk";
import {UserController} from "./controller/user_controller";
import {UserService} from "./service/user_service";
import {DynamoDBUserRepository} from "./repository/user/dynamodb";
import {TeamMemberController} from "./controller/team_member_controller";
import {TeamMemberService} from "./service/team_member_service";
import {DynamoDBTeamMemberRepository} from "./repository/team_member/dynamodb";
import {TeamController} from "./controller/team_controller";
import {TeamService} from "./service/team_service";
import {DynamoDBTeamRepository} from "./repository/team/dynamodb";
import {GameController} from "./controller/game_controller";
import {GameService} from "./service/game_service";
import {DynamoDBGameRepository} from "./repository/game/dynamodb";
import {DynamoDBSessionRepository} from "./repository/session/dynamodb";
import {Authenticator} from "./middleware/authenticator";
import {handleError} from "./middleware/error_hanlder";
import cors from 'cors';
import cookieParser from "cookie-parser";

// Load environment variable
dotenv.config();
const app: Express = express();

// AWS Config
AWS.config.update({region:"ap-southeast-2"});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to authenticate request (bypass for local env)
// const authenticator = new Authenticator();
// app.use(authenticator.authenticationMiddleware)

// User Registry
const userRepository = new DynamoDBUserRepository(new AWS.DynamoDB());
const sessionRepository = new DynamoDBSessionRepository(new AWS.DynamoDB());
const userService = new UserService(userRepository, sessionRepository);
const userController = new UserController(userService);

// Team Member Registry
const teamMemberRepository = new DynamoDBTeamMemberRepository(new AWS.DynamoDB());
const teamMemberService = new TeamMemberService(teamMemberRepository, userRepository);
const teamMemberController = new TeamMemberController(teamMemberService);

// Team Registry
const teamRepository = new DynamoDBTeamRepository(new AWS.DynamoDB());
const teamService = new TeamService(teamRepository);
const teamController = new TeamController(teamService);

// Game Registry
const gameRepository = new DynamoDBGameRepository(new AWS.DynamoDB());
const gameService = new GameService(gameRepository, teamMemberRepository, teamRepository);
const gameController = new GameController(gameService);

// Health Check
app.get("/", (req: Request, res: Response) => res.send("Yeah it works"));

// User Routes
app.get("/users/:email", (req: Request, res: Response, next: NextFunction) => userController.findByEmail(req, res, next));
app.post("/users", (req: Request, res: Response, next: NextFunction) => userController.create(req, res, next));
app.put("/users", (req: Request, res: Response, next: NextFunction) => userController.update(req, res, next));
app.delete("/users/:email", (req: Request, res: Response, next: NextFunction) => userController.delete(req, res, next));
app.post("/users/authenticate", (req: Request, res: Response, next: NextFunction) => userController.authenticate(req, res, next));
app.post("/users/logout", (req: Request, res: Response, next: NextFunction) => userController.logout(req, res, next));

// Team Member Routes
app.get("/teams/:teamId/members", (req: Request, res: Response) => teamMemberController.list(req, res));
app.get("/teams/:teamId/members/:uuid", (req: Request, res: Response) => teamMemberController.find(req, res));
app.post("/teams/:teamId/members", (req: Request, res: Response) => teamMemberController.create(req, res));
app.put("/teams/:teamId/members/:uuid", (req: Request, res: Response) => teamMemberController.update(req, res));
app.delete("/teams/:teamId/members/:uuid", (req: Request, res: Response) => teamMemberController.delete(req, res));

// Team routes
app.get("/teams", (req: Request, res: Response) => teamController.list(req, res));
app.post("/teams", (req: Request, res: Response) => teamController.create(req, res));
app.get("/teams/:id", (req: Request, res: Response) => teamController.find(req, res));
app.put("/teams/:id", (req: Request, res: Response) => teamController.update(req, res));
app.delete("/teams/:id", (req: Request, res: Response) => teamController.delete(req, res));

// Game routes
app.get("/teams/:teamId/games", (req: Request, res: Response) => gameController.list(req, res));
app.post("/teams/:teamId/games", (req: Request, res: Response) => gameController.create(req, res));
app.get("/teams/:teamId/games/:id", (req: Request, res: Response) => gameController.find(req, res));
app.put("/teams/:teamId/games/:id", (req: Request, res: Response) => gameController.update(req, res));
app.delete("/teams/:teamId/games/:id", (req: Request, res: Response) => gameController.delete(req, res));

// Game actions & stats
app.post("/teams/:teamId/games/:id/vote", (req: Request, res: Response) => gameController.vote(req, res));
app.post("/teams/:teamId/games/:id/removeVote", (req: Request, res: Response) => gameController.removeVote(req, res));
app.post("/teams/:teamId/games/:id/announce", (req: Request, res: Response) => gameController.announce(req, res));
app.post("/teams/:teamId/games/:id/removeAnnouncement", (req: Request, res: Response) => gameController.removeAnnouncement(req, res));
app.post("/teams/:teamId/games/:id/status", (req: Request, res: Response) => gameController.status(req, res));
app.get("/teams/:teamId/games/:id/attendees/:vote", (req: Request, res: Response) => gameController.attendees(req, res));
app.post("/teams/:teamId/games/:id/mvp", (req: Request, res: Response) => gameController.voteMVP(req, res));
app.get("/teams/:teamId/games/:id/mvp", (req: Request, res: Response) => gameController.findMVP(req, res));
app.post("/teams/:teamId/games/:id/goals", (req: Request, res: Response) => gameController.upsertGoals(req, res));
app.get("/teams/:teamId/games/:id/goals/:uuid", (req: Request, res: Response) => gameController.findGoalsOfMember(req, res));
app.post("/teams/:teamId/games/:id/assists", (req: Request, res: Response) => gameController.upsertAssists(req, res));
app.get("/teams/:teamId/games/:id/assists/:uuid", (req: Request, res: Response) => gameController.findAssistsOfMember(req, res));

// Middleware to handle error
app.use(handleError);

// Export your express server so you can import it in the lambda function.
module.exports.handler = serverless(app);
