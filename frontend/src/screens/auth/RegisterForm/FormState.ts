
export interface FormState {
  role: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  gender: string;
  preferredPronoun?: string;
  email: string;
  password:string;
  tShirtSize: string;
  foodAllergies?: string;
  dietaryRequirements?: string[];
  accessibilityRequirements?: string;
  institution: string;
  studentId?: string;
}

export const initialState: FormState = {
  role: '',
  firstName: '',
  lastName: '',
  preferredName: undefined,
  gender: '',
  preferredPronoun: undefined,
  email: '',
  password: '',
  tShirtSize: '',
  foodAllergies: undefined,
  dietaryRequirements: [],
  accessibilityRequirements: undefined,
  institution: '',
  studentId: undefined,
}