import styled from "styled-components";

export const StyledCustomButton = styled.button`
  width: 30%;
  min-width: 74px;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;