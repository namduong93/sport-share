// User interface model

import {Device} from "./device_model";

export interface User {
    email: string;
    uuid: string;
    name: string;
    preferredName?: string;
    password?: string;
    mobile: string;
    image?: string;
    token: string;
    devices: Device[],
    createdAt: string;
    modifiedAt?: string;
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

    if (!user.mobile || user.mobile.length === 0) {
        return "mobile is required";
    }

    return "";
}