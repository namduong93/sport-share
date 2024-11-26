import styled from "styled-components";

export const StyledErrorMessage = styled.p`
  color: ${({ theme }) => theme.colours.error};
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.colour};
  margin-top: -10px;
  text-align: center;
`