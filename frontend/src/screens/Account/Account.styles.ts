import styled from "styled-components";
import { StyledFlexBackground } from "../../components/general_utility/Background";
import { backendURL } from "../../../config/backendURLConfig";
import { FaEdit } from "react-icons/fa";

export const StyledBackground = styled(StyledFlexBackground)`
  background-color: ${({ theme }) => theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const StyledAccountContainer = styled.div`
  display: flex;
  margin: 10px;
  width: 100%;
  max-height: 95%;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const StyledCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-height: 100%;
`;

export const StyledAccountCard = styled.div<{ $isEditing: boolean }>`
  background-color: ${({ theme }) => theme.background};
  border: 1.5px solid ${({ theme, $isEditing: isEditing }) => isEditing ? theme.colours.secondaryLight : theme.colours.sidebarBackground };
  border-radius: 20px;
  flex: 1 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  word-wrap: break-word;
  justify-content: space-evenly;
  padding: 10px;
  max-height: 100%;
  box-sizing: border-box;
`;

export const StyledProfileEditContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const StyledProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  width: 100%;
`;

export const StyledProfilePic = styled.div<{ $imageUrl: string }>`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background-image: url(${(props) => props.$imageUrl || `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`});
  background-size: cover;
  background-position: center;
`;

export const StyledDetailsCard = styled.div`
  text-align: left;
  padding: 10px;
  box-sizing: border-box;
`;

export const StyledAccountItem = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

export const StyledLabel = styled.label<{ $isEditing: boolean }>`
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  color: ${({ theme, $isEditing: isEditing }) => isEditing ? theme.colours.secondaryDark : theme.colours.primaryDark };
`;

export const StyledDetailsText = styled.div`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledInput = styled.input`
  width: 95%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 20px;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  box-sizing: border-box;
`;

export const StyledSelect = styled.select`
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  width: 100%;
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  box-sizing: border-box;
`;

export const StyledOption = styled.option``;

export const StyledActionButtons = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

export const StyledEditIconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  box-sizing: border-box;
`;

export const StyledEditIcon = styled(FaEdit)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colours.secondaryDark};
  
  &:hover {
    color: ${({ theme }) => theme.colours.secondaryLight}
  };
`;

export const StyledButton = styled.button<{ type: "confirm" | "cancel" }>`
  padding: 12px 20px;
  border: none;
  box-sizing: border-box;
  border-radius: 10px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme, type }) => {
    switch (type) {
      case "confirm":
        return theme.colours.confirm;
      case "cancel":
        return theme.colours.cancel;
      default:
        return theme.colours.primaryLight;
    }
  }};

  &:hover {
    border: none;
    opacity: 0.8;
    color: ${({ theme }) => theme.background};
    background-color: ${({ theme, type }) => {
      switch (type) {
        case "confirm":
          return theme.colours.confirmDark;
        case "cancel":
          return theme.colours.cancelDark;
        default:
          return theme.colours.primaryDark;
      }
    }};
  }
`;