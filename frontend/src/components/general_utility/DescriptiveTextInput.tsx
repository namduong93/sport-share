import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div<{ width: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: ${({ width }) => width};
`;

const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledDescriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
  width: 100%;
`;

const StyledAsterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;

const StyledTextarea = styled.textarea<{ $height: string }>`
  border-radius: 10px;
  box-sizing: border-box;
  resize: vertical;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  font-size: 16px;
  height: ${({ $height }) => $height};
  width: 100%;
  padding: 10px;
  border-color: ${({ theme }) => theme.colours.sidebarLine};
`;

interface DescriptiveTextInputProps {
  label?: string;
  descriptor: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  width?: string;
  height?: string;
}

/**
 * A React component to allow users to enter long form input.
 *
 * @param {DescriptiveTextInputProps} props - React DescriptiveTextInputProps specified above
 * @returns {JSX.Element} - Web page component that accepts long form user text input
 */
const DescriptiveTextInput: React.FC<DescriptiveTextInputProps> = ({
  label,
  descriptor,
  placeholder,
  required = false,
  value,
  onChange,
  width = "600px",
  height = "100px",
}) => {
  return (
    <StyledContainer width={width} className="descriptive-text-input--StyledContainer-0">
      {label && (
        <StyledLabel className="descriptive-text-input--StyledLabel-0">
          {label}
          {required && <StyledAsterisk className="descriptive-text-input--StyledAsterisk-0">*</StyledAsterisk>}
        </StyledLabel>
      )}
      <StyledDescriptor className="descriptive-text-input--StyledDescriptor-0">{descriptor}</StyledDescriptor>
      <StyledTextarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        $height={height}
        required={required}
        className="descriptive-text-input--StyledTextarea-0" />
    </StyledContainer>
  );
};

export default DescriptiveTextInput;
