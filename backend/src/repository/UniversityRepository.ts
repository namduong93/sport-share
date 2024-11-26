import { UniversityListObject } from '../models/university/university.js';
import { Course } from '../../shared_types/University/Course.js';

export interface UniversityRepository {
  universityCourses(userId: number, code: string): Promise<Array<Course>>;
  universitiesList(): Promise<UniversityListObject>;
}