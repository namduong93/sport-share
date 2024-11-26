import {Session} from '../model/session_model';

// This is the repository layer. It is responsible for handling database operations.
export interface SessionRepository {
    find(tk: string): Promise<Session | null>;
    create(session: Session): Promise<Session | null>;
    update(session: Session): Promise<Session | null>;
    delete(tk: string): Promise<boolean>;
}