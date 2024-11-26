import { FaEdit } from "react-icons/fa";
import { styled } from "styled-components";

export const StyledStudentCard = styled.div<{ $isFirst?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  border: 2px solid
    ${({ theme, $isFirst }) =>
      $isFirst ? theme.colours.secondaryLight : theme.colours.primaryLight};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.background};
  width: 100%;

  position: relative;
  overflow-y: auto;
  box-sizing: border-box;
  min-height: 200px;
  max-height: 500px;
  max-width: 610px;
`;

export const StyledContactEdit = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  position: relative;
`;

export const StyledStudentCardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  margin: 5%;
  padding: 5px;
  box-sizing: border-box;
`;

export const StyledContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5%;
`;

export const StyledStudentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding-right: 10px;
  box-sizing: border-box;
`;

export const StyledStudentName = styled.p`
  margin: 0;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 1rem;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledStudentEmail = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: underline;
  color: ${({ theme }) => theme.colours.primaryDark};
`;

export const StyledStudentBio = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.fonts.descriptor};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  padding: 10px;
  overflow: hidden;
  white-space: normal;
  max-width: 100%;
  text-overflow: ellipsis;
  flex-grow: 1;
  box-sizing: border-box;
`;

export const StyledStudentImage = styled.img`
  width: 20%;
  aspect-ratio: 1;
  max-width: 70px;
  height: auto;
  border-radius: 50%;
  object-fit: cover;
  box-sizing: border-box;
`;

export const StyledIconWrapper = styled.div`
  width: 20%;
  max-width: 50px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px; // Adjust icon size
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledPreferredContact = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.fonts.colour};
  margin-top: 5px;
`;

export const StyledPreferredContactHandle = styled.span`
  color: ${({ theme }) => theme.colours.secondaryDark};
`;

export const StyledEditIcon = styled(FaEdit)`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.secondaryDark};

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryLight};
  }
  position: absolute;
  right: 0;
  top: 0;
`;

export const StyledStudentContact = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

export const StyledCoachContact = styled.div`
  color: ${({ theme }) => theme.colours.sidebarLine};
`;