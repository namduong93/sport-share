import { FC, ReactNode, useEffect, useState } from "react";
import { CompetitionInformation } from "../../../../../../../../../shared_types/Competition/CompetitionDetails";
import { dateToUTC, formatDate } from "../../../../../creation/util/formatDate";
import { useTheme } from "styled-components";
import {
  StyledButtonContainer,
  StyledCloseButton,
  StyledCompDetailsEditContainer,
  StyledDeleteIcon,
  StyledDescriptor,
  StyledEditorContainer,
  StyledInfoEditContainer,
  StyledLabel,
  StyledLocationItem,
  StyledLocationList,
  StyledModal,
  StyledModalOverlay,
  StyledRowContainer2,
  StyledTitle2,
} from "./EditCompDataPopup.styles";
import { FaSave, FaTimes } from "react-icons/fa";
import ReactMarkdownEditorLite from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { defaultCompInformation } from "../../../../../../register/RegisterForm/subroutes/CompInformation/CompInformation";
import TextInput from "../../../../../../../../components/general_utility/TextInput";
import { StyledDoubleInputContainer } from "../../../../../creation/CompDataInput/CompDataInput.styles";
import TextInputLight from "../../../../../../../../components/general_utility/TextInputLight";
import SiteLocationDataInput from "../../../../../creation/CompDataInput/subcomponents/SiteLocationDataInput/SiteLocationDataInput";
import { TransparentResponsiveButton } from "../../../../../../../../components/responsive_fields/ResponsiveButton";
import MarkdownIt from "markdown-it";

interface EditCompDetailsProps {
  onClose: () => void;
  competitionInfo: CompetitionInformation;
  setCompetitionInfo: React.Dispatch<
    React.SetStateAction<CompetitionInformation>
  >;
  onSubmit: (competitionInfo: CompetitionInformation) => void;
};

/**
 * `EditCompDetailsPopUp is a React web page component that displays a pop up for editing and reviewing
 * entered competition details after the competition has been created. It provides relevant input fields
 * to change the information, name, code, dates, deadlines and site locations for that competition
 * 
 * @param {EditCompDetailsProps} props - Contains the competition information and functions handling allowing
 * the user to open/close the pop-up, update the competition information, and perform some action when submitted.
 * @returns JSX.Element - A styled container presenting input fields to edit the competition details
 */
export const EditCompDataPopup: FC<EditCompDetailsProps> = ({
  onClose,
  competitionInfo,
  setCompetitionInfo,
  onSubmit,
}) => {
  const [locationError, setLocationError] = useState<ReactNode>("");

  const [optionDisplayList, setOptionDisplayList] = useState<
    Array<{ value: string; label: string; defaultSite: string }>
  >([]);

  const otherSiteLocations = competitionInfo.otherSiteLocations || [];

  const [startDateInput, setStartDateInput] = useState<Date | undefined>();
  const [earlyRegInput, setEarlyRegInput] = useState<Date | undefined>();
  const [generalRegInput, setGeneralRegInput] = useState<Date | undefined>();

  useEffect(() => {
    const { startDate, earlyRegDeadline, generalRegDeadline } = competitionInfo;
    setStartDateInput(startDate);
    setEarlyRegInput(earlyRegDeadline);
    setGeneralRegInput(generalRegDeadline);
  }, []);

  useEffect(() => {
    if (!startDateInput) {
      return;
    }
    setCompetitionInfo((p) => ({
      ...p,
      startDate: dateToUTC(startDateInput),
    }));
  }, [startDateInput]);

  useEffect(() => {
    if (!earlyRegInput) {
      return;
    }
    setCompetitionInfo((p) => ({
      ...p,
      earlyRegDeadline: dateToUTC(earlyRegInput),
    }));
  }, [earlyRegInput]);

  useEffect(() => {
    if (!generalRegInput) {
      return;
    }
    setCompetitionInfo((p) => ({
      ...p,
      generalRegDeadline: dateToUTC(generalRegInput),
    }));
  }, [generalRegInput]);

  useEffect(() => {
    const initialDisplayList = [
      ...competitionInfo.siteLocations.map((site) => ({
        value: String(site.universityId),
        label: String(site.universityName),
        defaultSite: site.defaultSite,
      })),
      ...otherSiteLocations.map((otherSite) => ({
        value: "", // Use empty value for custom sites
        label: otherSite.universityName,
        defaultSite: otherSite.defaultSite,
      })),
    ];

    setOptionDisplayList(initialDisplayList);
  }, [competitionInfo.siteLocations, competitionInfo.otherSiteLocations]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CompetitionInformation
  ) => {
    setCompetitionInfo({ ...competitionInfo, [field]: e.target.value });
  };

  const addSite = (
    option: { value: string; label: string },
    defaultSite: string
  ) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      siteLocations: [
        ...prev.siteLocations,
        {
          universityId: parseInt(option.value),
          defaultSite,
          universityName: option.label,
        },
      ],
    }));

    setOptionDisplayList((prev) => [
      ...prev,
      { value: option.value, label: option.label, defaultSite },
    ]);
  };

  const addOtherSite = (
    option: { value: string; label: string },
    defaultSite: string
  ) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      otherSiteLocations: [
        ...(prev.otherSiteLocations || []),
        { universityName: option.label, defaultSite },
      ],
    }));

    setOptionDisplayList((prev) => [
      ...prev,
      { value: option.value, label: option.label, defaultSite },
    ]);
  };

  const handleAddSiteLocation = (
    currentOption: { value: string; label: string },
    defaultSite: string
  ) => {
    if (!defaultSite) {
      setLocationError(<p>No site name provided</p>);
      return;
    }

    if (
      competitionInfo.siteLocations.some(
        (site) => String(site.universityId) === currentOption.value
      ) ||
      otherSiteLocations.some(
        (otherSite) => otherSite.universityName === currentOption.label
      )
    ) {
      setLocationError(
        <p>
          You have already entered a default site location for this institution
          <br />
          Please delete your previous entry or select a different institution
        </p>
      );
      return;
    }

    setLocationError("");

    // if currentOptions value is empty which will be the case when it's a custom option.
    if (!currentOption.value) {
      addOtherSite(currentOption, defaultSite);

      return;
    }

    addSite(currentOption, defaultSite);
  };

  const handleDeleteSiteLocation = (deleteObject: {
    value: string;
    label: string;
    defaultSite: string;
  }) => {
    setOptionDisplayList((prev) => [
      ...prev.filter(
        (elem) =>
          !(
            elem.value === deleteObject.value &&
            elem.label === deleteObject.label
          )
      ),
    ]);

    if (!deleteObject.value) {
      setCompetitionInfo((prev) => ({
        ...prev,
        otherSiteLocations: (prev.otherSiteLocations || []).filter(
          (elem) => elem.universityName !== deleteObject.label
        ),
      }));

      return;
    }

    setCompetitionInfo((prev) => ({
      ...prev,
      siteLocations: prev.siteLocations.filter(
        (elem) => elem.universityId !== Number(deleteObject.value)
      ),
    }));
  };

  const handleMarkdownChange = (text: string) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      information: text,
    }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    try {
      onSubmit(competitionInfo);
      onClose();

      return true;
    } catch (error) {
      console.error("Error saving competition details:", error);
      return false;
    }
  };

  const theme = useTheme();

  return (
    <StyledModalOverlay className="edit-comp-details-pop-up--StyledModalOverlay-0">
      <StyledModal className="edit-comp-details-pop-up--StyledModal-0">
        <StyledCloseButton
          onClick={onClose}
          className="edit-comp-details-pop-up--StyledCloseButton-0">
          <FaTimes />
        </StyledCloseButton>
        <StyledTitle2 className="edit-comp-details-pop-up--StyledTitle2-0">Edit Competition Details</StyledTitle2>
        <div></div>
        <StyledRowContainer2 className="edit-comp-details-pop-up--StyledRowContainer2-0">
          <StyledInfoEditContainer>
            <StyledLabel className="edit-comp-details-pop-up--StyledLabel-0">Competition Information</StyledLabel>
            <StyledEditorContainer className="edit-comp-details-pop-up--StyledEditorContainer-0">
              <ReactMarkdownEditorLite
                value={
                  competitionInfo.information !== null
                    ? competitionInfo.information
                    : defaultCompInformation
                }
                onChange={({ text }) => handleMarkdownChange(text)}
                style={{ height: "800px" }}
                renderHTML={(text: string) => MarkdownIt().render(text)}
                config={{
                  placeholder: "Edit your Competition Information here...",
                  toolbar: [
                    "bold",
                    "italic",
                    "strikethrough",
                    "header",
                    "|",
                    "unordered-list",
                    "ordered-list",
                    "quote",
                    "|",
                    "link",
                    "image",
                    "|",
                    "preview",
                    "undo",
                    "redo",
                  ],
                }}
              />
            </StyledEditorContainer>
          </StyledInfoEditContainer>
          <StyledCompDetailsEditContainer>
            <TextInput
              label="Competition Name"
              placeholder="Please type"
              type="text"
              required={false}
              value={competitionInfo.name}
              onChange={(e) => handleChange(e, "name")}
              width="100%"
            />

            <TextInput
              label="Competition Region"
              placeholder="Please type"
              type="text"
              required={false}
              value={competitionInfo.region}
              onChange={(e) => handleChange(e, "region")}
              width="100%"
              descriptor="Please specify the region your Competition will be held in"
            />

            <StyledLabel className="edit-comp-details-pop-up--StyledLabel-1">Competition Start</StyledLabel>

            <StyledDoubleInputContainer className="edit-comp-details-pop-up--StyledDoubleInputContainer-0">
              <TextInputLight
                label="Date and Time (UTC Timezone)"
                placeholder="dd/mm/yyyy"
                type="datetime-local"
                required={false}
                value={formatDate(startDateInput)}
                onChange={(e) => setStartDateInput(new Date(e.target.value))}
                width="100%"
              />
            </StyledDoubleInputContainer>

            {competitionInfo.earlyRegDeadline && (
              <>
                <StyledLabel className="edit-comp-details-pop-up--StyledLabel-2">Early Bird Registration Deadline</StyledLabel>
                <StyledDescriptor className="edit-comp-details-pop-up--StyledDescriptor-0">Please set the Date and Time of your Early Bird Registration
                                    Deadline</StyledDescriptor>
                <StyledDoubleInputContainer className="edit-comp-details-pop-up--StyledDoubleInputContainer-1">
                  <TextInputLight
                    label="Date and Time (UTC Timezone)"
                    placeholder="dd/mm/yyyy"
                    type="datetime-local"
                    required={false}
                    value={formatDate(earlyRegInput)}
                    onChange={(e) => setEarlyRegInput(new Date(e.target.value))}
                    width="100%"
                  />
                </StyledDoubleInputContainer>
              </>
            )}

            <StyledLabel className="edit-comp-details-pop-up--StyledLabel-3">General Registration Deadline</StyledLabel>
            <StyledDescriptor className="edit-comp-details-pop-up--StyledDescriptor-1">Please set the Date and Time of your General Registration Deadline</StyledDescriptor>

            <StyledDoubleInputContainer className="edit-comp-details-pop-up--StyledDoubleInputContainer-2">
              <TextInputLight
                label="Date and Time (UTC Timezone)"
                placeholder="dd/mm/yyyy"
                type="datetime-local"
                required={false}
                value={formatDate(generalRegInput)}
                onChange={(e) => setGeneralRegInput(new Date(e.target.value))}
                width="100%"
              />
            </StyledDoubleInputContainer>

            <TextInput
              label="Competition Code"
              placeholder="COMP1234"
              type="text"
              required={false}
              value={competitionInfo.code}
              onChange={(e) => handleChange(e, "code")}
              width="100%"
              descriptor="Please type a unique code that will be used to identify your Competition"
            />

            <SiteLocationDataInput onAddLocation={handleAddSiteLocation} />

            {locationError && (
              <div
                style={{ color: "red", marginTop: "30px", textAlign: "center" }}
              >
                {locationError}
              </div>
            )}

            <StyledLocationList className="edit-comp-details-pop-up--StyledLocationList-0">
              {optionDisplayList.map((displayObject, index) => {
                return (
                  <StyledLocationItem
                    key={`${displayObject.value}${index}${displayObject.defaultSite}`}
                    className="edit-comp-details-pop-up--StyledLocationItem-0">
                    <div>{displayObject.label}</div>
                    <div>{displayObject.defaultSite}</div>
                    <StyledDeleteIcon
                      onClick={() => handleDeleteSiteLocation(displayObject)}
                      className="edit-comp-details-pop-up--StyledDeleteIcon-0">x</StyledDeleteIcon>
                  </StyledLocationItem>
                );
              })}
            </StyledLocationList>
          </StyledCompDetailsEditContainer>
        </StyledRowContainer2>
        <StyledButtonContainer className="edit-comp-details-pop-up--StyledButtonContainer-0">
          <TransparentResponsiveButton
            style={{
              height: "33px",
              backgroundColor: theme.colours.primaryLight,
              maxWidth: "160px",
            }}
            icon={<FaSave />}
            actionType="primary"
            label="Save Changes"
            // question="Are you sure you want to change your competition details?"
            onClick={handleSubmit}
          />
        </StyledButtonContainer>
      </StyledModal>
    </StyledModalOverlay>
  );
};
