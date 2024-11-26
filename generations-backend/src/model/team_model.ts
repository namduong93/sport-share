// Team interface model
export interface Team {
    id: string;
    name: string;
    email: string;
    image: string;
    createdAt: Date;
    modifiedAt: Date;
}

// Model validation
export function validate(teamMember: Team): string {
    if (!teamMember.id || teamMember.id.length === 0) {
        return "teamId is required";
    }

    if (!teamMember.name || teamMember.name.length === 0) {
        return "name is required";
    }

    if (!teamMember.email || teamMember.email.length === 0) {
        return "email is required";
    }

    return "";
}