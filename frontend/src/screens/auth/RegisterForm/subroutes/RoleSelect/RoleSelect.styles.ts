import styled from "styled-components";

export const StyledFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const StyledTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const StyledButton = styled.button`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.colours.optionUnselected : theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const RoleContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const StyledStudentButton = styled.button<{ isSelected: boolean }>`
  border: ${({ theme, isSelected }) => (isSelected ? `2px solid ${theme.colours.confirmDark}` : 'none')}; // Border logic for Student
  border-radius: 10px;
  margin: 0 0 2.5% 2.5%;
  width: 45%;
  min-width: 0px;
  max-width: 300px;
  height: 270px; 
  font-size: 25px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  background-color: ${({ theme }) => theme.roles.participantBackground};
  color: ${({ theme }) => theme.roles.participantText};
`;

export const StyledStaffButton = styled.button<{ isSelected: boolean }>`
  border: ${({ theme, isSelected }) => (isSelected ? `1.5px solid ${theme.colours.cancelDark}` : 'none')}; // Border logic for Staff
  border-radius: 10px;
  margin: 0 0 2.5% 2.5%;
  width: 45%;
  min-width: 0px;
  max-width: 300px;
  height: 270px; 
  font-size: 25px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  background-color: ${({ theme }) => theme.roles.adminBackground};
  color: ${({ theme }) => theme.roles.adminText};
`
