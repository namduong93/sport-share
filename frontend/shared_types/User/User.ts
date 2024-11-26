
export const enum UserAccess {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

// User interface model

export interface User {
  email: string;
  uuid: string;
  firstName: string;
  lastName: string;
  role: UserType;
  preferredName?: string;
  password: string; // This is explicitly required on Frontend
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

  if (!user.firstName || user.firstName.length === 0) {
      return "first name is required";
  }

  if (!user.lastName || user.lastName.length === 0) {
      return "last name is required";
  }

  if (!user.email || user.email.length === 0) {
      return "email is required";
  }

  if(!user.password || user.password.length === 0) {
      return "password is required";
  }

  return "";
}