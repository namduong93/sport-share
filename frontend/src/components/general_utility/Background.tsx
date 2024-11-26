import styled from "styled-components";

export const StyledFlexBackground = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  background-color: ${({ theme }) => theme.background};
  transition: background-color 0.5s ease;
  & * {
    transition: background-color 0.5s ease;
  }
`;