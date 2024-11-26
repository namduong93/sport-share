
export const enum CourseCategory {
  Introduction = 'Introduction',
  DataStructures = 'Data Structures',
  AlgorithmDesign = 'Algorithm Design',
  ProgrammingChallenges = 'Programming Challenges',
}

export interface Course {
  courseId: number;
  courseName: string;
  category: CourseCategory;
}