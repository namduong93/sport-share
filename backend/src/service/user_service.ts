import {UserRepository} from "../repository/user_repository";
import {User} from "../model/user_model";
import {SessionRepository} from "../repository/session_repository";
import {Session} from "../model/session_model";
import {Device} from "../model/device_model";

// This is the service layer. It is responsible for handling business logic.
export class UserService {
    private userRepository: UserRepository;
    private sessionRepository: SessionRepository;

    constructor(userRepository: UserRepository, sessionRepository: SessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    // This method is used to authenticate a user
    async authenticate(email: string, password: string): Promise<User | null> {
        let user = await this.userRepository.authenticate(email, password);
        if (!user) {
            return null;
        }

        // Create session token
        user.token = Math.random().toString(36) + Math.random().toString(36);
        delete user.password;

        // Update session table
        let unixTimeNow = Math.floor(Date.now() / 1000);
        let session: Session = {
            uuid: user.uuid,
            token: user.token,
            expiresAt: (unixTimeNow + 3600 * 24 * 30).toString(), // 30 days from now
            createdAt: new Date(),
            modifiedAt: new Date()
        }
        await this.sessionRepository.create(session);

        return user;
    }

    // This method is used to fetch a user by email
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findByEmail(email);
    }

    // This method is used to create a user
    async create(user: User): Promise<User | null> {
        return await this.userRepository.create(user);
    }

    // This method is used to update a user
    async update(user: User): Promise<User | null> {
        return await this.userRepository.update(user);
    }

    // This method is used to delete a user
    async delete(email: string, userId: string): Promise<boolean> {
        return await this.userRepository.delete(email, userId);
    }

    // This method is used to list all users
    async list(): Promise<User[]> {
        return await this.userRepository.list();
    }

    //This method is used to log out a user
    async logout(token: string): Promise<boolean> {
        return await this.sessionRepository.delete(token);
    }

    // This method is used to change a user's password
    async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<boolean> {
        return await this.userRepository.changePassword(userId, oldPassword, newPassword);
    }
}