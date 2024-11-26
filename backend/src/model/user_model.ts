// User interface model

export interface User {
    email: string;
    uuid: string;
    name: string;
    role: UserType;
    preferredName?: string;
    password?: string;
    image?: string;
    token: string;
    createdAt: string;
    modifiedAt?: string;
    bio: string;
    referrer?: string;
}

export enum UserType {
    ADMIN = "Admin",
    USER = "User"
}

// Model validation
export function validate(user: User): string {
    if (!user.uuid || user.uuid.length === 0) {
        return "uuid is required";
    }

    if (!user.name || user.name.length === 0) {
        return "name is required";
    }

    if (!user.email || user.email.length === 0) {
        return "email is required";
    }

    if(!user.password || user.password.length === 0) {
        return "password is required";
    }

    return "";
}