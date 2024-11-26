import styled from "styled-components";
import { StyledFlexBackground } from "../../../components/general_utility/Background";

export const StyledFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 500px;
  flex: 0 1 auto;
  align-items: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledCenteredFormBackground = styled(StyledFlexBackground)`
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.fonts.fontFamily};;

  & h1 {
    font-style: ${({ theme }) => theme.fonts.style};;
  }
`;
