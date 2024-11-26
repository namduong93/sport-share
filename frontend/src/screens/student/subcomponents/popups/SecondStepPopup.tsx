import { FaTimes } from "react-icons/fa";
import { styled } from "styled-components";
import {
  StyledCancelButton,
  StyledConfirmButton,
} from "../../../../components/responsive_fields/action_buttons/ActionButton";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  min-width: 290px;
  max-width: 450px;
  box-sizing: border-box;
  left: 50%;
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

const StyledButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

interface SecondStepPopupProps {
  heading: React.ReactNode;
  onClose: () => void;
  onNext: () => void;
};

/**
 * `SecondStepPopUp` is a React web page component that displays a pop up asking users to confirm
 * their change
 *
 * @returns JSX.Element - A styled container presenting a 'Yes' and 'No' button prompting users
 * to confirm their choice
 */
export const SecondStepPopup: React.FC<SecondStepPopupProps> = ({
  heading,
  onClose,
  onNext,
}) => {
  return <>
    <StyledModal className="second-step-popup--StyledModal-0">
      <StyledCloseButton onClick={onClose} className="second-step-popup--StyledCloseButton-0">
        <FaTimes />
      </StyledCloseButton>
      <div>{heading}</div>
      <StyledButtonContainer className="second-step-popup--StyledButtonContainer-0">
        <StyledConfirmButton onClick={onNext} className="second-step-popup--StyledConfirmButton-0">Yes</StyledConfirmButton>
        <StyledCancelButton onClick={onClose} className="second-step-popup--StyledCancelButton-0">No</StyledCancelButton>
      </StyledButtonContainer>
    </StyledModal>
  </>;
};
