import { useParams } from "react-router-dom";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";
import { useTheme } from "styled-components";
import { FC, useEffect } from "react";
import Fuse from "fuse.js";
import {
  StyledFilterTagButton,
  StyledRemoveFilterIcon,
} from "../../../../../dashboard/Dashboard.styles";
import { StyledFlexBackground } from "../../../../../../components/general_utility/Background";
import { StyledNarrowDisplayDiv, StyledWideDisplayDiv } from "./StudentPage.styles";
import { StudentInfo } from "../../../../../../../shared_types/Competition/student/StudentInfo";
import { StudentInfoCard } from "./subcomponents/StudentInfoCard";
import { StudentInfoDiv } from "./subcomponents/StudentInfoDiv";

const STUDENT_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
  { label: "Alphabetical (Team Name)", value: "teamName" },
];

const STUDENT_DISPLAY_FILTER_OPTIONS = {
  Status: ["Matched", "Unmatched"],
};

/**
 * A React component that displays a list of students with sorting, filtering, and search capabilities.
 *
 * The `StudentPage` component is responsible for rendering a list of students, supporting filtering by status and university,
 * sorting by different criteria (name or team name), and enabling search through student data. It uses the `Fuse.js` library
 * to provide fuzzy search functionality, provides options to remove active filters and dynamically update the displayed students
 * based on the selected filters, sort options, and search term.
 *
 * @returns {JSX.Element} - A UI component that displays the list of students with the ability to filter, sort, and search the data.
 */
export const StudentPage: FC = () => {
  const {
    filters,
    sortOption,
    searchTerm,
    removeFilter,
    universityOptionState: [universityOption, ],
    setFilterOptions,
    setSortOptions,
    studentsState: [students, setStudents],
  } = useCompetitionOutletContext("students");

  const { compId } = useParams();
  const theme = useTheme();

  // Initialises the filter and sort options when the component mounts
  useEffect(() => {
    setSortOptions(STUDENT_DISPLAY_SORT_OPTIONS);
    setFilterOptions(STUDENT_DISPLAY_FILTER_OPTIONS);
    if (!compId) {
      return;
    }
  }, []);

  const filteredStudents = students.filter((studentInfo) => {
    if (filters.Status) {
      if (!filters.Status.some((status) => status === studentInfo.status)) {
        return false;
      }
    }

    if (
      !(universityOption.value === "") &&
      !(studentInfo.universityId === parseInt(universityOption.value))
    ) {
      return false;
    }

    return true;
  });

  const sortedStudents = filteredStudents.sort((student1, student2) => {
    if (!sortOption) {
      return 0;
    }

    if (sortOption === "name") {
      return student1.name.localeCompare(student2.name);
    }

    if (sortOption === "teamName") {
      if (student1.teamName) {
        if (!student2.teamName) {
          return 1;
        }

        if (student2.teamName) {
          return student1.teamName?.localeCompare(student2.teamName as string);
        }
      } else {
        if (student2.teamName) {
          return -1;
        }
      }
    }
    return 0;
  });

  const fuse = new Fuse(sortedStudents, {
    keys: [
      "name",
      "sex",
      "email",
      "studentId",
      "status",
      "teamName",
      "level",
      "tshirtSize",
      "siteName",
    ],
    threshold: 0.5,
  });

  let searchedStudents;
  if (searchTerm) {
    searchedStudents = fuse.search(searchTerm);
  } else {
    searchedStudents = sortedStudents.map((student) => {
      return { item: student };
    });
  }

  return <>
  <div>
      {Object.entries(filters).map(([field, values]) =>
        values.map((value) => (
        <StyledFilterTagButton
          key={`${field}-${value}`}
          className="student-page--StyledFilterTagButton-0">
          {value}
          <StyledRemoveFilterIcon
            onClick={(e) => {
            e.stopPropagation();
            removeFilter(field, value);
            }}
            className="student-page--StyledRemoveFilterIcon-0" />
        </StyledFilterTagButton>
        ))
      )}
    </div>
  <StyledFlexBackground className="student-page--StyledFlexBackground-0">
    <StyledNarrowDisplayDiv className="student-page--StyledNarrowDisplayDiv-0">
      {searchedStudents.map(({ item: studentInfo }: { item: StudentInfo }, index) => 
        (<StudentInfoCard
          studentsState={[students, setStudents]}
          key={`${studentInfo.email}${index}`}
          studentInfo={studentInfo}
        />))}
    </StyledNarrowDisplayDiv>
    <StyledWideDisplayDiv className="student-page--StyledWideDisplayDiv-0">
      <StudentInfoDiv studentsState={[students, setStudents]} style={{
        backgroundColor: theme.colours.userInfoCardHeader,
        fontWeight: 'bold'
      }}></StudentInfoDiv>
      {searchedStudents.map(({ item: studentInfo }: { item: StudentInfo }, index) => 
        (<StudentInfoDiv
          studentsState={[students, setStudents]}
          key={`${studentInfo.email}${index + students.length}`}
          studentInfo={studentInfo}
        />))}
    </StyledWideDisplayDiv>
  </StyledFlexBackground>
  </>;
}
