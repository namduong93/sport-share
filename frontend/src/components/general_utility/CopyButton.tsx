import { FC, useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import styled from "styled-components";

const StyledIconButton = styled(FaRegCopy)<{ $copied: boolean }>`
  margin-left: 3%;
  width: auto;
  height: auto;
  cursor: pointer;
  color: ${({ theme, $copied }) =>
    $copied ? theme.colours.confirm : theme.colours.primaryDark};
  transition: color 0.2s;
  box-sizing: border-box;

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

const StyledCheckIcon = styled(FaCheck)`
  margin-left: 5%;
  width: 1rem;
  height: 1rem;
  color: ${({ theme }) => theme.colours.confirm};
  box-sizing: border-box;
`;

/**
 * @param {string} textToCopy - The text to be copied to clipboard.
 */
interface CopyButtonProps {
  textToCopy: string;
}

/**
 * A React component to allow users to copy text to clipboard.
 *
 * @param {CopyButtonProps} props - React CopyButtonProps specified above
 * @returns {JSX.Element} - Web page component to allow users to copy text to clipboard.
 */
export const CopyButton: FC<CopyButtonProps> = ({ textToCopy }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return copied ? <StyledCheckIcon className="copy-button--StyledCheckIcon-0" /> : <StyledIconButton
    $copied={copied}
    onClick={copyToClipboard}
    className="copy-button--StyledIconButton-0" />;
};
