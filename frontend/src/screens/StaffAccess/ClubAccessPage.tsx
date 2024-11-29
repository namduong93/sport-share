import { FC, useEffect, useState } from "react";
import { UserAccess } from "../../../shared_types/User/User";
// import { fetchStaffRequests } from "./util/fetchStaffRequests";
import Fuse from "fuse.js";
import {
  StyledFilterTagContainer,
  StyledPageBackground,
  StyledStaffContainer,
  StyledStaffRecords,
} from "./ClubAccessPage.styles";
import { PageHeader } from "../../components/page_header/PageHeader";
import { StyledFilterTagButton, StyledRemoveFilterIcon } from "../dashboard/Dashboard.styles";
import { StyledNarrowDisplayDiv, StyledWideDisplayDiv } from "../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentPage.styles";
import { NarrowStaffAccessCard } from "./subcomponents/NarrowStaffAccessCard";
import { WideStaffAccessHeader } from "./subcomponents/WideStaffAccessHeader";
import { WideStaffAccessCard } from "./subcomponents/WideStaffAccessCard";
import { TeamMember } from "../../../shared_types/TeamMember/TeamMember";
import { fetchMemberList } from "./util/fetchMemberList";
import { DEFAULT_TEAM_ID } from "../../../shared_types/Team/Team";
import { sendRequest } from "../../utility/request";

export interface ClubAccessCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  memberDetails: TeamMember;
  memberListState: [
    TeamMember[],
    React.Dispatch<React.SetStateAction<TeamMember[]>>
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
 * A React compoenent displaying and managing member account requests.
 *
 * `ClubAccessPage` allows for the filtering, sorting, and searching of member requests based on different criteria
 * such as access status, name, university affiliation, and email. It also supports approving or rejecting
 * multiple member requests at once.
 *
 * @returns {JSX.Element} - The rendered Member Access page component with filtering, searching, and approval/rejection functionality.
 */
export const ClubAccessPage: FC = () => {
  const [memberList, setMemberList] = useState<Array<TeamMember>>([]);
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
      
      const fetchMembers = async () => {
        try {
          const response = await sendRequest.get<TeamMember[]>(`/teams/${DEFAULT_TEAM_ID}/members`);
          console.log(response);
          setMemberList(response.data);
        } catch (error) {
          setMemberList([]);
        }
      };
    
      fetchMembers();
    }, []);

  // Filtering for member based on selected filters
  const filteredMember = memberList.filter((memberDetails) => {
    if (
      filters["Access"] &&
      filters["Access"].length > 0 &&
      !filters["Access"].includes(memberDetails.meta) // Doing nothing
    ) {
      return false;
    }
    return true;
  });

  // Sorting logic based on the selected sorting option
  const sortedMember = filteredMember.sort((memberDetails1, memberDetails2) => {
    if (sortOption === "name") {
      return memberDetails1.preferredName.localeCompare(memberDetails2.preferredName);
    }
    return 0;
  });

  // Searching for member based on the selected sort option
  const fuse = new Fuse(sortedMember, {
    keys: ["name", "universityName", "access", "email"],
    threshold: 0.5,
  });

  let searchedMember;
  if (searchTerm) {
    searchedMember = fuse.search(searchTerm);
  } else {
    searchedMember = sortedMember.map((member) => {
      return { item: member };
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

  return (
    <StyledPageBackground className="staff-access-page--StyledPageBackground-0">
      <PageHeader
        pageTitle="Club Member"
        pageDescription="Check out who's playing with us in our club today!"
        sortOptions={STAFF_DISPLAY_SORT_OPTIONS}
        sortOptionState={{ sortOption, setSortOption }}
        filterOptions={filterOptions}
        filtersState={{ filters, setFilters }}
        searchTermState={{ searchTerm, setSearchTerm }}
      >
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
            {searchedMember.length > 0 ? (
              searchedMember.map(({ item: memberDetails }) => (
                <NarrowStaffAccessCard
                  key={`staff-wide-${memberDetails.uuid}`}
                  memberDetails={memberDetails}
                  memberListState={[memberList, setMemberList]}
                />
              ))
            ) : (
              <p>No member members found.</p>
            )}
          </StyledStaffRecords>
        </StyledNarrowDisplayDiv>
        <StyledWideDisplayDiv className="staff-access-page--StyledWideDisplayDiv-0">
          <WideStaffAccessHeader />
          <StyledStaffRecords className="staff-access-page--StyledStaffRecords-1">
            {searchedMember.length > 0 ? (
              searchedMember.map(({ item: memberDetails }) => (
                <WideStaffAccessCard
                  key={`staff-wide-${memberDetails.uuid}`}
                  memberDetails={memberDetails}
                  memberListState={[memberList, setMemberList]}
                />
              ))
            ) : (
              <p>No member members found.</p>
            )}
          </StyledStaffRecords>
        </StyledWideDisplayDiv>
      </StyledStaffContainer>
    </StyledPageBackground>
  );
};
