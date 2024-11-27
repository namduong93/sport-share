import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMultiStepCompRegoForm } from "../../hooks/useMultiStepCompRegoForm";
import { sendRequest } from "../../../../../../utility/request";
import { SiteLocation } from "../../FormState";
import { StyledFlexBackground } from "../../../../../../components/general_utility/Background";
import { CompRegistrationProgressBar } from "../../../../../../components/progress_bar/ProgressBar";
import {
  StyledAsterisk,
  StyledButton,
  StyledButtonContainer,
  StyledColon,
  StyledContainer,
  StyledContentContainer,
  StyledDescriptor,
  StyledDoubleInputContainer,
  StyledFormLabel,
  StyledText,
  StyledTitle,
} from "./CompIndividualInput.styles";
import DropdownInputLight from "../../../../../../components/general_utility/DropDownLight";
import TextInputLight from "../../../../../../components/general_utility/TextInputLight";
import RadioButton from "../../../../../../components/general_utility/RadioButton";
import DescriptiveTextInput from "../../../../../../components/general_utility/DescriptiveTextInput";

interface User {
  role: "student" | "staff";
  image: string;
  name: string;
  preferredName: string;
  email: string;
  affiliation: string;
  gender: "M" | "F" | "other" | "NB";
  pronouns: "She/Her" | "He/Him" | "They/Them" | "Other";
  tshirtSize: string;
  allergies: string;
  dietaryReqs: string[];
  accessibilityReqs: string;
}

export const yearOptions = [
  { value: "", label: "Please Select" },
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
  { value: "4", label: "4th" },
  { value: "5", label: "5th" },
  { value: "6", label: "6th" },
  { value: "7", label: "7th" },
  { value: "8", label: "8th" },
  { value: "9", label: "9th" },
  { value: "10", label: "10th" },
];

/**
 * A React web page form component for collecting a user's competition preferneces during registration
 * for a competition
 *
 * The `CompExperienceInput` component gathers user data like degree, competition level, ICPC eligibility,
 * and site attendance. The form allows users to input and submit their individual information, including
 * degree details, ICPC eligibility, competition level, and personal biography.
 *
 * @returns {JSX.Element} - A form UI for collecting a user's competition preferences during the competition
 * registration.
 */
export const CompIndividualInput: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepCompRegoForm();
  const { code } = useParams<{ code?: string }>();

  const handleBack = () => {
    navigate(`/competition/information/${code}`);
  };

  const handleNext = () => {
    navigate(`/competition/experience/${code}`);
  };

  function isButtonDisabled(): boolean | undefined {
    const {
      degree,
      degreeYear,
      ICPCEligibility,
      competitionLevel,
      isRemote,
      competitionBio,
    } = formData;
    return (
      degree === "" ||
      degreeYear === 0 ||
      ICPCEligibility === undefined ||
      competitionLevel === "" ||
      isRemote === undefined ||
      competitionBio === ""
    );
  }

  const [, setUser] = useState<User>({
    role: "student",
    image: "",
    name: "",
    preferredName: "",
    email: "",
    affiliation: "",
    gender: "M",
    pronouns: "Other",
    tshirtSize: "",
    allergies: "",
    dietaryReqs: [],
    accessibilityReqs: "",
  });

  // Obtains the User's information from the backend and the default
  // site assigned to the user's institution
  useEffect(() => {
    (async () => {
      try {
        const infoResponse = await sendRequest.get<User>("/user/profile_info");
        setUser(infoResponse.data);
        const siteResponse = await sendRequest.get<{ site: SiteLocation }>(
          "/competition/user/default_site",
          { code }
        );
        setFormData({ ...formData, siteLocation: siteResponse.data.site });
      } catch (error: unknown) {
        console.log("Error fetching user info:", error);
      }
    })();
  }, []);

  return (
    <StyledFlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
      className="comp-individual-input--StyledFlexBackground-0">
      <CompRegistrationProgressBar progressNumber={1} />
      <StyledContainer className="comp-individual-input--StyledContainer-0">
        <StyledContentContainer className="comp-individual-input--StyledContentContainer-0">
          <StyledTitle className="comp-individual-input--StyledTitle-0">Individual Information</StyledTitle>
          <StyledFormLabel className="comp-individual-input--StyledFormLabel-0">Degree</StyledFormLabel>
          <div
            style={{ display: "flex", alignItems: "flex-start", width: "100%" }}
          >
            <DropdownInputLight
              label="Current Year of Study"
              options={yearOptions}
              value={formData.degreeYear?.toString()}
              required={true}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  degreeYear: parseInt(e.target.value),
                })
              }
              width="45%"
            />
          </div>
          <TextInputLight
            label="Degree"
            placeholder="Please enter"
            type="text"
            required={true}
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
            width="100%"
          />
          <RadioButton
            label="ICPC Eligibility"
            options={["Yes", "No"]}
            selectedOption={
              formData.ICPCEligibility === undefined
                ? ""
                : formData.ICPCEligibility
                ? "Yes"
                : "No"
            }
            onOptionChange={(e) => {
              const isICPCEligible = e.target.value === "Yes";
              setFormData({ ...formData, ICPCEligibility: isICPCEligible });
            }}
            required={true}
            descriptor="Are you ICPC eligible?"
            width="100%"
          />
          <RadioButton
            label="Competition Level"
            options={["Level A", "Level B", "No Preference"]}
            selectedOption={formData.competitionLevel}
            onOptionChange={(e) => {
              setFormData({ ...formData, competitionLevel: e.target.value });
            }}
            required={true}
            // descriptor="Are you ICPC eligible?"
            width="100%"
          />
          <StyledFormLabel className="comp-individual-input--StyledFormLabel-1">Site Attendance<StyledAsterisk className="comp-individual-input--StyledAsterisk-0">*</StyledAsterisk>
          </StyledFormLabel>
          <div style={{ display: "flex", alignContent: "center" }}>
            <StyledText className="comp-individual-input--StyledText-0">
              <em>{formData.siteLocation.name}</em>
            </StyledText>
          </div>
          <RadioButton
            // label="Site Attendance"
            options={["Attending On Site", "Attending Remotely"]}
            selectedOption={
              formData.isRemote === undefined
                ? ""
                : formData.isRemote
                ? "Attending Remotely"
                : "Attending On Site"
            }
            onOptionChange={(e) => {
              const isRemote = e.target.value === "Attending Remotely";
              setFormData({ ...formData, isRemote });
            }}
            required={true}
            descriptor={["Will you be attending on site or remotely?"]}
            width="100%"
          />
          <DescriptiveTextInput
            label="Competition Biography"
            descriptor="Please write a short description about yourself that would help others get to know you"
            placeholder="Enter a description"
            required={true}
            value={formData.competitionBio}
            onChange={(e) =>
              setFormData({ ...formData, competitionBio: e.target.value })
            }
            width="100%"
          />
          <StyledFormLabel className="comp-individual-input--StyledFormLabel-2">Preferred Contact Method</StyledFormLabel>
          <StyledDescriptor className="comp-individual-input--StyledDescriptor-0">Please specify your preferred contact method if you have another
                        preference</StyledDescriptor>
          <StyledDoubleInputContainer className="comp-individual-input--StyledDoubleInputContainer-0">
            <TextInputLight
              label="Platform"
              placeholder="Please enter"
              type="text"
              required={false}
              value={formData.platform || ""}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
              width="45%"
            />
            <StyledColon className="comp-individual-input--StyledColon-0">:</StyledColon>
            <TextInputLight
              label="Handle"
              placeholder="Please enter"
              type="text"
              required={false}
              value={formData.handle || ""}
              onChange={(e) =>
                setFormData({ ...formData, handle: e.target.value })
              }
              width="45%"
            />
          </StyledDoubleInputContainer>
          <StyledButtonContainer className="comp-individual-input--StyledButtonContainer-0">
            <StyledButton onClick={handleBack} className="comp-individual-input--StyledButton-0">Back</StyledButton>
            <StyledButton
              $disabled={isButtonDisabled()}
              onClick={handleNext}
              className="comp-individual-input--StyledButton-1">Next</StyledButton>
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledContainer>
    </StyledFlexBackground>
  );
};
