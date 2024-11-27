import React, { FC, useContext, useEffect, useState } from "react";
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
import { User, UserType } from "../../../shared_types/User/User";
import { useUserContext } from "../../components/general_utility/UserContext";
import { set } from "date-fns";
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
    email: "",
    firstName: "",
    lastName: "",
    role: UserType.USER,
    preferredName: "",
    password: "",
    image: `../../../resources/assets/default_profile.png`,
    token: "",
    createdAt: "",
    modifiedAt: "",
    bio: "",
    referrer: "",
  });

  const { userData } = useUserContext();

  const [isEditingUser, setIsEditingUser] = useState(false);

  const [newDetails, setNewDetails] = useState<User>({
    ...user,
    image: `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`,
  });

  // Initialises the editing process by setting newDetails to match the user
  // and toggling to editing mode
  const handleEditUser = () => {
    setNewDetails(user);
    setIsEditingUser(true);
  };

  // updates the user with the edited details and sends a request to backend
  const handleSaveUser = async () => {
    const response = await sendRequest.put<User>("/users", newDetails);
    setUser(response.data);
    setIsEditingUser(false);
    setDashInfo({
      preferredName: newDetails.preferredName || null,
      image: newDetails.image || null,
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
        setNewDetails({ ...newDetails, image: reader.result as string });
      };
      reader.readAsDataURL(photoFile);
    }
  };

  // Fetches the user profile data from the backend
  useEffect(() => {
    if(userData) {
      setIsLoaded(true);
      setUser(userData);
    }
    else {
      setIsLoaded(false);
    }
  }, []);

  return isLoaded &&
    <StyledBackground className="account--StyledBackground-0">
      <StyledAccountContainer className="account--StyledAccountContainer-0">
        <StyledCardContainer className="account--StyledCardContainer-0">
          <StyledAccountCard $isEditing={isEditingUser} className="account--StyledAccountCard-0">
            <StyledProfileEditContainer className="account--StyledProfileEditContainer-0">
              <StyledProfileContainer className="account--StyledProfileContainer-0">
                <StyledProfilePic
                  $imageUrl={newDetails.image || `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg` }
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
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-1">First Name:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.firstName}
                    onChange={(e) => setNewDetails({ ...newDetails, firstName: e.target.value })}
                    className="account--StyledInput-1" />
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-0">{user.firstName}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem className="account--StyledAccountItem-1">
                <StyledLabel $isEditing={isEditingUser} className="account--StyledLabel-1">Last Name:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.lastName}
                    onChange={(e) => setNewDetails({ ...newDetails, lastName: e.target.value })}
                    className="account--StyledInput-1" />
                ) : (
                  <StyledDetailsText className="account--StyledDetailsText-0">{user.lastName}</StyledDetailsText>
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
