import { styled } from "styled-components";

export const StyledBooleanStatus = styled.div<{ $toggled: boolean }>`
  width: 80%;
  height: 50%;
  min-height: 25px;
  max-width: 160px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  
  background-color: ${({ theme, $toggled }) => $toggled ? theme.access.acceptedBackground : theme.access.rejectedBackground};
  color: ${({ theme, $toggled }) => $toggled ? theme.access.acceptedText : theme.access.rejectedText};
  border: 1px solid ${({ theme, $toggled }) => $toggled ? theme.access.acceptedText : theme.access.rejectedText};

  &::after {
    Content: ${({ $toggled }) => $toggled ? "'Yes'" : "'No'"};
  }
`;