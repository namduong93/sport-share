// User interface model

export interface User {
    email: string;
    uuid: string;
    firstName: string;
    lastName: string;
    role: UserType;
    preferredName?: string;
    password?: string;
    image?: string;
    token: string;
    createdAt: string;
    modifiedAt?: string;
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

    if (!user.firstName || user.firstName.length === 0) {
        return "firstName is required";
    }

    if (!user.lastName || user.lastName.length === 0) {
        return "lastName is required";
    }

    if (!user.email || user.email.length === 0) {
        return "email is required";
    }
    return "";
}