import {User} from "../model/user_model";

// This is the repository layer. It is responsible for handling database operations.
export interface UserRepository {
    authenticate(email: string, password: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User>;
    create(user: User): Promise<User | null>;
    update(user: User): Promise<User | null>;
    delete(email: string, userId: string): Promise<boolean>;
    list(): Promise<User[]>;
    updateUserDevices(user: User): Promise<User>;
}