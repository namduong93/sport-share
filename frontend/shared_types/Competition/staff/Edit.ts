import { CourseCategory } from "../../University/Course";

export interface EditRego {
  enableCodeforcesField: boolean;
  enableNationalPrizesField: boolean;
  enableInternationalPrizesField: boolean;
  enableRegionalParticipationField: boolean;
}

export interface EditCourse {
  [CourseCategory.Introduction]: string;
  [CourseCategory.DataStructures]: string;
  [CourseCategory.AlgorithmDesign]: string;
  [CourseCategory.ProgrammingChallenges]: string;
}