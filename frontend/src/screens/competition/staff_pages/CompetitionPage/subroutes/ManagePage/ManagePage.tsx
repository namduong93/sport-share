import { FC, SetStateAction, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StaffInfo } from "../../../../../../../shared_types/Competition/staff/StaffInfo";
import { CompetitionRole } from "../../../../../../../shared_types/Competition/CompetitionRole";
import { sendRequest } from "../../../../../../utility/request";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";
import { ActionType } from "./StaffActionCardTypes";
import {
  FaChair,
  FaChevronLeft,
  FaCopy,
  FaEdit,
  FaFileSignature,
} from "react-icons/fa";
import { Announcement } from "../../../../../../../shared_types/Competition/staff/Announcement";
import {
  EditCourse,
  EditRego,
} from "../../../../../../../shared_types/Competition/staff/Edit";
import { CourseCategory } from "../../../../../../../shared_types/University/Course";
import { CompetitionSiteCapacity } from "../../../../../../../shared_types/Competition/CompetitionSite";
import { CompetitionInformation } from "../../../../../../../shared_types/Competition/CompetitionDetails";
import {
  StyledActionCard,
  StyledActionsContainer,
  StyledAssignSeatsPage,
  StyledBackButton,
  StyledCardIcon,
  StyledCardText,
  StyledCode,
  StyledCodeCardText,
  StyledCopyCard,
  StyledManageContainer,
  StyledStandardContainerDiv,
  StyledTitle2,
} from "./ManagePage.styles";
import { AssignSeats } from "./subcomponents/AssignSeats/AssignSeats";
import { BioChangePopUp } from "./subcomponents/BioChangePopup/BioChangePopUp";
import { EditCompRegoPopUp } from "./subcomponents/EditCompRegistrationPopup/EditCompRegoPopUp";
import { EditSiteCapacityPopUp } from "./subcomponents/EditSiteCapacityPopup/EditSiteCapacityPopUp";
import { EditCompDataPopup } from "./subcomponents/EditCompDataPopup/EditCompDataPopup";

const defaultAnnouncement = `
The ICPC is the premier global programming competition conducted by and for the world’s universities. It fosters creativity, teamwork, and innovation in building new software programs, and enables students to test their ability to perform well under pressure.

3 students, 5 hours  
1 computer, 12 problems* (typical, but varies per contest)

In 2021, more than 50,000 of the finest students in computing disciplines from over 3,000 universities competed worldwide in the regional phases of this contest. We conduct ICPC contests for the South Pacific region, with top teams qualifying to the World Finals.

The detail can be seen at: [sppcontests.org/south-pacific-icpc](https://sppcontests.org/south-pacific-icpc/)`;

export const DEFAULT_REGO_FIELDS = {
  enableCodeforcesField: true,
  enableNationalPrizesField: true,
  enableInternationalPrizesField: true,
  enableRegionalParticipationField: true,
};

/**
 * `ManagePage` is a React web page component for managing competition-related actions and settings.
 * This page provides an interface for authorized staff to perform various administrative tasks,
 * such as editing competition details, assigning seats, managing registration forms, updating site capacities,
 * and copying competition codes.
 *
 * @returns JSX.Element - A web page with tiles to allow staff members to update competition information.
 */
export const ManagePage: FC = () => {
  const { compId } = useParams();
  const [showManageSite, setShowManageSite] = useState(false);
  const [showContactBio, setShowContactBio] = useState(false);
  const [showEditCapacity, setShowEditCapacity] = useState(false);
  const [showEditRego, setShowEditRego] = useState(false);
  const [showEditComp, setShowEditComp] = useState(false);
  const [currentBio, setCurrentBio] = useState("Default Bio");
  const [staffInfo, setStaffInfo] = useState<StaffInfo>();
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const { 
    universityOptionState: [universityOption],
    siteOptionState: [siteOption, setSiteOption], teamListState: [teamList, setTeamList],
    siteOptionsState: [siteOptions],
    roles: staffRoles,
    compDetails
  } = useCompetitionOutletContext(
    "manage",
    showManageSite,
    showManageSite ? "site" : ""
  );

  const compCode = compDetails.code ?? "COMP1234";

  // Styles the apperance and designates the staff access to competition
  // administration tiles
  const actions = [
    {
      type: "code" as ActionType,
      icon: FaCopy,
      text: `Copy Competition Code`,
      roles: [
        CompetitionRole.Admin,
        CompetitionRole.Coach,
        CompetitionRole.SiteCoordinator,
      ],
    },
    {
      type: "competition" as ActionType,
      icon: FaEdit,
      text: "Edit Competition Details",
      roles: [CompetitionRole.Admin],
    },
    {
      type: "registration" as ActionType,
      icon: FaFileSignature,
      text: "Update Registration Form",
      roles: [CompetitionRole.Admin, CompetitionRole.Coach],
    },
    {
      type: "seat" as ActionType,
      icon: FaChair,
      text: "Assign Seats to Teams",
      roles: [CompetitionRole.Admin, CompetitionRole.SiteCoordinator],
    },
    {
      type: "contact" as ActionType,
      icon: FaChair,
      text: "Update Your Bio and Announcements",
      roles: [CompetitionRole.Admin, CompetitionRole.Coach],
    },
    {
      type: "capacity" as ActionType,
      icon: FaChair,
      text: "Update Your Site Capacity",
      roles: [CompetitionRole.Admin, CompetitionRole.SiteCoordinator],
    },
  ];

  // Filter actions based on at least one matching role
  const filteredActions = actions.filter((action) =>
    action.roles.some((role) => staffRoles.includes(role))
  );

  // Triggers the appearance of Pop Ups depending on
  // tile selected
  const handleActionClick = (actionType: ActionType) => {
    if (actionType === "seat") {
      setShowManageSite(true);
    } else if (actionType === "contact") {
      setShowContactBio(true);
    } else if (actionType === "registration") {
      setShowEditRego(true);
    } else if (actionType === "competition") {
      setShowEditComp(true);
      // setShowEditRego(true);
    } else if (actionType === "capacity") {
      setShowEditCapacity(true);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(compCode);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    // If admin is requesting, check the particular uni they are updating bio and announcement for
    const fetchStaffInfo = async () => {
      try {
        let response;
        if (universityOption.value) {
          const universityId = universityOption.value;
          response = await sendRequest.get<{ staffDetails: StaffInfo }>(
            "/competition/staff/details",
            { compId, universityId }
          );
        } else {
          response = await sendRequest.get<{ staffDetails: StaffInfo }>(
            "/competition/staff/details",
            { compId }
          );
        }
        setCurrentBio(response.data.staffDetails.bio ?? "Default Bio");
        setStaffInfo(response.data.staffDetails);
      } catch (err) {
        console.log("Error fetching staff info", err);
      }
    };

    const fetchAnnouncementMessage = async () => {
      try {
        let response;
        if (universityOption.value) {
          const universityId = universityOption.value;
          response = await sendRequest.get<{ announcement: Announcement }>(
            "/competition/announcement",
            { compId, universityId }
          );
        } else {
          response = await sendRequest.get<{ announcement: Announcement }>(
            "/competition/announcement",
            { compId }
          );
        }

        if (response.data.announcement === undefined) {
          setAnnouncementMessage(defaultAnnouncement);
          return;
        }

        setAnnouncementMessage(response.data.announcement.message);
        console.log(response.data.announcement);
      } catch (err) {
        console.log("Error fetching announcement", err);
      }
    };

    // Call the async functions
    fetchStaffInfo();
    fetchAnnouncementMessage();
  }, [universityOption]);

  // updates the course codes or the staff information respectively
  const handleChange = async () => {
    if (staffInfo) {
      const updatedStaffInfo = {
        ...staffInfo,
        bio: currentBio,
      };
      try {
        if (universityOption.value) {
          const universityId = universityOption.value;
          await sendRequest.put("/competition/staff/details", {
            staffInfo: updatedStaffInfo,
            compId,
            universityId,
          });
        } else {
          await sendRequest.put("/competition/staff/details", {
            staffInfo: updatedStaffInfo,
            compId,
          });
        }
        setShowContactBio(false);
      } catch (err) {
        console.log("Error updating staff info", err);
      }
    }

    try {
      if (universityOption.value) {
        const universityId = universityOption.value;
        await sendRequest.put("/competition/announcement", {
          announcementMessage,
          compId,
          universityId,
        });
      } else {
        await sendRequest.put("/competition/announcement", {
          announcementMessage,
          compId,
        });
      }
    } catch (err) {
      console.log("Error updating announcement info", err);
    }
  };

  const [regoFields, setRegoFields] = useState<EditRego>(DEFAULT_REGO_FIELDS);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [editCourse, setEditCourse] = useState<EditCourse>({
    [CourseCategory.Introduction]: "",
    [CourseCategory.DataStructures]: "",
    [CourseCategory.AlgorithmDesign]: "",
    [CourseCategory.ProgrammingChallenges]: "",
  });

  // Updates the Edit Course object storing the course codes for the University
  // coding courses completed
  const handleEditCourseChange = (category: CourseCategory, value: string) => {
    setEditCourse((prevEditCourse) => ({
      ...prevEditCourse,
      [category]: value,
    }));
  };

  // Ensures that on first load it doesn't request the data since it will be
  // re-requested once the universityOption is set
  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    const fetchRegoFields = async () => {
      const response = await sendRequest.get<{ regoFields: EditRego }>(
        "/competition/staff/rego_toggles",
        { compId, universityId: universityOption.value }
      );
      const { regoFields: receivedRegoFields } = response.data;
      setRegoFields(receivedRegoFields || DEFAULT_REGO_FIELDS);
    };
    fetchRegoFields();
  }, [universityOption]);

  // Packages the EditRego object specifying which questions to hide and
  // sends it to the backend for storage, where EditRego is an object
  // with boolean fields for removable questions on the registration form
  const handleRegoEditSubmit = async (regoFields: EditRego) => {
    await sendRequest.post("/competition/staff/update_rego_toggles", {
      compId: parseInt(compId as string),
      regoFields,
      universityId: parseInt(universityOption.value),
    });

    await sendRequest.put("/competition/staff/update_courses", {
      compId,
      editCourse,
      universityId: universityOption.value
        ? parseInt(universityOption.value)
        : undefined,
    });
  };
  
  const [siteList, setSiteList] = useState<
    CompetitionSiteCapacity[] | undefined
  >();

  useEffect(() => {
    const fetchSiteCapacities = async () => {
      const response = await sendRequest.get<{
        site: CompetitionSiteCapacity[];
      }>("/competition/site/capacity", {
        compId,
        ids: siteOptions.map((siteOption) => siteOption.value),
      });
      const { site: siteCapacities } = response.data;
      setSiteList(siteCapacities);
    };

    fetchSiteCapacities();
  }, []);

  const getSiteCapacity = (siteId: number): number => {
    const foundSite = siteList?.find((site) => site.id === siteId);

    if (foundSite) return foundSite?.capacity;
    return 0;
  };

  const [competitionInfo, setCompetitionInfo] =
    useState<CompetitionInformation>({
      information: "",
      name: "",
      region: "",
      startDate: new Date(),
      earlyRegDeadline: new Date(),
      generalRegDeadline: new Date(),
      code: "",
      siteLocations: [],
      otherSiteLocations: [],
    });

  // Obtains the competition information from the backend for display
  // and update on the Pop Up
  useEffect(() => {
    const fetchCompetitionInfo = async () => {
      try {
        const response = await sendRequest.get<{
          compInfo: CompetitionInformation;
        }>("/competition/information", { compId });
        const competitionData = response.data.compInfo;

        setCompetitionInfo({
          ...competitionData,
          startDate: new Date(competitionData.startDate),
          generalRegDeadline: new Date(competitionData.generalRegDeadline),
          earlyRegDeadline: competitionData.earlyRegDeadline
            ? new Date(competitionData.earlyRegDeadline)
            : undefined,
        });
      } catch (err: unknown) {
        console.error(err);
      }
    };
    fetchCompetitionInfo();
  }, []);

  // Packages edited competition information and sends it to the
  // backend for storage and update, where CompetitionInfo is an
  // object with fields storing the details of the competition
  const handleCompEditSubmit = async (
    competitionInfo: CompetitionInformation
  ) => {
    try {
      const newCompetitionDetails = {
        id: compId,
        name: competitionInfo.name,
        teamSize: 3,
        earlyRegDeadline: competitionInfo.earlyRegDeadline,
        generalRegDeadline: competitionInfo.generalRegDeadline,
        startDate: competitionInfo.startDate,
        siteLocations: competitionInfo.siteLocations,
        code: competitionInfo.code,
        region: competitionInfo.region,
        information: competitionInfo.information,
      };

      await sendRequest.put(
        "/competition/system_admin/update",
        newCompetitionDetails
      );
    } catch (err) {
      console.error("Error updating competition details", err);
    }
  };

  return (
    <StyledManageContainer className="manage-page--StyledManageContainer-0">
      <StyledStandardContainerDiv className="manage-page--StyledStandardContainerDiv-0">
        {showManageSite ? (
          <StyledAssignSeatsPage className="manage-page--StyledAssignSeatsPage-0">
            <StyledBackButton
              onClick={() => setShowManageSite(false)}
              className="manage-page--StyledBackButton-0">
              <FaChevronLeft />Back</StyledBackButton>
            <AssignSeats
              siteName={
                siteOption.value ? siteOption.label : teamList[0].teamSite
              }
              siteCapacity={
                siteOption.value
                  ? getSiteCapacity(parseInt(siteOption.value))
                  : getSiteCapacity(teamList[0].siteId)
              }
              teamListState={[teamList, setTeamList]}
              siteOptionState={[siteOption, setSiteOption]}
            />
          </StyledAssignSeatsPage>
        ) : (
          <>
            <StyledActionsContainer className="manage-page--StyledActionsContainer-0">
              {filteredActions.map((action, index) => (
                <StyledActionCard
                  key={index}
                  onClick={() =>
                    action.type === "code"
                      ? handleCopyCode()
                      : handleActionClick(action.type)
                  }
                  $actionType={action.type}
                  className="manage-page--StyledActionCard-0">
                  {action.type === "code" ? (
                    <StyledCopyCard className="manage-page--StyledCopyCard-0">
                      <StyledCardIcon as={action.icon} className="manage-page--StyledCardIcon-0" />
                      <StyledCodeCardText className="manage-page--StyledCodeCardText-0">{action.text}</StyledCodeCardText>
                      <StyledCode className="manage-page--StyledCode-0">
                        <p>{compCode}</p>
                      </StyledCode>
                    </StyledCopyCard>
                  ) : (
                    <>
                      <StyledCardIcon as={action.icon} className="manage-page--StyledCardIcon-1" />
                      <StyledCardText className="manage-page--StyledCardText-0">{action.text}</StyledCardText>
                    </>
                  )}
                </StyledActionCard>
              ))}
            </StyledActionsContainer>

            {showContactBio && (
              <BioChangePopUp
                onClose={() => setShowContactBio(false)}
                onNext={handleChange}
                bioValue={currentBio}
                announcementValue={announcementMessage}
                onBioChange={(e) => setCurrentBio(e.target.value)}
                onAnnouncementChange={(value: SetStateAction<string>) =>
                  setAnnouncementMessage(value)
                }
              />
            )}

            {showEditRego && (
              <EditCompRegoPopUp
                heading={
                  <StyledTitle2 className="manage-page--StyledTitle2-0">Please select the fields you would like to{"\n"}to remove
                                        from the Competition Registration Form</StyledTitle2>
                }
                onClose={() => setShowEditRego(false)}
                regoFields={regoFields}
                setRegoFields={setRegoFields}
                onSubmit={handleRegoEditSubmit}
                editCourses={editCourse}
                setCourses={handleEditCourseChange}
              />
            )}

            {showEditCapacity && (
              <EditSiteCapacityPopUp
                heading={"Update Site Capacities"}
                onClose={() => setShowEditCapacity(false)}
              />
            )}

            {showEditComp && (
              <EditCompDataPopup
                onClose={() => setShowEditComp(false)}
                competitionInfo={competitionInfo}
                setCompetitionInfo={setCompetitionInfo}
                onSubmit={handleCompEditSubmit}
              />
            )}
          </>
        )}
      </StyledStandardContainerDiv>
    </StyledManageContainer>
  );
};
