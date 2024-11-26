import { FC, useEffect, useState } from "react";
import { CompetitionInformation } from "../../../../../../shared_types/Competition/CompetitionDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { sendRequest } from "../../../../../utility/request";
import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
import { CompCreationProgressBar } from "../../../../../components/progress_bar/ProgressBar";
import {
  StyledButton,
  StyledButtonContainer,
  StyledContainer,
  StyledContentContainer,
  StyledDoubleInputContainer,
  StyledHalfText,
  StyledLabel,
  StyledLocationItem,
  StyledLocationList,
  StyledText,
  StyledTitle,
} from "./CompDataConfirmation.styles";

interface University {
  id: number;
  name: string;
};

interface LocationState {
  competitionInfo: CompetitionInformation;
  optionDisplayList: Array<{
    value: string;
    label: string;
    defaultSite: string;
  }>;
};

/**
 * `CompDataConfirmation` is a React web page form component that displays a confirmation page for reviewing and finalizing
 * competition details during the creation process. It provides navigation options to edit the information or confirm
 * and submit the competition data to the backend.
 *
 * @returns JSX.Element - A styled container presenting the previously entered competition details.
 */
export const CompDataConfirmation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { competitionInfo, optionDisplayList } =
    (location.state as LocationState) || {};
  const [institutionOptions, setInstitutionOptions] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>(
          "/universities/list"
        );
        const universities = response.data;

        const options = universities.universities.map((university) => ({
          value: university.id,
          label: university.name,
        }));

        setInstitutionOptions(options);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  const handleBack = () => {
    console.log(competitionInfo);
    navigate("/competition/create", {
      state: { competitionInfo, optionDisplayList },
    });
  };

  // packages the information and sends to the backend for storage
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const {
      name,
      earlyRegDeadline,
      generalRegDeadline,
      startDate,
      region,
      code,
      siteLocations,
      otherSiteLocations,
    } = competitionInfo;
    const payload = {
      name,
      earlyRegDeadline,
      generalRegDeadline,
      startDate,
      region: region,
      code,
      siteLocations: siteLocations.map((location) => ({
        universityId: location.universityId,
        defaultSite: location.defaultSite,
      })),
      otherSiteLocations: (otherSiteLocations || []).map((location) => ({
        universityName: location.universityName,
        defaultSite: location.defaultSite,
      })),
    };
    try {
      const response = await sendRequest.post<{ competitionId: number }>(
        "/competition/system_admin/create",
        payload
      );
      console.log("Response:", response.data);

      const compId = response.data.competitionId;
      navigate(`/competition/page/${compId}`, {
        state: { isSuccessPopUpOpen: true },
      });
    } catch (error) {
      console.error("Error creating competition:", error);
    }
  };

  return (
    <StyledFlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
      className="comp-data-confirmation--StyledFlexBackground-0">
      <CompCreationProgressBar progressNumber={1} />
      <StyledContainer className="comp-data-confirmation--StyledContainer-0">
        <StyledContentContainer className="comp-data-confirmation--StyledContentContainer-0">
          <StyledTitle className="comp-data-confirmation--StyledTitle-0">Competition Details Confirmation</StyledTitle>
          <StyledLabel className="comp-data-confirmation--StyledLabel-0">Competition Name</StyledLabel>
          <StyledText className="comp-data-confirmation--StyledText-0"><em>{competitionInfo?.name}</em></StyledText>
          <StyledLabel className="comp-data-confirmation--StyledLabel-1">Competition Region</StyledLabel>
          <StyledText className="comp-data-confirmation--StyledText-1"><em>{competitionInfo?.region}</em></StyledText>
          <StyledLabel className="comp-data-confirmation--StyledLabel-2">Competition Start</StyledLabel>
          <StyledDoubleInputContainer className="comp-data-confirmation--StyledDoubleInputContainer-0">
            <StyledHalfText className="comp-data-confirmation--StyledHalfText-0">Date</StyledHalfText>
            <StyledHalfText className="comp-data-confirmation--StyledHalfText-1">Time</StyledHalfText>
          </StyledDoubleInputContainer>
          <StyledDoubleInputContainer
            margin={true}
            className="comp-data-confirmation--StyledDoubleInputContainer-1">
            <StyledHalfText className="comp-data-confirmation--StyledHalfText-2"><em>{competitionInfo.startDate.toDateString()}</em></StyledHalfText>
            <StyledHalfText className="comp-data-confirmation--StyledHalfText-3"><em>{competitionInfo.startDate.toLocaleTimeString()}</em></StyledHalfText>
          </StyledDoubleInputContainer>
          {competitionInfo?.earlyRegDeadline && (
            <>
            <StyledLabel className="comp-data-confirmation--StyledLabel-3">Early Bird Registration Deadline</StyledLabel>

            <StyledDoubleInputContainer className="comp-data-confirmation--StyledDoubleInputContainer-2">
              <StyledHalfText className="comp-data-confirmation--StyledHalfText-4">Date</StyledHalfText>
              <StyledHalfText className="comp-data-confirmation--StyledHalfText-5">Time</StyledHalfText>
            </StyledDoubleInputContainer>

            <StyledDoubleInputContainer
              margin={true}
              className="comp-data-confirmation--StyledDoubleInputContainer-3">
              <StyledHalfText className="comp-data-confirmation--StyledHalfText-6"><em>{`${competitionInfo.earlyRegDeadline.toDateString()}`}</em></StyledHalfText>
              <StyledHalfText className="comp-data-confirmation--StyledHalfText-7"><em>{`${competitionInfo.earlyRegDeadline.toLocaleTimeString()}`}</em></StyledHalfText>
            </StyledDoubleInputContainer>
            </>
          )}
          <StyledLabel className="comp-data-confirmation--StyledLabel-4">General Registration Deadline</StyledLabel>
          <StyledDoubleInputContainer className="comp-data-confirmation--StyledDoubleInputContainer-4">
            <StyledHalfText className="comp-data-confirmation--StyledHalfText-8">Date</StyledHalfText>
            <StyledHalfText className="comp-data-confirmation--StyledHalfText-9">Time</StyledHalfText>
          </StyledDoubleInputContainer>
          <StyledDoubleInputContainer
            margin={true}
            className="comp-data-confirmation--StyledDoubleInputContainer-5">
            <StyledHalfText className="comp-data-confirmation--StyledHalfText-10"><em>{`${competitionInfo?.generalRegDeadline.toDateString()}`}</em></StyledHalfText>
            <StyledHalfText className="comp-data-confirmation--StyledHalfText-11"><em>{`${competitionInfo?.generalRegDeadline.toLocaleTimeString()}`}</em></StyledHalfText>
          </StyledDoubleInputContainer>
          <StyledLabel className="comp-data-confirmation--StyledLabel-5">Competition Code</StyledLabel>
          <StyledText className="comp-data-confirmation--StyledText-2"><em>{competitionInfo?.code}</em></StyledText>
          <StyledLabel className="comp-data-confirmation--StyledLabel-6">Site Locations</StyledLabel>
          <StyledLocationList className="comp-data-confirmation--StyledLocationList-0">
            {optionDisplayList.map((displayObject, index) => {
              console.log(institutionOptions);
              return (
                <StyledLocationItem key={index} className="comp-data-confirmation--StyledLocationItem-0">
                  <div>{displayObject.label}</div>
                  <div>{displayObject.defaultSite}</div>
                </StyledLocationItem>
              );
            })}
          </StyledLocationList>
          <StyledButtonContainer className="comp-data-confirmation--StyledButtonContainer-0">
            <StyledButton
              onClick={handleBack}
              className="comp-data-confirmation--StyledButton-0">Back</StyledButton>
            <StyledButton
              onClick={handleConfirm}
              className="comp-data-confirmation--StyledButton-1">Confirm</StyledButton>
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledContainer>
    </StyledFlexBackground>
  );
};
