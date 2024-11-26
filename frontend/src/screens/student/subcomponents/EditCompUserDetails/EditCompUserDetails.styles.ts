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
`;

export const StyledModalContent = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 12px;
  width: 90%;
  min-width: 290px;
  max-width: 800px;
  height: 90%;
  max-height: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: scroll;
`;

export const StyledCloseContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
  z-index: 1;
`;

export const StyledCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #d9534f;
  transition: color 0.2s;

  &:hover {
    color: #c9302c;
  }
`;

export const StyledTitle = styled.h2`
  text-align: center;
  margin: 10px;
`;

export const StyledForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  min-width: 290px;
  gap: 5px;
  flex-wrap: wrap;
  width: 100%;
  height: auto;
`;

export const StyledField = styled.div`
  max-width: 350px;
`;

export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  resize: none;
`;

export const StyledContentContainer = styled.div`
  max-width: 760px;
  max-height: 780px;
  width: 95%;
  height: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export const StyledHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const StyledTitleContainer = styled.div`
  flex: 20;

  display: flex;
  justify-content: center;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
  width: 100%;
`;