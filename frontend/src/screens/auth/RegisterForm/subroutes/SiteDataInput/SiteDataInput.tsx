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
  CreateAccountButton,
  Title,
} from "./SiteDataInput.styles";
import DropdownInput from "../../../../../components/general_utility/DropDownInput";
import DescriptiveTextInput from "../../../../../components/general_utility/DescriptiveTextInput";
import MultiRadio from "../../../../../components/general_utility/MultiRadio";
import { dietaryOptions, tShirtOptions } from "./SiteDataOptions";
import { sendRequest } from "../../../../../utility/request";

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
  
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    
        try {
          const endpoint =
            formData.role === "Staff" ? "/staff/register" : "/student/register";
    
          await sendRequest.post(endpoint, {
            name: `${formData.firstName} ${formData.lastName}`,
            preferredName: formData.preferredName,
            gender: formData.gender,
            email: formData.email,
            password: formData.password,
            bio: formData.bio,
            referrer: formData.referrer,
          });
    
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("Error during registration:", error);
        }
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
          <Title>Club Information</Title>

          <DescriptiveTextInput
            label="Verify Question"
            descriptor="Please introduce yourself to our club"
            placeholder=""
            required={false}
            value={formData.bio || ""}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            width="100%"
          />

          <DescriptiveTextInput
            label="Referrer"
            descriptor="Who do you know in the team?"
            placeholder=""
            required={false}
            value={formData.referrer || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                referrer: e.target.value,
              })
            }
            width="100%"
            height="35%"
          />

          <ButtonContainer>
            <Button onClick={() => navigate("/accountinformation")}>
              Back
            </Button>

            <CreateAccountButton
              disabled={!formData.bio || !formData.referrer}
              onClick={handleSubmit}
              className="institution-data-input--StyledCreateAccountButton-0">Create Account
            </CreateAccountButton>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </StyledFlexBackground>
  );
};
