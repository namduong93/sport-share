// Session interface model
export interface Session {
    token: string;
    uuid: string;
    expiresAt: string;
    createdAt: Date;
    modifiedAt: Date;
}