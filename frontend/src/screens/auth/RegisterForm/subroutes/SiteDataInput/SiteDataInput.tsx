import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiStepRegoForm } from "../../hooks/useMultiStepRegoForm";
import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
import { RegoProgressBar } from "../../../../../components/progress_bar/ProgressBar";
import {
  Button,
  ButtonContainer,
  Container,
  ContentContainer,
  NextButton,
  Title,
} from "./SiteDataInput.styles";
import DropdownInput from "../../../../../components/general_utility/DropDownInput";
import DescriptiveTextInput from "../../../../../components/general_utility/DescriptiveTextInput";
import MultiRadio from "../../../../../components/general_utility/MultiRadio";
import { dietaryOptions, tShirtOptions } from "./SiteDataOptions";

/**
 * A React web page form component for collecting site-related information during the registration process.
 *
 * The `SiteDataInput` component collects details about the user's T-shirt size, food allergies, dietary requirements,
 * and accessibility needs. The information is saved to the form context using `useMultiStepRegoForm`.
 * The form provides a dropdown for T-shirt size, text inputs for allergies and accessibility, and multi-radio selection
 * for dietary requirements.
 *
 * @returns {JSX.Element} - A form UI for collecting site-related information during registration.
 */
export const SiteDataInput: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm(); // Access the form context

  const handleNext = () => {
    navigate("/institutioninformation");
  };

  return (
    <StyledFlexBackground
      style={{
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
      className="site-data-input--StyledFlexBackground-0">
      <RegoProgressBar progressNumber={2} />
      <Container>
        <ContentContainer>
          <Title>Site Information</Title>

          <DropdownInput
            label="T-Shirt Size"
            options={tShirtOptions}
            value={formData.tShirtSize}
            required={true}
            onChange={(e) =>
              setFormData({ ...formData, tShirtSize: e.target.value })
            }
            width="100%"
            descriptor="Please refer to the Sizing Guide"
          />

          <DescriptiveTextInput
            label="Food Allergies"
            descriptor="Please let us know if you have any food allergies so that we can ensure your safety"
            placeholder="Enter a description"
            required={false}
            value={formData.foodAllergies || ""}
            onChange={(e) =>
              setFormData({ ...formData, foodAllergies: e.target.value })
            }
            width="100%"
          />

          <MultiRadio
            options={dietaryOptions}
            selectedValues={formData.dietaryRequirements || []}
            onChange={(selectedValues) =>
              setFormData({ ...formData, dietaryRequirements: selectedValues })
            }
            label="Dietary Requirements"
            descriptor="Please select one or more options, or specify 'Other' if applicable"
          />

          <DescriptiveTextInput
            label="Accessibility Requirements"
            descriptor="Please inform us of any accessibility needs you may have"
            placeholder="Enter a description"
            required={false}
            value={formData.accessibilityRequirements || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                accessibilityRequirements: e.target.value,
              })
            }
            width="100%"
          />

          <ButtonContainer>
            <Button onClick={() => navigate("/accountinformation")}>
              Back
            </Button>

            <NextButton disabled={!formData.tShirtSize} onClick={handleNext}>
              Next
            </NextButton>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </StyledFlexBackground>
  );
};
