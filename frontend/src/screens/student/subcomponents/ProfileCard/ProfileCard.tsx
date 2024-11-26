import { FC } from "react";
import { CopyButton } from "../../../../components/general_utility/CopyButton";
import { FaUserTie } from "react-icons/fa";
import { backendURL } from "../../../../../config/backendURLConfig";
import {
  StyledCoachContact,
  StyledContactEdit,
  StyledContentContainer,
  StyledEditIcon,
  StyledIconWrapper,
  StyledPreferredContact,
  StyledPreferredContactHandle,
  StyledStudentBio,
  StyledStudentCard,
  StyledStudentCardContent,
  StyledStudentContact,
  StyledStudentEmail,
  StyledStudentImage,
  StyledStudentInfo,
  StyledStudentName,
} from "./ProfileCard.styles";
import { StyledInfoButton } from "../../subroutes/TeamManage/TeamManage";

interface ProfileCardProps {
  name: string;
  email: string;
  bio: string;
  image?: string;
  preferredContact?: string;
  isFirst?: boolean;
  onEdit?: () => void;
  isCoach?: boolean;
};

/**
 * The ProfileCard component is used to display the profile information of a student or coach,
 * including their name, email, bio, profile image, and preferred contact method.
 *
 * This component conditionally renders different content based on whether the user is a coach or a student.
 * It also supports copying the email and preferred contact details to the clipboard,
 * and allows for editing the profile if the `onEdit` callback is provided and `isFirst` is true.
 *
 * @param {ProfileCardProps} props - React ProfileCardProps as specified above.
 * @returns {JSX.Element} - The rendered ProfileCard component.
 */
export const ProfileCard: FC<ProfileCardProps> = ({
  name,
  email,
  bio,
  image,
  preferredContact,
  isFirst,
  onEdit,
  isCoach,
}) => {
  const contactParts = preferredContact ? preferredContact.split(":") : [];

  return (
    <StyledStudentCard $isFirst={isFirst} className="profile-card--StyledStudentCard-0">
      <StyledStudentCardContent className="profile-card--StyledStudentCardContent-0">
        <StyledContentContainer className="profile-card--StyledContentContainer-0">
          <StyledStudentInfo className="profile-card--StyledStudentInfo-0">
            <StyledContactEdit className="profile-card--StyledContactEdit-0">
          {isCoach ? (
            <StyledIconWrapper className="profile-card--StyledIconWrapper-0">
              <FaUserTie />
            </StyledIconWrapper>
          ) : (
            <StyledStudentImage
              // Use defaultProfile if image is undefined
              src={
                image ||
                `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`
              }
              alt={`${name}'s profile`}
              className="profile-card--StyledStudentImage-0" />
          )}
              <StyledStudentContact className="profile-card--StyledStudentContact-0">
                <StyledStudentName className="profile-card--StyledStudentName-0">{name}</StyledStudentName>
                <StyledStudentEmail className="profile-card--StyledStudentEmail-0">
                  <StyledInfoButton
                    onClick={() => navigator.clipboard.writeText(email)}
                    className="profile-card--StyledInfoButton-0">
                    {email}
                  </StyledInfoButton>
                  <CopyButton textToCopy={email} />
                </StyledStudentEmail>
                {!isCoach && preferredContact && contactParts.length === 2 ? (
                  <StyledPreferredContact className="profile-card--StyledPreferredContact-0">
                    <span>{contactParts[0]}:</span>
                    <StyledPreferredContactHandle className="profile-card--StyledPreferredContactHandle-0">
                      {contactParts[1]}
                    </StyledPreferredContactHandle>
                    <CopyButton textToCopy={contactParts[1]} />
                  </StyledPreferredContact>
                ) : (
                  // only students should have a preferred contact
                  isCoach && (
                    <StyledCoachContact className="profile-card--StyledCoachContact-0">No preferred contact available.</StyledCoachContact>
                  )
                )}
              </StyledStudentContact>
              {isFirst && onEdit && <StyledEditIcon onClick={onEdit} className="profile-card--StyledEditIcon-0" />}
            </StyledContactEdit>
            <StyledStudentBio className="profile-card--StyledStudentBio-0">{bio}</StyledStudentBio>
          </StyledStudentInfo>
        </StyledContentContainer>
      </StyledStudentCardContent>
    </StyledStudentCard>
  );
};
