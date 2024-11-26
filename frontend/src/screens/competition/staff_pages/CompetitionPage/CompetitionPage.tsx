import { FC, useEffect, useState } from "react";
import { CompetitionInformation as CompetitionDetails } from "../../../../../shared_types/Competition/CompetitionDetails";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { CompetitionRole } from "../../../../../shared_types/Competition/CompetitionRole";
import { ButtonConfiguration } from "./hooks/useCompetitionOutletContext";
import { SortOption } from "../../../../components/page_header/components/SortSelect";
import { TeamDetails } from "../../../../../shared_types/Competition/team/TeamDetails";
import { StudentInfo } from "../../../../../shared_types/Competition/student/StudentInfo";
import { AttendeesDetails } from "../../../../../shared_types/Competition/staff/AttendeesDetails";
import { StaffInfo } from "../../../../../shared_types/Competition/staff/StaffInfo";
import { sendRequest } from "../../../../utility/request";
import { fetchTeams } from "./utils/fetchTeams";
import { CompetitionSite } from "../../../../../shared_types/Competition/CompetitionSite";
import {
  StyledMainPageDiv,
  StyledOverflowFlexBackground,
  StyledPageOptionsContainerDiv,
} from "./subroutes/CommonSubStyles.styles";
import { PageHeader } from "../../../../components/page_header/PageHeader";
import { TeamPageButtons } from "./subroutes/TeamPage/subcomponents/TeamPageButtons";
import { AttendeesPageButtons } from "./subroutes/AttendeesPage/subcomponents/AttendeesPageButtons";
import { AdvancedDropdown } from "../../../../components/AdvancedDropdown/AdvancedDropdown";
import { CustomToggleSwitch } from "../../../../components/toggle_switch/ToggleSwitch";
import {
  StyledAdminToggleOptionDiv,
  StyledToggleOptionTextSpan,
} from "./CompetitionPage.styles";

/**
 * CompetitionPage is a React functional component that manages and displays
 * information related to a specific competition. It fetches competition details,
 * team lists, student information, staff, attendees, and site data based on
 * the competition ID and user roles.
 *
 * @returns {JSX.Element} - The rendered JSX of the CompetitionPage component.
 */
export const CompetitionPage: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [sortOptions, setSortOptions] = useState<Array<SortOption>>([]);
  const [filters, setFilters] = useState<Record<string, Array<string>>>({});
  const [filterOptions, setFilterOptions] = useState<
    Record<string, Array<string>>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState<Array<CompetitionRole>>([]);
  const [buttonConfiguration, setButtonConfiguration] =
    useState<ButtonConfiguration>({
      enableTeamButtons: false,
      enableAttendeesButtons: false,
      enableStudentButtons: false,
      enableStaffButtons: false,
      enableTeamsChangedButtons: false,
    });

  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const [approveTeamIds, setApproveTeamIds] = useState<Array<number>>([]);
  const [rejectedTeamIds, setRejectedTeamIds] = useState<Array<number>>([]);
  const [registeredTeamIds, setRegisteredTeamIds] = useState<Array<number>>([]);
  const [isEditingNameStatus, setIsEditingNameStatus] =
    useState<boolean>(false);

  const [teamList, setTeamList] = useState<Array<TeamDetails>>([]);
  const [students, setStudents] = useState<Array<StudentInfo>>([]);
  const [attendeesList, setAttendeesList] = useState<Array<AttendeesDetails>>(
    []
  );
  const [staffList, setStaffList] = useState<Array<StaffInfo>>([]);
  const [compDetails, setCompDetails] = useState<CompetitionDetails>({
    name: "",
    earlyRegDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    generalRegDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    siteLocations: [],
    otherSiteLocations: [],
    code: "",
    region: "Unknown",
    information: "",
  });
  const [siteOptions, setSiteOptions] = useState([{ value: "", label: "" }]);
  const [siteOption, setSiteOption] = useState({ value: "", label: "" });
  const [universityOptions, setUniversityOptions] = useState([
    { value: "", label: "" },
  ]);
  const [universityOption, setUniversityOption] = useState({
    value: "",
    label: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState<
    Array<{ value: string; label: string }>
  >([{ value: "", label: "" }]);
  const [dropdownOption, setDropdownOption] = useState({
    value: "",
    label: "",
  });

  useEffect(() => {
    const fetchCompetitionDetails = async () => {
      try {
        const response = await sendRequest.get<{
          competition: CompetitionDetails;
        }>("/competition/details", { compId });
        const { competition } = response.data;
        setCompDetails(competition);
      } catch (error: unknown) {
        console.log("Error fetching competition details: ", error);
      }
    };

    const fetchCompetitionTeams = async () => {
      fetchTeams(compId, setTeamList);
    };

    const fetchStudents = async () => {
      const studentsResponse = await sendRequest.get<{
        students: Array<StudentInfo>;
      }>("/competition/students", { compId: parseInt(compId as string) });
      const { students } = studentsResponse.data;
      setStudents(students);
    };

    const fetchAttendeesList = async () => {
      const attendeesResponse = await sendRequest.get<{
        attendees: Array<AttendeesDetails>;
      }>("/competition/attendees", { compId });
      const { attendees } = attendeesResponse.data;
      setAttendeesList(attendees);
    };

    const fetchStaffList = async () => {
      const staffResponse = await sendRequest.get<{
        staff: Array<StaffInfo>;
      }>("/competition/staff", { compId });
      const { staff } = staffResponse.data;
      setStaffList(staff);
    };

    const fetchSites = async () => {
      try {
        const response = await sendRequest.get<{
          sites: Array<CompetitionSite>;
        }>("/competition/sites", { compId });
        const { sites } = response.data;
        setSiteOptions(
          sites.map((site) => ({ value: String(site.id), label: site.name }))
        );
        setSiteOption({ value: String(sites[0].id), label: sites[0].name });
      } catch (error: unknown) {
        console.error("Error fetching sites:", error);
      }
    };

    const fetchUniversities = async () => {
      const response = await sendRequest.get<{
        universities: Array<{ id: number; name: string }>;
      }>("/universities/list");
      const { universities } = response.data;
      const uniOptions = [
        ...universities.map(({ id, name }) => ({
          value: String(id),
          label: name,
        })),
      ];
      setDropdownOptions(uniOptions);
      setUniversityOptions(uniOptions);

      setUniversityOption({
        value: String(universities[0].id),
        label: universities[0].name,
      });
    };

    const fetchInfo = async () => {
      const roleResponse = await sendRequest.get<{
        roles: Array<CompetitionRole>;
      }>("/competition/roles", { compId });

      const { roles: userRoles } = roleResponse.data;
      setRoles(userRoles);

      if (
        userRoles.includes(CompetitionRole.Admin) ||
        userRoles.includes(CompetitionRole.Coach) ||
        userRoles.includes(CompetitionRole.SiteCoordinator)
      ) {
        fetchCompetitionTeams();
        fetchCompetitionDetails();
      }

      if (
        userRoles.includes(CompetitionRole.Admin) ||
        userRoles.includes(CompetitionRole.Coach)
      ) {
        fetchStudents();
      }

      if (
        userRoles.includes(CompetitionRole.Admin) ||
        userRoles.includes(CompetitionRole.SiteCoordinator)
      ) {
        fetchAttendeesList();
      }

      if (userRoles.includes(CompetitionRole.Admin)) {
        fetchStaffList();
        fetchUniversities();
      }

      fetchSites();
    };

    fetchInfo();
  }, []);

  const removeFilter = (field: string, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[field] = updatedFilters[field].filter((v) => v !== value);
      if (updatedFilters[field].length === 0) {
        delete updatedFilters[field];
      }
      return updatedFilters;
    });
  };

  return (
    <StyledOverflowFlexBackground className="competition-page--StyledOverflowFlexBackground-0">
      <StyledMainPageDiv className="competition-page--StyledMainPageDiv-0">
        <PageHeader
          pageTitle={`${roles[0]} Page`}
          pageDescription="Manage teams and students for your competition"
          sortOptions={sortOptions}
          sortOptionState={{ sortOption, setSortOption }}
          filterOptions={filterOptions}
          filtersState={{ filters, setFilters }}
          searchTermState={{ searchTerm, setSearchTerm }}
        >
          {buttonConfiguration.enableTeamButtons && (
            <TeamPageButtons
              universityOption={universityOption}
              filtersState={[filters, setFilters]}
              editingStatusState={[isEditingStatus, setIsEditingStatus]}
              teamIdsState={[approveTeamIds, setApproveTeamIds]}
              editingNameStatusState={[
                isEditingNameStatus,
                setIsEditingNameStatus,
              ]}
              rejectedTeamIdsState={[rejectedTeamIds, setRejectedTeamIds]}
              registeredTeamIdsState={[registeredTeamIds, setRegisteredTeamIds]}
              teamListState={[teamList, setTeamList]}
              compDetails={compDetails}
            />
          )}

          {buttonConfiguration.enableAttendeesButtons && (
            <AttendeesPageButtons
              attendeesListState={[attendeesList, setAttendeesList]}
              siteOption={siteOption}
              siteOptionsState={[siteOptions, setSiteOptions]}
            />
          )}

          {roles.includes(CompetitionRole.Admin) && (
            <AdvancedDropdown
              style={{ minWidth: "0", maxWidth: "342px", width: "100%" }}
              optionsState={[dropdownOptions, setDropdownOptions]}
              defaultSearchTerm={dropdownOption.label}
              setCurrentSelected={setDropdownOption}
              isExtendable={false}
            />
          )}
        </PageHeader>
        <StyledPageOptionsContainerDiv className="competition-page--StyledPageOptionsContainerDiv-0">
          <CustomToggleSwitch
            style={{ width: "100%", height: "100%" }}
            defaultBorderIndex={0}
          >
            {(roles.includes(CompetitionRole.Admin) ||
              roles.includes(CompetitionRole.Coach) ||
              roles.includes(CompetitionRole.SiteCoordinator)) && (
              <StyledAdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/teams/${compId}`);
                }}
                className="competition-page--StyledAdminToggleOptionDiv-0">
                <StyledToggleOptionTextSpan className="competition-page--StyledToggleOptionTextSpan-0">Teams</StyledToggleOptionTextSpan>
              </StyledAdminToggleOptionDiv>
            )}

            {(roles.includes(CompetitionRole.Admin) ||
              roles.includes(CompetitionRole.Coach)) && (
              <StyledAdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/students/${compId}`);
                }}
                className="competition-page--StyledAdminToggleOptionDiv-1">
                <StyledToggleOptionTextSpan className="competition-page--StyledToggleOptionTextSpan-1">Students</StyledToggleOptionTextSpan>
              </StyledAdminToggleOptionDiv>
            )}

            {roles.includes(CompetitionRole.Admin) && (
              <StyledAdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/staff/${compId}`);
                }}
                className="competition-page--StyledAdminToggleOptionDiv-2">
                <StyledToggleOptionTextSpan className="competition-page--StyledToggleOptionTextSpan-2">Staff</StyledToggleOptionTextSpan>
              </StyledAdminToggleOptionDiv>
            )}

            {roles.includes(CompetitionRole.Admin) && (
              <StyledAdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/site/${compId}`);
                }}
                className="competition-page--StyledAdminToggleOptionDiv-3">
                <StyledToggleOptionTextSpan className="competition-page--StyledToggleOptionTextSpan-3">Site</StyledToggleOptionTextSpan>
              </StyledAdminToggleOptionDiv>
            )}

            {roles.includes(CompetitionRole.SiteCoordinator) && (
              <StyledAdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/site/${compId}`);
                }}
                className="competition-page--StyledAdminToggleOptionDiv-4">
                <StyledToggleOptionTextSpan className="competition-page--StyledToggleOptionTextSpan-4">Attendees</StyledToggleOptionTextSpan>
              </StyledAdminToggleOptionDiv>
            )}

            {(roles.includes(CompetitionRole.Admin) ||
              roles.includes(CompetitionRole.Coach) ||
              roles.includes(CompetitionRole.SiteCoordinator)) && (
              <StyledAdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/manage/${compId}`);
                }}
                className="competition-page--StyledAdminToggleOptionDiv-5">
                <StyledToggleOptionTextSpan className="competition-page--StyledToggleOptionTextSpan-5">Manage</StyledToggleOptionTextSpan>
              </StyledAdminToggleOptionDiv>
            )}
          </CustomToggleSwitch>
        </StyledPageOptionsContainerDiv>
        <Outlet
          context={{
            filters,
            sortOption,
            searchTerm,
            removeFilter,
            setFilters,
            roles,
            filtersState: [filters, setFilters],
            editingStatusState: [isEditingStatus, setIsEditingStatus],
            teamIdsState: [approveTeamIds, setApproveTeamIds],
            editingNameStatusState: [
              isEditingNameStatus,
              setIsEditingNameStatus,
            ],
            rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
            registeredTeamIdsState: [registeredTeamIds, setRegisteredTeamIds],
            teamListState: [teamList, setTeamList],

            setFilterOptions,
            setSortOptions,
            buttonConfigurationState: [
              buttonConfiguration,
              setButtonConfiguration,
            ],
            studentsState: [students, setStudents],
            attendeesListState: [attendeesList, setAttendeesList],
            staffListState: [staffList, setStaffList],
            compDetails,
            siteOptionsState: [siteOptions, setSiteOptions],
            dropdownOptionsState: [dropdownOptions, setDropdownOptions],
            universityOptionsState: [universityOptions, setUniversityOptions],

            siteOptionState: [siteOption, setSiteOption],
            universityOptionState: [universityOption, setUniversityOption],
            dropdownOptionState: [dropdownOption, setDropdownOption],
          }}
        />
      </StyledMainPageDiv>
    </StyledOverflowFlexBackground>
  );
};
