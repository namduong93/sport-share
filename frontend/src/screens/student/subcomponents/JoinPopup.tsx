import React, { useState } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import TextInputLight from "../../../components/general_utility/TextInputLight";
import { useNavigate, useParams } from "react-router-dom";
import { sendRequest } from "../../../utility/request";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 290px;
  max-width: 450px;
  box-sizing: border-box;
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

const StyledCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #d9534f;
  transition: color 0.2s;
  font-size: 26px;

  &:hover {
    color: #c9302c;
  }
`;

const StyledButton = styled.button<{ disabled?: boolean }>`
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

interface JoinPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  currentTeamCode?: string;
};

/**
 * `JoinPopUp` is a React web page component that displays a text input field
 * for users to enter a code to join a team
 *
 * @returns JSX.Element - A styled container presenting a text input for users
 * to enter the team code
 */
const JoinPopup: React.FC<JoinPopUpProps> = ({
  heading,
  onClose,
  currentTeamCode,
}) => {
  const navigate = useNavigate();
  const [teamCode, setTeamCode] = useState("");
  const compId = useParams().compId;

  const isButtonDisabled = () => {
    return teamCode === "" || teamCode === currentTeamCode;
  };

  const handleJoin = () => {
    try {
      const joinTeam = async () => {
        const response = await sendRequest.post<{ teamName: string }>(
          "/competition/team/join",
          { compId, teamCode }
        );
        navigate("/dashboard", {
          state: { joined: true, teamName: response.data.teamName },
        });
      };
      joinTeam();
    } catch (error) {
      console.log(error);
    }
  };

  return <>
    <StyledModal className="join-popup--StyledModal-0">
      <StyledCloseButton onClick={onClose} className="join-popup--StyledCloseButton-0">
        <FaTimes />
      </StyledCloseButton>
      <div>{heading}</div>
      <div style={{ width: "80%" }}>
        <TextInputLight
          label="Team Code"
          placeholder="Please enter"
          required={true}
          value={teamCode}
          onChange={(e) => setTeamCode(e.target.value)}
          width="100%"
        />
      </div>
      <StyledButton
        disabled={isButtonDisabled()}
        onClick={handleJoin}
        className="join-popup--StyledButton-0">Join</StyledButton>
    </StyledModal>
  </>;
};

export default JoinPopup;
