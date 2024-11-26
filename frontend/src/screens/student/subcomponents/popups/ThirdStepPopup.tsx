import React from "react";
import { FaTimes } from "react-icons/fa";
import { styled } from "styled-components";

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

interface ThirdStepPopupProps {
  heading: React.ReactNode;
  onClose: () => void;
};

/**
 * `ThirdStepPopup` is a React web page component that displays a pop up displaying the message that
 * a user's request has been sent
 *
 * @returns JSX.Element - A styled container presenting a confirmation that there request has been sent
 */
export const ThirdStepPopup: React.FC<ThirdStepPopupProps> = ({
  heading,
  onClose,
}) => {
  return (
    <>
      <StyledModal className="third-step-popup--StyledModal-0">
        <StyledCloseButton className="third-step-popup--StyledCloseButton-0" onClick={onClose}>
          <FaTimes />
        </StyledCloseButton>
        <div>{heading}</div>
      </StyledModal>
    </>
  );
};
