import { styled } from "styled-components";

export const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
`;

export const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 290px;
  max-width: 1100px;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  /* padding: 30px; */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 95%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  height: 95%;
  box-sizing: border-box;
`;

export const StyledCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 26px;
  color: #d9534f;
  transition: color 0.2s;

  &:hover {
    color: #c9302c;
  }
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
  width: 100%;
`;

export const StyledButton = styled.button`
  max-width: 150px;
  min-width: 100px;
  width: 50%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  &:hover {
    color: ${({ theme, disabled }) =>
      disabled ? theme.fonts.colour : theme.background};
    font-weight: ${({ theme, disabled }) =>
      disabled
        ? theme.fonts.fontWeights.regular
        : theme.fonts.fontWeights.bold};
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.colours.sidebarBackground : theme.colours.primaryDark};
  }
`;

export const StyledLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledRowContainer2 = styled.div`
  /* display: grid;
  grid-template-columns: 1fr 1fr; */
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  justify-content: center;
  gap: 20px;
  /* margin-top: 10px; */
  /* margin-bottom: 30px; */
  width: 95%;
`;

export const StyledTitle2 = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: center;
`;

export const StyledDescriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
  width: 100%;
`;

export const StyledLocationList = styled.div`
  display: grid;
  width: 65%;
  grid-template-columns: 1fr 1fr auto;
  margin-top: 20px;
  gap: 25px;
`;

export const StyledLocationItem = styled.div`
  display: contents;
  font-size: 16px;
  text-align: center;
`;

export const StyledDeleteIcon = styled.span`
  cursor: pointer;
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
  margin-left: 30px;

  &:hover {
    color: ${({ theme }) => theme.colours.error};
  }
`;

export const StyledEditorContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 800px;
  overflow: auto;
  background-color: ${({ theme }) => theme.background};
  margin-top: 10px;
  margin-bottom: 55px;
  align-self: stretch;
`;

export const StyledInfoEditContainer = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  flex: 1 1 450px;
`;

export const StyledCompDetailsEditContainer = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  flex: 1 1 450px;
`;