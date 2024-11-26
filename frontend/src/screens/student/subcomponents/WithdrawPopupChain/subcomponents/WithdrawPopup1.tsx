import React from "react";
import { FaTimes } from "react-icons/fa";
import { styled } from "styled-components";
import {
  StyledCancelButton,
  StyledConfirmButton,
} from "../../../../../components/responsive_fields/action_buttons/ActionButton";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  min-width: 290px;
  max-width: 350px;
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

interface OptionPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  onNext: () => void;
  actionButtonText: string;
};

/**
 * `WithdrawPopup1` is a React web page component that displays the conseqeunces of withdrawing
 * to users, prompting them to confirm their withdrawal
 *
 * @returns JSX.Element - A styled container presenting information
 */
export const WithdrawPopup1: React.FC<OptionPopUpProps> = ({
  heading,
  onClose,
  onNext,
  actionButtonText,
}) => {
  return <>
    <StyledModal className="--StyledModal-0">
      <StyledCloseButton onClick={onClose} className="--StyledCloseButton-0">
        <FaTimes />
      </StyledCloseButton>
      <div>{heading}</div>
      <StyledButtonContainer className="--StyledButtonContainer-0">
        <StyledConfirmButton onClick={onNext} className="--StyledConfirmButton-0">{actionButtonText}</StyledConfirmButton>
        <StyledCancelButton onClick={onClose} className="--StyledCancelButton-0">Cancel</StyledCancelButton>
      </StyledButtonContainer>
    </StyledModal>
  </>;
};
