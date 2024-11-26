import { styled } from "styled-components";
import { PageDescriptionSpan, PageHeaderContainerDiv, PageTitle } from "../../../../components/page_header/PageHeader";
import { ActionButton } from "../../../../components/responsive_fields/action_buttons/ActionButton";

export const StyledTeamTitle = styled(PageTitle)`
  color: ${({ theme }) => theme.colours.primaryDark};
  font-size: ${({ theme }) => theme.fonts.fontSizes.heading};
`;

export const StyledTeamDescription = styled(PageDescriptionSpan)`
  color: ${({ theme }) => theme.colours.secondaryDark};
  font-size: ${({ theme }) => theme.fonts.fontSizes.subheading};
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 250px;
`;

export const StyledWithdrawButton = styled(ActionButton)`
  height: 100%;
  width: 100%;
  min-height: 20px;
  flex: 1;
  padding: 0 16px;
  box-sizing: border-box;
`;

export const StyledHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 50%;
  justify-content: space-between;
`;

export const StyledHeaderRightSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10%;
  width: 100%;
  height: 100%;
  max-width: 50%;
`;

export const StyledResponsiveHeader = styled(PageHeaderContainerDiv)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
`;