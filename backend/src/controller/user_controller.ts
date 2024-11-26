import {NextFunction, Request, Response} from 'express';
import {UserService} from '../service/user_service';

// This is the controller layer. It is responsible for handling HTTP requests.
export class UserController {
    private userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    // This method is used to authenticate a user
    async authenticate(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.body.email;
            const password = req.body.password;

            const user = await this.userService.authenticate(email, password);

            if (user) {
                res.send(user);
            } else {
                res.status(403).send('Wrong email or password');
            }
        } catch (e) {
            next(e);
        }
    }

    // This method is used to fetch a user by id
    async findByEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.params.email;

            const user = await this.userService.findByEmail(email);

            if (user) {
                res.send(user);
            } else {
                res.status(404).send('User not found');
            }
        } catch (e) {
            next(e);
        }
    }

    // This method is used to create a user
    async create(req: Request, res: Response, next: NextFunction) {
        console.log('Creating user');
        try {
            const user = req.body;
            const newUser = await this.userService.create(user);

            if (newUser) {
                res.send(newUser);
            } else {
                res.status(500).send('Failed to create user');
            }
        } catch (e) {
            next(e);
        }
    }

    // This method is used to update a user
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const user = req.body;
            user.uuid = res.locals.uuid;
            const updatedUser = await this.userService.update(user);

            if (updatedUser) {
                res.send(updatedUser);
            } else {
                res.status(500).send('Failed to update user');
            }
        } catch (e) {
            next(e)
        }
    }

    // This method is used to delete a user
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const email = req.params.email;
            const userId = res.locals.uuid;

            const deleted = await this.userService.delete(email, userId);

            if (deleted) {
                res.send('User deleted');
            } else {
                res.status(500).send('Failed to delete user');
            }
        }catch (e) {
            next(e)
        }
    }
}