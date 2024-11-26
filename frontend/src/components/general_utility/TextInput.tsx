import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div<{ $width: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: ${({ $width: width }) => width};
`;

const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledAsterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;

const StyledInput = styled.input`
  padding: 10px 1.5%;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colours.notifDark};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  margin-bottom: 5px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const StyledDescriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
`;

interface TextInputProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
  maxLength?: number;
  descriptor?: string;
}

/**
 * A React component to allow users to enter textual input with heading.
 *
 * @param {TextInputProps} props - React TextInputProps specified above
 * @returns {JSX.Element} - Web page component to allow users to enter
 * textual input with heading
 */
const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
  width = "300px",
  maxLength,
  descriptor,
}) => {
  return (
    <StyledContainer $width={width} className="text-input--StyledContainer-0">
      <StyledLabel className="text-input--StyledLabel-0">
        {label}
        {required && <StyledAsterisk className="text-input--StyledAsterisk-0">*</StyledAsterisk>}
      </StyledLabel>
      {descriptor && <StyledDescriptor className="text-input--StyledDescriptor-0">{descriptor}</StyledDescriptor>}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        className="text-input--StyledInput-0" />
    </StyledContainer>
  );
};

export default TextInput;
