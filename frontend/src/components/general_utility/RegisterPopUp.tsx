import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { StyledTitle2 } from "../../screens/dashboard/Dashboard.styles";

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 98%;
  box-sizing: border-box;
  max-width: 400px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledInput = styled.input`
  padding: 10px 1.5%;
  box-sizing: border-box;
  width: 60%;
  border: 1px solid ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

interface RegisterPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  teamName?: string;
  isRego?: boolean;
  isTeamJoin?: boolean;
  isStaffRego?: boolean;
}

/**
 * A React component displaying the relevant registration message to users.
 *
 * @param {RegisterPopUpProps} props - React RegisterPopUpProps specified above
 * @returns {JSX.Element} - Web page component displaying the relevant registration
 * message to users
 */
export const RegisterPopUp: React.FC<RegisterPopUpProps> = ({
  isOpen,
  onClose,
  teamName,
  isRego,
  isTeamJoin,
  isStaffRego,
}) => {
  if (!isOpen) return null;

  return (
    <StyledOverlay className="register-pop-up--StyledOverlay-0" onClick={onClose}>
      <StyledModal className="register-pop-up--StyledModal-0">
        <StyledCloseButton className="register-pop-up--StyledCloseButton-0" onClick={onClose}>
          <FaTimes />
        </StyledCloseButton>
        <div>
          {isRego && (
            <StyledTitle2 className="register-pop-up--StyledTitle2-0">
              You have successfully registered for the Competition! {"\n\n"}
              <span style={{ fontWeight: "normal" }}>
                Please navigate to the Team Profile Page to join a team or
                invite team members
              </span>
            </StyledTitle2>
          )}

          {isTeamJoin && (
            <StyledTitle2 className="register-pop-up--StyledTitle2-1">
              You have successfully {"\n"} joined the Team: {"\n\n"}{" "}
              <span style={{ fontWeight: "normal", fontStyle: "italic" }}>
                {teamName}
              </span>
            </StyledTitle2>
          )}

          {isStaffRego && (
            <StyledTitle2 className="register-pop-up--StyledTitle2-2">
              Your Request has been {"\n"} sent {"\n\n"} Please wait for {"\n"}{" "}
              Administrator approval
            </StyledTitle2>
          )}
        </div>
      </StyledModal>
      {/* </Container> */}
    </StyledOverlay>
  );
};
