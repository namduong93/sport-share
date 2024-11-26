import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { CopyButton } from "../../../components/general_utility/CopyButton";

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

const StyledCopyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 30px;
`;

const StyledCopyText = styled.p`
  font-size: 18px;
  font-style: italic;
  margin: 0;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colours.confirmDark};
  border-radius: 8px;
  display: inline-block;
`;

const StyledLargeCopyButtonWrapper = styled.div`
  transform: scale(1.5);
  display: inline-flex;
  margin-left: 20px;
`;

interface InvitePopUpProps {
  heading: React.ReactNode;
  text: string;
  onClose: () => void;
};

/**
 * `InvitePopUp` is a React web page component that displays the team code for
 * users to copy to clipboard and distribute to their team members
 *
 * @returns JSX.Element - A styled container presenting the team code with a
 * copy to clipboard functionality
 */
const InvitePopup: React.FC<InvitePopUpProps> = ({
  heading,
  text,
  onClose,
}) => {
  return <>
    <StyledModal className="invite-popup--StyledModal-0">
      <StyledCloseButton onClick={onClose} className="invite-popup--StyledCloseButton-0">
        <FaTimes />
      </StyledCloseButton>
      <div>{heading}</div>
      <StyledCopyContainer className="invite-popup--StyledCopyContainer-0">
        <StyledCopyText className="invite-popup--StyledCopyText-0">{text}</StyledCopyText>
        <StyledLargeCopyButtonWrapper className="invite-popup--StyledLargeCopyButtonWrapper-0">
          <CopyButton textToCopy={text} />
        </StyledLargeCopyButtonWrapper>
      </StyledCopyContainer>
    </StyledModal>
  </>;
};

export default InvitePopup;
