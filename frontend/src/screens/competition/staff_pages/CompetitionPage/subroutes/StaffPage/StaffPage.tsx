import { CompetitionRole } from "../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccess } from "../../../../../../../shared_types/Competition/staff/StaffInfo";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";
import { FC, useEffect } from "react";
import Fuse from "fuse.js";
import {
  StyledFilterTagButton,
  StyledRemoveFilterIcon,
} from "../../../../../dashboard/Dashboard.styles";
import { StyledFlexBackground } from "../../../../../../components/general_utility/Background";
import { StyledNarrowDisplayDiv, StyledWideDisplayDiv } from "../StudentsPage/StudentPage.styles";
import { NarrowStaffCard } from "./subcomponents/NarrowStaffCard";
import { WideStaffHeader } from "./subcomponents/WideStaffHeader";
import { WideStaffCard } from "./subcomponents/WideStaffCard";

const STAFF_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
];

const STAFF_DISPLAY_FILTER_OPTIONS = {
  Access: [StaffAccess.Accepted, StaffAccess.Pending, StaffAccess.Rejected],
  Roles: [
    CompetitionRole.Admin,
    CompetitionRole.Coach,
    CompetitionRole.SiteCoordinator,
  ],
};

/**
 * A React functional component that displays and manages the staff list for a competition.
 *
 * The `StaffPage` component provides functionality for filtering, sorting, and searching through a list
 * of staff members associated with a specific competition. It allows users to view staff details in both
 * narrow and wide display formats, toggle filters, and sort by various criteria such as name or access level.
 *
 * @returns {JSX.Element} - A comprehensive staff management page, including filtering options, a search bar,
 * and sortable staff displays in narrow and wide formats.
 *
 */
export const StaffPage: FC = () => {
  const {
    filters,
    sortOption,
    searchTerm,
    removeFilter,
    universityOptionState: [universityOption, ],
    setFilterOptions,
    setSortOptions,
    staffListState: [staffList, setStaffList],
  } = useCompetitionOutletContext("staff");

  // Initialises the sorting and filtering options when the component mounts
  useEffect(() => {
    setSortOptions(STAFF_DISPLAY_SORT_OPTIONS);
    setFilterOptions(STAFF_DISPLAY_FILTER_OPTIONS);
  }, []);

  // Filters the staff list based on access, roles and university affiliations
  const filteredStaff = staffList.filter((staffDetails) => {
    if (filters.Access) {
      if (
        !filters.Access.some(
          (staffAccess) => staffAccess === staffDetails.access
        )
      ) {
        return false;
      }
    }

    if (filters.Roles) {
      if (
        !staffDetails.roles ||
        !filters.Roles.some((role) =>
          staffDetails.roles!.includes(role as CompetitionRole)
        )
      ) {
        return false;
      }
    }

    if (
      !(universityOption.value === "") &&
      !(staffDetails.universityName === universityOption.label)
    ) {
      return false;
    }

    return true;
  });

  // Sorts the filtered staff list based on the selected sort option
  const sortedStaff = filteredStaff.sort((staffDetails1, staffDetails2) => {
    if (sortOption === "name") {
      return staffDetails1.name.localeCompare(staffDetails2.name);
    }

    return 0;
  });

  // Initialiases a Fuse.js instance for performing fuxxy search on the sorted staff
  // list
  const fuse = new Fuse(sortedStaff, {
    keys: ["name", "roles", "universityName", "access", "email"],
    threshold: 0.5,
  });

  // Searches the sorted staff list using Fuse.js if a search term is provided
  let searchedStaff;
  if (searchTerm) {
    searchedStaff = fuse.search(searchTerm);
  } else {
    searchedStaff = sortedStaff.map((staff) => {
      return { item: staff };
    });
  }

  return <>
  <div>
    {Object.entries(filters).map(([field, values]) =>
      values.map((value) => (
      <StyledFilterTagButton
        key={`${field}-${value}`}
        className="staff-page--StyledFilterTagButton-0">
        {value}
        <StyledRemoveFilterIcon
          onClick={(e) => {
          e.stopPropagation();
          removeFilter(field, value);
          }}
          className="staff-page--StyledRemoveFilterIcon-0" />
      </StyledFilterTagButton>
      ))
    )}
  </div>
  <StyledFlexBackground className="staff-page--StyledFlexBackground-0">
    <StyledNarrowDisplayDiv className="staff-page--StyledNarrowDisplayDiv-0">
      {searchedStaff.map(({ item: staffDetails }, index) => {
        return (
          <NarrowStaffCard key={`${staffDetails.email}${index}`} staffDetails={staffDetails} staffListState={[staffList, setStaffList]} />
        );
      })}
    </StyledNarrowDisplayDiv>
    <StyledWideDisplayDiv className="staff-page--StyledWideDisplayDiv-0">
      <WideStaffHeader />
      {searchedStaff.map(({ item: staffDetails }, index) => {
        return (
          <WideStaffCard key={`${staffDetails.email}${index}`} staffDetails={staffDetails} staffListState={[staffList, setStaffList]} />
        );
      })}
    </StyledWideDisplayDiv>
  </StyledFlexBackground>
  </>;
};
