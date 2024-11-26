import React, { FC, useEffect, useState } from "react";
import { DashInfo } from "../dashboard/hooks/useDashInfo";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../../../config/backendURLConfig";
import { sendRequest } from "../../utility/request";
import {
  StyledAccountCard,
  StyledAccountContainer,
  StyledAccountItem,
  StyledActionButtons,
  StyledBackground,
  StyledButton,
  StyledButtonGroup,
  StyledCardContainer,
  StyledDetailsCard,
  StyledDetailsText,
  StyledEditIcon,
  StyledEditIconButton,
  StyledInput,
  StyledLabel,
  StyledOption,
  StyledProfileContainer,
  StyledProfileEditContainer,
  StyledProfilePic,
  StyledSelect,
} from "./Account.styles";
import { tShirtOptions } from "../auth/RegisterForm/subroutes/SiteDataInput/SiteDataOptions";

interface User {
  role: "student" | "staff";
  profilePic: string;
  name: string;
  preferredName: string;
  email: string;
  affiliation: string;
  gender: "Male" | "Female" | "Other";
  pronouns: "She/Her" | "He/Him" | "They/Them" | "Other";
  tshirtSize: string;
  allergies: string;
  dietaryReqs: string;
  accessibilityReqs: string;
};

interface AccountProps {
  setDashInfo: React.Dispatch<React.SetStateAction<DashInfo>>;
};

/**
 * A React component to view and edit the current users' account information.
*
* @param {AccountProps} props - React AccountProps specified above
* @returns {JSX.Element} - Web page that requests from the backend the users information which
 * it then displays and allows users to edit before saving and sending the edit request to the
 * backend to save it
*/
export const Account: FC<AccountProps> = ({ setDashInfo }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    role: "student",
    name: "",
    preferredName: "",
    email: "",
    affiliation: "",
    gender: "Other",
    pronouns: "They/Them",
    profilePic: `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`,
    tshirtSize: "",
    allergies: "",
    dietaryReqs: "",
    accessibilityReqs: "",
  });

  const [isEditingUser, setIsEditingUser] = useState(false);

  const [newDetails, setNewDetails] = useState<User>({
    ...user,
    profilePic: `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`,
  });

  // Initialises the editing process by setting newDetails to match the user
  // and toggling to editing mode
  const handleEditUser = () => {
    setNewDetails(user);
    setIsEditingUser(true);
  };

  // updates the user with the edited details and sends a request to backend
  const handleSaveUser = async () => {
    setUser(newDetails);
    setIsEditingUser(false);
    await sendRequest.put("/user/profile_info", newDetails);
    setDashInfo({
      preferredName: newDetails.preferredName,
      affiliation: newDetails.affiliation,
      profilePic: newDetails.profilePic,
    });
  };

  // Resets the newDetails to the original user information and toggles
  // the edit mode off
  const handleCancelUser = () => {
    setNewDetails(user);
    setIsEditingUser(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0];

    if (photoFile) {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(photoFile.type)) {
        alert("Unsupported file format. Please upload a JPEG, PNG, or GIF.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDetails({ ...newDetails, profilePic: reader.result as string });
      };
      reader.readAsDataURL(photoFile);
    }
  };

  // Fetches the user profile data from the backend
  useEffect(() => {
    (async () => {
      try {
        const infoResponse = await sendRequest.get<User>("/user/profile_info");
        setUser(infoResponse.data);
        setIsLoaded(true);
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          setIsLoaded(false);
          navigate("/");
          console.log("Error fetching account details: ", error);
        });
      }
    })();
  }, []);

  return isLoaded &&
    <StyledBackground className="account--StyledBackground-0">
      <StyledAccountContainer className="account--StyledAccountContainer-0">
        <StyledCardContainer className="account--StyledCardContainer-0">
          <StyledAccountCard $isEditing={isEditingUser} className="account--StyledAccountCard-0">
            <StyledProfileEditContainer className="account--StyledProfileEditContainer-0">
              <StyledProfileContainer className="account--StyledProfileContainer-0">
                <StyledProfilePic
                  $imageUrl={newDetails.profilePic || `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg` }
                  className="account--StyledProfilePic-0" />
              </StyledProfileContainer>
              {!isEditingUser && (
                <StyledEditIconButton onClick={handleEditUser} className="account--StyledEditIconButton-0">
                  <StyledEditIcon className="account--StyledEditIcon-0" />
                </StyledEditIconButton>
              )}
            </StyledProfileEditContainer>
            <StyledDetailsCard className="account--StyledDetailsCard-0">
              <StyledAccountItem className="account--StyledAccountItem-0">
                {isEditingUser && <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-0">Profile Picture:</StyledLabel>}
                {isEditingUser && (
                  <StyledInput
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="account--StyledInput-0" />
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-1">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-1">Name:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.name}
                    onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
                    className="account--StyledInput-1" />
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-0">{user.name}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-2">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-2">Preferred Name:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.preferredName}
                    onChange={(e) => setNewDetails({ ...newDetails, preferredName: e.target.value })}
                    className="account--StyledInput-2" />
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-1">{user.preferredName}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-3">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-3">Email:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="email"
                    value={newDetails.email}
                    onChange={(e) => setNewDetails({ ...newDetails, email: e.target.value })}
                    className="account--StyledInput-3" />
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-2">{user.email}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-4">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-4">Affiliation:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.affiliation}
                    onChange={(e) => setNewDetails({ ...newDetails, affiliation: e.target.value })}
                    className="account--StyledInput-4" />
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-3">{user.affiliation}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-5">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-5">Gender:</StyledLabel>
                {isEditingUser ? (
                  <StyledSelect
                    value={newDetails.gender}
                    onChange={(e) => setNewDetails({ ...newDetails, gender: e.target.value as User["gender"] })}
                    className="account--StyledSelect-0">
                    <StyledOption value="Male" className="account--StyledOption-0">Male</StyledOption>
                    <StyledOption value="Female" className="account--StyledOption-1">Female</StyledOption>
                    <StyledOption value="Other" className="account--StyledOption-2">Other</StyledOption>
                  </StyledSelect>
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-4">{user.gender}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-6">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-6">Preferred Pronouns:</StyledLabel>
                {isEditingUser ? (
                  <StyledSelect
                    value={newDetails.pronouns}
                    onChange={(e) => setNewDetails({ ...newDetails, pronouns: e.target.value as User["pronouns"] })}
                    className="account--StyledSelect-1">
                    <StyledOption value="She/Her" className="account--StyledOption-3">She/Her</StyledOption>
                    <StyledOption value="He/Him" className="account--StyledOption-4">He/Him</StyledOption>
                    <StyledOption value="They/Them" className="account--StyledOption-5">They/Them</StyledOption>
                    <StyledOption value="Other" className="account--StyledOption-6">Other</StyledOption>
                  </StyledSelect>
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-5">{user.pronouns}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-7">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-7">T-Shirt Size:</StyledLabel>
                {isEditingUser ? (
                  <StyledSelect
                    value={newDetails.tshirtSize}
                    onChange={(e) => setNewDetails({ ...newDetails, tshirtSize: e.target.value })}
                    className="account--StyledSelect-2">
                    {tShirtOptions.map((option) => (
                      <StyledOption className={`account-StyledOption-${option.value}`} key={option.value} value={option.value} >{option.label}</StyledOption>
                      ))}
                    <StyledOption value="Other" className="account--StyledOption-13">Other</StyledOption>
                  </StyledSelect>
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-6">{user.tshirtSize}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-8">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-8">Dietary Preferences:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.dietaryReqs}
                    onChange={(e) => setNewDetails({ ...newDetails, dietaryReqs: e.target.value })}
                    className="account--StyledInput-5" />
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-7">{user.dietaryReqs}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-9">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-9">Allergy Preferences:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.allergies}
                    onChange={(e) => setNewDetails({ ...newDetails, allergies: e.target.value })}
                    className="account--StyledInput-6" />
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-8">{user.allergies}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-10">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-10">Accessibility Preferences:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.accessibilityReqs}
                    onChange={(e) => setNewDetails({ ...newDetails, accessibilityReqs: e.target.value })}
                    className="account--StyledInput-7" />
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-9">{user.accessibilityReqs}</StyledDetailsText>
                )}
              </StyledAccountItem>
            </StyledDetailsCard>
            <StyledActionButtons className="account--StyledActionButtons-0">
              {isEditingUser && (
                <StyledButtonGroup className="account--StyledButtonGroup-0">
                  <StyledButton
                    type="confirm"
                    onClick={handleSaveUser}
                    className="account--StyledButton-0">Save</StyledButton>
                  <StyledButton
                    type="cancel"
                    onClick={handleCancelUser}
                    className="account--StyledButton-1">Cancel</StyledButton>
                </StyledButtonGroup>
              )}
            </StyledActionButtons>
          </StyledAccountCard>
        </StyledCardContainer>
      </StyledAccountContainer>
    </StyledBackground>;
};
