import { FC, useEffect, useState } from "react";
import { StaffInfo } from "../../../shared_types/Competition/staff/StaffInfo";
import { UserAccess } from "../../../shared_types/User/User";
import { fetchStaffRequests } from "./util/fetchStaffRequests";
import Fuse from "fuse.js";
import { sendRequest } from "../../utility/request";
import {
  StyledFilterTagContainer,
  StyledPageBackground,
  StyledStaffContainer,
  StyledStaffRecords,
} from "./StaffAccessPage.styles";
import { PageHeader } from "../../components/page_header/PageHeader";
import { StaffAccessButtons } from "./subcomponents/StaffAccessButtons";
import { StyledFilterTagButton, StyledRemoveFilterIcon } from "../dashboard/Dashboard.styles";
import { StyledNarrowDisplayDiv, StyledWideDisplayDiv } from "../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentPage.styles";
import { NarrowStaffAccessCard } from "./subcomponents/NarrowStaffAccessCard";
import { WideStaffAccessHeader } from "./subcomponents/WideStaffAccessHeader";
import { WideStaffAccessCard } from "./subcomponents/WideStaffAccessCard";

export interface StaffAccessCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  staffDetails: StaffInfo;
  staffListState: [
    StaffInfo[],
    React.Dispatch<React.SetStateAction<StaffInfo[]>>
  ];
}

const STAFF_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
];

const STAFF_DISPLAY_FILTER_OPTIONS: Record<string, Array<string>> = {
  Access: [UserAccess.Accepted, UserAccess.Pending, UserAccess.Rejected],
};

/**
 * A React compoenent displaying and managing staff account requests.
 *
 * `StaffAccessPage` allows for the filtering, sorting, and searching of staff requests based on different criteria
 * such as access status, name, university affiliation, and email. It also supports approving or rejecting
 * multiple staff requests at once.
 *
 * @returns {JSX.Element} - The rendered Staff Access page component with filtering, searching, and approval/rejection functionality.
 */
export const StaffAccessPage: FC = () => {
  const [staffList, setStaffList] = useState<Array<StaffInfo>>([]);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, Array<string>>>({});
  const [filterOptions, setFilterOptions] = useState<
    Record<string, Array<string>>
  >({});
  const [searchTerm, setSearchTerm] = useState("");

  // Check if filters contain only "Pending"
  const isPendingOnly =
    filters["Access"]?.length === 1 &&
    filters["Access"].includes(UserAccess.Pending);

  useEffect(() => {
    setSortOption(STAFF_DISPLAY_SORT_OPTIONS[0].value);
    setFilterOptions(STAFF_DISPLAY_FILTER_OPTIONS);
    fetchStaffRequests(setStaffList);
  }, []);

  // Filtering for staff based on selected filters
  const filteredStaff = staffList.filter((staffDetails) => {
    if (
      filters["Access"] &&
      filters["Access"].length > 0 &&
      !filters["Access"].includes(staffDetails.userAccess)
    ) {
      return false;
    }
    return true;
  });

  // Sorting logic based on the selected sorting option
  const sortedStaff = filteredStaff.sort((staffDetails1, staffDetails2) => {
    if (sortOption === "name") {
      return staffDetails1.name.localeCompare(staffDetails2.name);
    }
    return 0;
  });

  // Searching for staff based on the selected sort option
  const fuse = new Fuse(sortedStaff, {
    keys: ["name", "universityName", "access", "email"],
    threshold: 0.5,
  });

  let searchedStaff;
  if (searchTerm) {
    searchedStaff = fuse.search(searchTerm);
  } else {
    searchedStaff = sortedStaff.map((staff) => {
      return { item: staff };
    });
  }

  const removeFilter = (field: string, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[field] = updatedFilters[field].filter((v) => v !== value);
      if (updatedFilters[field].length === 0) {
        delete updatedFilters[field];
      }
      return updatedFilters; // trigger render to update filter dropdown
    });
  };

  const handleApproveAll = async (): Promise<boolean> => {
    // Filter by pending
    const pendingStaffListIds = searchedStaff
      .filter(
        (staffDetails) => staffDetails.item.userAccess === UserAccess.Pending
      )
      .map((staffDetails) => staffDetails.item.userId);

    try {
      await sendRequest.post("/user/staff_requests", {
        staffRequests: pendingStaffListIds.map((userId) => ({
          userId,
          access: UserAccess.Accepted,
        })),
      });
    } catch (error) {
      console.error("Error updating staff access: ", error);
      return false;
    }
    return true;
  };

  const handleRejectAll = async (): Promise<boolean> => {
    // Filter by pending
    const pendingStaffListIds = searchedStaff
      .filter(
        (staffDetails) => staffDetails.item.userAccess === UserAccess.Pending
      )
      .map((staffDetails) => staffDetails.item.userId);

    try {
      await sendRequest.post("/user/staff_requests", {
        staffRequests: pendingStaffListIds.map((userId) => ({
          userId,
          access: UserAccess.Rejected,
        })),
      });
    } catch (error) {
      console.error("Error updating staff access: ", error);
      return false;
    }
    return true;
  };

  return (
    <StyledPageBackground className="staff-access-page--StyledPageBackground-0">
      <PageHeader
        pageTitle="Staff Account Management"
        pageDescription="Review pending staff account requests"
        sortOptions={STAFF_DISPLAY_SORT_OPTIONS}
        sortOptionState={{ sortOption, setSortOption }}
        filterOptions={filterOptions}
        filtersState={{ filters, setFilters }}
        searchTermState={{ searchTerm, setSearchTerm }}
      >
        <StaffAccessButtons
          onApproveAll={handleApproveAll}
          onRejectAll={handleRejectAll}
          editingForAll={isPendingOnly}
        />
      </PageHeader>
      <StyledFilterTagContainer className="staff-access-page--StyledFilterTagContainer-0">
        {Object.entries(filters).map(([field, values]) =>
          values.map((value) => (
          <StyledFilterTagButton
            key={`${field}-${value}`}
            className="staff-access-page--StyledFilterTagButton-0">
            {value}
            <StyledRemoveFilterIcon
              onClick={(e) => {
              e.stopPropagation();
              removeFilter(field, value);
              }}
              className="staff-access-page--StyledRemoveFilterIcon-0" />
          </StyledFilterTagButton>
          ))
        )}
      </StyledFilterTagContainer>
      <StyledStaffContainer className="staff-access-page--StyledStaffContainer-0">
        <StyledNarrowDisplayDiv className="staff-access-page--StyledNarrowDisplayDiv-0">
          <StyledStaffRecords className="staff-access-page--StyledStaffRecords-0">
            {searchedStaff.length > 0 ? (
              searchedStaff.map(({ item: staffDetails }) => (
                <NarrowStaffAccessCard
                  key={`staff-wide-${staffDetails.userId}`}
                  staffDetails={staffDetails}
                  staffListState={[staffList, setStaffList]}
                />
              ))
            ) : (
              <p>No staff members found.</p>
            )}
          </StyledStaffRecords>
        </StyledNarrowDisplayDiv>
        <StyledWideDisplayDiv className="staff-access-page--StyledWideDisplayDiv-0">
          <WideStaffAccessHeader />
          <StyledStaffRecords className="staff-access-page--StyledStaffRecords-1">
            {searchedStaff.length > 0 ? (
              searchedStaff.map(({ item: staffDetails }) => (
                <WideStaffAccessCard
                  key={`staff-wide-${staffDetails.userId}`}
                  staffDetails={staffDetails}
                  staffListState={[staffList, setStaffList]}
                />
              ))
            ) : (
              <p>No staff members found.</p>
            )}
          </StyledStaffRecords>
        </StyledWideDisplayDiv>
      </StyledStaffContainer>
    </StyledPageBackground>
  );
};
