import { DashInfo } from "./hooks/useDashInfo";
import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendRequest } from "../../utility/request";
import {
  StyledCompetitionGrid,
  StyledContentArea,
  StyledDashboardContent,
  StyledFilterTagButton,
  StyledOverflowFlexBackground,
  StyledRemoveFilterIcon,
} from "./Dashboard.styles";
import { PageHeader } from "../../components/page_header/PageHeader";
import { ResponsiveActionButton } from "../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { IoIosCreate } from "react-icons/io";
import { MdAssignmentAdd } from "react-icons/md";
import { StyledInput } from "../Account/Account.styles";
import { StyledErrorMessage } from "../general_styles/error_styles";
import { CompCard } from "./subcomponents/CompCard";
import { RegisterPopUp } from "../../components/general_utility/RegisterPopUp";
import { useUserContext } from "../../components/general_utility/UserContext";
import { UserType } from "../../../shared_types/User/User";

export interface Competition {
  compName: string;
  location: string;
  compDate: string;
  roles: string[];
  compId: string;
  compCreatedDate: string;
};

interface DashboardsProps {
  dashInfo: DashInfo;
};

/**
 * A React component that is the central dashboard interface for all ysers
 *
 * A functional component that represents the user's dashboard, displaying a list of competitions,
 * and allowing users to register for competitions, filter and sort the competitions, and manage their
 * dashboard settings. The component dynamically adjusts based on whether the user is an admin or a student.
 * It includes a registration button and filters competitions based on search, location, roles, status, and year.
 *
 * @param {DashboardsProps} dashInfo - The dashboard information of the logged-in user, including their
 * preferred name, affiliation, and profile picture.
 * @returns {JSX.Element} - The dashboard page with competitions displayed as cards, a filter bar,
 * and a registration section with popups for success or team join notifications.
 */
export const Dashboard: FC<DashboardsProps> = ({ dashInfo }) => {
  const [filters, setFilters] = useState<{ [field: string]: string[] }>({});

  const [searchTerm, setSearchTerm] = useState("");

  const [sortOption, setSortOption] = useState<string | null>(null);
  const sortOptions = [
    { label: "Default", value: "original" },
    { label: "Alphabetical (Name)", value: "name" },
    { label: "Competition Date", value: "date" },
    { label: "Alphabetical (Location)", value: "location" },
    { label: "Time Remaining", value: "timeRemaining" },
  ];

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [userType, setUserType] = useState<string>("");
  const navigate = useNavigate();
  const { userData } = useUserContext();

  // Fetches the user type and competitions data when the component mounts
  useEffect(() => {
    (async () => {
      try {
        setUserType(userData?.role || UserType.USER);
        setIsAdmin(userData?.role === UserType.ADMIN);
        setIsLoaded(true);

        // const fakeComps = await sendRequest.get<{
        //   competitions: Competition[];
        // }>("/competitions/list");
        // const formattedCompetitions = fakeComps.data.competitions.map(
        //   (comp) => ({
        //     ...comp,
        //     compDate: new Date(comp.compDate).toISOString().split("T")[0],
        //     compCreatedDate: new Date(comp.compCreatedDate)
        //       .toISOString()
        //       .split("T")[0],
        //   })
        // );
        // setCompetitions(formattedCompetitions);
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          setIsLoaded(false);
          navigate("/");
          console.log("Authentication Error: ", error);
        });
      }
    })();
  }, []);

  // "YYYY-MM-DD" format
  const today = new Date().toISOString().split("T")[0];

  // Filter options based on the Competition fields (location, role, status, year)
  const filterOptions = {
    Location: Array.from(
      new Set(competitions.map((comp) => comp.location))
    ).sort(),
    Role: Array.from(new Set(competitions.flatMap((comp) => comp.roles))),
    Status: ["Completed", "Upcoming"],
    Year: Array.from(
      new Set(competitions.map((comp) => comp.compDate.split("-")[0]))
    ).sort((a, b) => parseInt(a) - parseInt(b)),
  };

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

  // Checks if a competition matches the current search term
  const matchesSearch = (comp: Competition) => {
    const searchLower = searchTerm.toLowerCase();
    const compDateMonth = new Date(comp.compDate)
      .toLocaleString("default", { month: "long" })
      .toLowerCase();

    return (
      comp.compName.toLowerCase().includes(searchLower) ||
      comp.location.toLowerCase().includes(searchLower) ||
      comp.roles.some((role) => role.toLowerCase().includes(searchLower)) ||
      compDateMonth.includes(searchLower)
    );
  };

  // Filters the list of competitions based on the current search term
  const filteredCompetitions = competitions.filter((comp) => {
    return (
      matchesSearch(comp) &&
      Object.keys(filters).every((field) => {
        if (!filters[field].length) return true;
        if (field === "Status") {
          return (
            (comp.compDate < today && filters[field].includes("Completed")) ||
            (comp.compDate >= today && filters[field].includes("Upcoming"))
          );
        }
        if (field === "Year") {
          return filters[field].includes(comp.compDate.split("-")[0]);
        }
        return filters[field].some((filterValue) => {
          if (field === "Location") {
            return comp.location === filterValue;
          }
          if (field === "Role") {
            return comp.roles.includes(filterValue);
          }
          return false;
        });
      })
    );
  });

  // Sorts the filtered competitions based on the selected sort option
  const sortedCompetitions = [...filteredCompetitions].sort((a, b) => {
    const defaultIndices = filteredCompetitions.map((comp) => comp.compId);

    switch (sortOption) {
      case "name":
        return a.compName.localeCompare(b.compName);
      case "date":
        return new Date(a.compDate).getTime() - new Date(b.compDate).getTime();
      case "location":
        return a.location.localeCompare(b.location);
      case "timeRemaining": {
        const aRemaining = new Date(a.compDate).getTime() - Date.now();
        const bRemaining = new Date(b.compDate).getTime() - Date.now();
        return aRemaining - bRemaining;
      }
      case "original":
        return (
          defaultIndices.indexOf(a.compId) - defaultIndices.indexOf(b.compId)
        );
      default:
        return 0;
    }
  });

  const location = useLocation();
  const [isRegoSucessPopUpOpen, setRegoSuccessPopUp] = useState(false);

  useEffect(() => {
    if (location.state?.isRegoSuccessPopUpOpen) {
      setRegoSuccessPopUp(true);
    }
  }, [location.state]);

  const [isStaffRegoPopUpOpen, setStaffRegoPopUpOpen] = useState(false);
  useEffect(() => {
    if (location.state?.isStaffRegoPopUpOpen) {
      setStaffRegoPopUpOpen(true);
    }
  }, [location.state]);

  const [isJoinPopUpOpen, setIsJoinPopUpOpen] = useState(false);
  const [teamName, setTeamName] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.joined) {
      setTeamName(location.state.teamName);
      setIsJoinPopUpOpen(true);
    }
  }, [location.state]);

  const [compRegisterCode, setCompRegisterCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegisterConfirm = async () => {
    const validateCode = async () => {
      try {
        await sendRequest.get("/competition/student/status", {
          code: compRegisterCode,
        });

        setErrorMessage(null);
        return true;
      } catch (error) {
        console.error("Failed to validate competition code:", error);
        setErrorMessage("Invalid competition code. Please try again.");
        return false;
      }
    };

    return await validateCode();
  };

  return isLoaded && (
    <StyledOverflowFlexBackground className="dashboard--StyledOverflowFlexBackground-0">
      <StyledDashboardContent className="dashboard--StyledDashboardContent-0">
        {/* <CompCreatePopUp isOpen={isPopUpOpen} onClose={handleClosePopUp} message={message} code={code} /> */}
        <PageHeader
          pageTitle="Dashboard"
          pageDescription={`Welcome back, ${dashInfo.preferredName}!`}
          sortOptions={sortOptions}
          filterOptions={filterOptions}
          sortOptionState={{ sortOption, setSortOption }}
          filtersState={{ filters, setFilters }}
          searchTermState={{ searchTerm, setSearchTerm }}
        >
          {isAdmin && (
            <ResponsiveActionButton
              icon={<IoIosCreate />}
              label="Create"
              question="Create a new competition?"
              redirectPath="/competition/create"
              // handleClick={handleCreateClick}
              actionType="secondary"
            />
          )}

          <ResponsiveActionButton
            icon={<MdAssignmentAdd />}
            label="Register"
            question="Register for a new competition?"
            redirectPath={
              userType === "student"
                ? `/competition/information/${compRegisterCode}`
                : `/competition/staff/register/${compRegisterCode}`
            }
            actionType="primary"
            handleSubmit={handleRegisterConfirm}
            timeout={2}
            handleClose={() => setErrorMessage(null)}
          >
            <div>
              <StyledInput
                type="text"
                placeholder="COMP1234"
                onChange={(e) => {
                  setCompRegisterCode(e.target.value);
                }}
                className="dashboard--StyledInput-0" />
            </div>

            <div>
              {errorMessage && (
                <StyledErrorMessage
                  style={{ marginTop: "10px" }}
                  className="dashboard--StyledErrorMessage-0">
                  {errorMessage}
                </StyledErrorMessage>
              )}
            </div>
          </ResponsiveActionButton>
        </PageHeader>
        {/* Active Filters Display */}
        <div>
          {Object.entries(filters).map(([field, values]) =>
            values.map((value) => (
              <StyledFilterTagButton
                key={`${field}-${value}`}
                className="dashboard--StyledFilterTagButton-0">
                {value}
                <StyledRemoveFilterIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter(field, value);
                  }}
                  className="dashboard--StyledRemoveFilterIcon-0" />
              </StyledFilterTagButton>
            ))
          )}
        </div>
        <StyledContentArea className="dashboard--StyledContentArea-0">
          <StyledCompetitionGrid className="dashboard--StyledCompetitionGrid-0">
            {sortedCompetitions.map((comp, index) => (
              <CompCard
                key={index}
                compName={comp.compName}
                location={comp.location}
                compDate={comp.compDate}
                roles={comp.roles}
                compId={comp.compId}
                compCreationDate={comp.compCreatedDate}
              />
            ))}
          </StyledCompetitionGrid>
          {isRegoSucessPopUpOpen && (
            <RegisterPopUp 
              isOpen={isRegoSucessPopUpOpen}
              onClose={() => setRegoSuccessPopUp(false)}
              isRego={true}
            />
          )}
          {isJoinPopUpOpen && (
            <RegisterPopUp
              isOpen={isJoinPopUpOpen}
              onClose={() => setIsJoinPopUpOpen(false)}
              teamName={location.state ? location.state.teamName : teamName}
              isTeamJoin={true}
            />
          )}
          {isStaffRegoPopUpOpen && (
            <RegisterPopUp
              isOpen={isStaffRegoPopUpOpen}
              onClose={() => setStaffRegoPopUpOpen(false)}
              isStaffRego={true}
            />
          )}
        </StyledContentArea>
      </StyledDashboardContent>
    </StyledOverflowFlexBackground>
  );
};
