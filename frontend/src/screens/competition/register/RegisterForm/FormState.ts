export interface SiteLocation {
  id: number;
  name: string;
}

export interface FormState {
  degreeYear: number;
  degree: string;
  ICPCEligibility: boolean | undefined;
  isRemote: boolean | undefined;
  competitionLevel: string;
  siteLocation: SiteLocation;
  boersenEligible?: boolean;
  courses: string[];
  codeforce?: number;
  pastRegional?: boolean | undefined;
  nationalPrizes?: string;
  internationalPrizes?: string;
  competitionBio:string;
  platform?: string;
  handle?: string;
}

export const initialState: FormState = {
  degreeYear: 0,
  degree: '',
  ICPCEligibility: undefined,
  isRemote: undefined,
  competitionLevel: '',
  siteLocation: { id: 0, name: '' },
  boersenEligible: undefined,
  courses: [],
  codeforce: undefined,
  pastRegional: undefined,
  nationalPrizes: "",
  internationalPrizes: "",
  competitionBio:"",
  platform: undefined, 
  handle: undefined,
}