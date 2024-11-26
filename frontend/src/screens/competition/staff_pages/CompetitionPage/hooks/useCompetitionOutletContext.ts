import { CompetitionRole } from "../../../../../../shared_types/Competition/CompetitionRole";
import { TeamDetails } from "../../../../../../shared_types/Competition/team/TeamDetails";
import { StudentInfo } from "../../../../../../shared_types/Competition/student/StudentInfo";
import { AttendeesDetails } from "../../../../../../shared_types/Competition/staff/AttendeesDetails";
import { StaffInfo } from "../../../../../../shared_types/Competition/staff/StaffInfo";
import { CompetitionInformation as CompetitionDetails } from "../../../../../../shared_types/Competition/CompetitionDetails";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

export interface ButtonConfiguration {
  enableTeamButtons: boolean;
  enableAttendeesButtons: boolean;
  enableStudentButtons: boolean;
  enableStaffButtons: boolean;
  enableTeamsChangedButtons: boolean;
}

export interface CompetitionPageContext {
  filters: Record<string, Array<string>>;
  sortOption: string;
  searchTerm: string;
  removeFilter: (field: string, value: string) => Record<string, string>;
  setFilterOptions: React.Dispatch<
    React.SetStateAction<Record<string, Array<string>>>
  >;
  setSortOptions: React.Dispatch<
    React.SetStateAction<Array<{ label: string; value: string }>>
  >;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  editingStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamIdsState: [
    Array<number>,
    React.Dispatch<React.SetStateAction<Array<number>>>
  ];
  editingNameStatusState: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ];
  rejectedTeamIdsState: [
    Array<number>,
    React.Dispatch<React.SetStateAction<Array<number>>>
  ];
  roles: Array<CompetitionRole>;
  teamListState: [
    Array<TeamDetails>,
    React.Dispatch<React.SetStateAction<Array<TeamDetails>>>
  ];
  studentsState: [
    Array<StudentInfo>,
    React.Dispatch<React.SetStateAction<Array<StudentInfo>>>
  ];
  attendeesListState: [
    Array<AttendeesDetails>,
    React.Dispatch<React.SetStateAction<Array<AttendeesDetails>>>
  ];
  staffListState: [
    Array<StaffInfo>,
    React.Dispatch<React.SetStateAction<Array<StaffInfo>>>
  ];
  compDetails: CompetitionDetails;

  buttonConfigurationState: [
    ButtonConfiguration,
    React.Dispatch<React.SetStateAction<ButtonConfiguration>>
  ];
  siteOptionsState: [
    Array<{ value: string; label: string }>,
    React.Dispatch<
      React.SetStateAction<Array<{ value: string; label: string }>>
    >
  ];
  universityOptionsState: [
    Array<{ value: string; label: string }>,
    React.Dispatch<
      React.SetStateAction<Array<{ value: string; label: string }>>
    >
  ];
  dropdownOptionsState: [
    Array<{ value: string; label: string }>,
    React.Dispatch<
      React.SetStateAction<Array<{ value: string; label: string }>>
    >
  ];

  siteOptionState: [
    { value: string; label: string },
    React.Dispatch<React.SetStateAction<{ value: string; label: string }>>
  ];
  universityOptionState: [
    { value: string; label: string },
    React.Dispatch<React.SetStateAction<{ value: string; label: string }>>
  ];
  dropdownOptionState: [
    { value: string; label: string },
    React.Dispatch<React.SetStateAction<{ value: string; label: string }>>
  ];
}

/**
 * `useCompetitionOutletContext` is a custom hook that manages and provides the context for various states
 * and configurations of a competition page. It updates state values such as filters, sorting options, team list,
 * and button configurations based on the page being viewed (e.g., 'teams', 'students', 'staff', 'attendees').
 * It also handles logic for dropdown options related to 'site' and 'university', and updates button configurations
 * to enable/disable buttons based on the user's role (e.g., Admin, Coach).
 *
 * @param {string} page - The current page being viewed, which influences the button configurations and dropdown options.
 * @param {boolean} [reRender] - An optional flag to trigger re-rendering and state updates.
 * @param {string} [dropdown] - The dropdown type ('site' or 'university') for filtering options.
 * @returns {CompetitionPageContext} The current context state with all relevant values and functions, including:
 *  - Filters, sorting options, and search terms.
 *  - States for editing status, team lists, students, attendees, staff, and button configurations.
 *  - Dropdown options for site and university filtering.
 */
export const useCompetitionOutletContext = (
  page: string,
  reRender?: boolean,
  dropdown?: string
) => {
  const context = useOutletContext<CompetitionPageContext>();
  const {
    setFilters,
    editingStatusState: [, setIsEditingStatus],
    teamIdsState: [, setApproveTeamIds],
    siteOptionState: [siteOption, setSiteOption],
    roles,
    editingNameStatusState: [, setIsEditingNameStatus],
    rejectedTeamIdsState: [, setRejectedTeamIds],
    buttonConfigurationState: [, setButtonConfiguration],
    universityOptionsState: [universityOptions],
    siteOptionsState: [siteOptions],
    dropdownOptionsState: [, setDropdownOptions],
    dropdownOptionState: [dropdownOption, setDropdownOption],
    universityOptionState: [universityOption, setUniversityOption],
  } = context;

  useEffect(() => {
    setIsEditingStatus(false);
    setApproveTeamIds([]);
    setFilters({});
    setIsEditingNameStatus(false);
    setRejectedTeamIds([]);

    if (dropdown === "site") {
      setDropdownOptions(siteOptions);
      setDropdownOption(siteOption);
    } else {
      setDropdownOptions(universityOptions);
      setDropdownOption(universityOption);
    }

    // enable the team buttons on the team page and not on the non-team page
    if (page === "teams") {
      setButtonConfiguration((p) => ({
        ...p,
        enableTeamButtons:
          roles.includes(CompetitionRole.Admin) ||
          roles.includes(CompetitionRole.Coach),
        enableStudentButtons: false,
        enableStaffButtons: false,
        enableAttendeesButtons: false,
      }));
      return;
    }

    if (page === "students") {
      setButtonConfiguration((p) => ({
        ...p,
        enableTeamButtons: false,
        enableStudentButtons: true,
        enableStaffButtons: false,
        enableAttendeesButtons: false,
      }));
      return;
    }

    if (page === "staff") {
      setButtonConfiguration((p) => ({
        ...p,

        enableTeamButtons: false,
        enableStudentButtons: false,
        enableStaffButtons: true,
        enableAttendeesButtons: false,
      }));
      return;
    }

    if (page === "attendees") {
      setButtonConfiguration((p) => ({
        ...p,

        enableTeamButtons: false,
        enableStudentButtons: false,
        enableStaffButtons: false,
        enableAttendeesButtons: true,
      }));
      return;
    }

    setButtonConfiguration((p) => ({
      ...p,
      enableTeamButtons: false,
      enableStudentButtons: false,
      enableStaffButtons: false,
      enableAttendeesButtons: false,
    }));
    return;
  }, [roles, siteOptions, universityOptions, reRender]);

  useEffect(() => {
    if (dropdown === "site") {
      setSiteOption(dropdownOption);
    } else {
      setUniversityOption(dropdownOption);
    }
  }, [dropdownOption]);

  return context;
};
