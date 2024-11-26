import { FC, useState } from "react";
import { StudentInfo } from "../../../../../shared_types/Competition/student/StudentInfo";
import {
  StyledButtonContainer,
  StyledCloseButton,
  StyledCloseContainer,
  StyledContentContainer,
  StyledField,
  StyledForm,
  StyledHeaderContainer,
  StyledModalContent,
  StyledModalOverlay,
  StyledTitle,
  StyledTitleContainer,
} from "./EditCompUserDetails.styles";
import { FaTimes } from "react-icons/fa";
import {
  StyledColon,
  StyledDescriptor,
  StyledDoubleInputContainer,
  StyledFormLabel,
  StyledText,
} from "../../../competition/register/RegisterForm/subroutes/CompIndividualInput/CompIndividualInput.styles";
import DropdownInputLight from "../../../../components/general_utility/DropDownLight";
import { yearOptions } from "../../../competition/register/RegisterForm/subroutes/CompIndividualInput/CompIndividualInput";
import TextInputLight from "../../../../components/general_utility/TextInputLight";
import RadioButton from "../../../../components/general_utility/RadioButton";
import { CompetitionLevel } from "../../../../../shared_types/Competition/CompetitionLevel";
import DescriptiveTextInput from "../../../../components/general_utility/DescriptiveTextInput";
import { ResponsiveActionButton } from "../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";

interface EditCompPreferencesProps {
  student: StudentInfo;
  onSubmit: (updatedStudent: StudentInfo) => Promise<boolean>;
  onClose: () => void;
};

/**
 * `EditCompDetailsPopUp` is a React web page component that displays a pop up for editing and reviewing
 * entered competition preferences after the user has registered for a competition. It provides relevant input fields
 * to allow users to change their degree, ICPC eligibility, competition level, site attendance,
 * biography, and preferred contact method
 *
 * @returns JSX.Element - A styled container presenting input fields to edit the student's competition preferences
 */
export const EditCompUserDetails: FC<EditCompPreferencesProps> = ({
  student,
  onSubmit,
  onClose,
}) => {
  const [formData, setFormData] = useState<StudentInfo>(student);

  const handleSubmit = async () => {
    onSubmit(formData);
    onClose();
    return true;
  };

  return (
    <StyledModalOverlay className="edit-comp-user-details--StyledModalOverlay-0">
      <StyledModalContent className="edit-comp-user-details--StyledModalContent-0">
        <StyledContentContainer className="edit-comp-user-details--StyledContentContainer-0">
          <StyledHeaderContainer className="edit-comp-user-details--StyledHeaderContainer-0">
            <StyledTitleContainer className="edit-comp-user-details--StyledTitleContainer-0">
              <StyledTitle className="edit-comp-user-details--StyledTitle-0">Edit Competition Details</StyledTitle>
            </StyledTitleContainer>
            <StyledCloseContainer className="edit-comp-user-details--StyledCloseContainer-0">
              <StyledCloseButton
                onClick={onClose}
                className="edit-comp-user-details--StyledCloseButton-0">
                <FaTimes />
              </StyledCloseButton>
            </StyledCloseContainer>
          </StyledHeaderContainer>
          <StyledForm
            onSubmit={handleSubmit}
            className="edit-comp-user-details--StyledForm-0">
            <StyledField className="edit-comp-user-details--StyledField-0">
              <StyledFormLabel className="edit-comp-user-details--StyledFormLabel-0">Degree</StyledFormLabel>
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
                  formData.ICPCEligible === undefined
                    ? ""
                    : formData.ICPCEligible
                    ? "Yes"
                    : "No"
                }
                onOptionChange={(e) => {
                  const isICPCEligible = e.target.value === "Yes";
                  setFormData({ ...formData, ICPCEligible: isICPCEligible });
                }}
                required={true}
                descriptor="Are you ICPC eligible?"
                width="100%"
              />
            </StyledField>
            <StyledField className="edit-comp-user-details--StyledField-1">
              <RadioButton
                label="Competition Level"
                options={["Level A", "Level B", "No Preference"]}
                selectedOption={formData.level}
                onOptionChange={(e) => {
                  setFormData({
                    ...formData,
                    level: e.target.value as CompetitionLevel,
                  });
                }}
                required={true}
                width="100%"
              />
              <StyledFormLabel className="edit-comp-user-details--StyledFormLabel-1">Site Attendance</StyledFormLabel>
              <div style={{ display: "flex", alignContent: "center" }}>
                <StyledText className="edit-comp-user-details--StyledText-0">
                  <em>{formData.siteName}</em>
                </StyledText>
              </div>
              <RadioButton
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
            </StyledField>
            <StyledField className="edit-comp-user-details--StyledField-2">
              <DescriptiveTextInput
                label="Competition Biography"
                descriptor="Please write a short description about yourself that would help others get to know you"
                placeholder="Enter a description"
                required={true}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                width="100%"
              />
            </StyledField>
            <StyledField className="edit-comp-user-details--StyledField-3">
              <StyledFormLabel className="edit-comp-user-details--StyledFormLabel-2">Preferred Contact Method</StyledFormLabel>
              <StyledDescriptor className="edit-comp-user-details--StyledDescriptor-0">Please specify your preferred contact method if you have another preference</StyledDescriptor>
              <StyledDoubleInputContainer className="edit-comp-user-details--StyledDoubleInputContainer-0">
                <TextInputLight
                  label="Platform"
                  placeholder="Please enter"
                  type="text"
                  required={false}
                  value={formData.preferredContact.split(":")[0] || ""}
                  onChange={(e) => {
                    const newPlatform = e.target.value;
                    const currentHandle = formData.preferredContact.split(":")[1] || "";
                    setFormData({ ...formData, preferredContact: `${newPlatform}:${currentHandle}` });
                  }}
                  width="45%"
                />
                <StyledColon className="edit-comp-user-details--StyledColon-0">:</StyledColon>
                <TextInputLight
                  label="Handle"
                  placeholder="Please enter"
                  type="text"
                  required={false}
                  value={formData.preferredContact.split(":")[1] || ""}
                  onChange={(e) => {
                    const newHandle = e.target.value;
                    const currentPlatform = formData.preferredContact.split(":")[0] || "";
                    setFormData({ ...formData, preferredContact: `${currentPlatform}:${newHandle}` });
                  }}
                  width="45%"
                />
              </StyledDoubleInputContainer>
            </StyledField>
          </StyledForm>
          <StyledButtonContainer className="edit-comp-user-details--StyledButtonContainer-0">
            <ResponsiveActionButton 
              actionType="primary" 
              label="Save Changes" 
              question="Are you sure you want to change your competition preferences?" 
              handleSubmit={handleSubmit} 
            />
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledModalContent>
    </StyledModalOverlay>
  );
};
