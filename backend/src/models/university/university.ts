
/**
 * Represents a university entity.
 */
export interface University {
  id: number;
  name: string;
};

/**
 * Represents an object containing a list of universities.
 */
export interface UniversityListObject {
  universities: University[];
}