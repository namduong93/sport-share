import { styled } from "styled-components";

export const StyledModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 290px;
  max-width: 800px;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const StyledButton = styled.button<{ disabled?: boolean }>`
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

export const StyledTextarea = styled.textarea<{ $height: string }>`
  border-radius: 10px;
  box-sizing: border-box;
  resize: vertical;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  font-size: 16px;
  height: ${({ $height }) => $height};
  width: 100%;
  margin-top: 25px;
  box-sizing: border-box;
`;

export const StyledContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 5%;
  overflow: hidden;
  align-items: flex-start;
  box-sizing: border-box;
`;

export const StyledContentField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  width: 100%;
`;

export const StyledContentMarkdown = styled(StyledContentField)`
  flex: 2;
`;

export const StyledContentBio = styled(StyledContentField)`
  flex: 1;
`;

export const StyledView = styled.div`
  width: 100%;
  height: 625px;
  overflow: hidden;
`;

export const StyledEditorContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 400px;
  overflow: auto;
  background-color: ${({ theme }) => theme.background};
`;