import styled from "styled-components";
import { StyledBackground } from "../Account/Account.styles";
import { StyledFlexBackground } from "../../components/general_utility/Background";

export const StyledPageBackground = styled(StyledBackground)`
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const StyledStaffContainer = styled(StyledFlexBackground)`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  box-sizing: border-box;
`;

export const StyledStaffRecords = styled.div`
  display: flex;
  flex-direction: column;

`;

export const StyledFilterTagContainer = styled.div`
  width: 100%;
  height: 40px;
`;