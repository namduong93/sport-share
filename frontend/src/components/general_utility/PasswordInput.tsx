import React from 'react';
import styled from 'styled-components';

interface PasswordInputLightProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  placeholder?: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
}

/**
 * A React component to allow users to enter their password.
 *
 * @param {PasswordInputLightProps} props - React PasswordInputLightProps specified above
 * @returns {JSX.Element} - Web page component that allows users to enter their password
 */
export const PasswordInputLight: React.FC<PasswordInputLightProps> = ({
  label,
  placeholder,
  type = 'text',
  required = false,
  value,
  onChange,
  width = '300px',
  style
}) => {
  return (
    <StyledContainer
      $width={width}
      style={style}
      className="password-input--StyledContainer-0">
      <StyledLabel className="password-input--StyledLabel-0">
        {label}
        {required && <StyledAsterisk className="password-input--StyledAsterisk-0">*</StyledAsterisk>}
      </StyledLabel>
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="password-input--StyledInput-0" />
    </StyledContainer>
  );
};

const StyledContainer = styled.div<{ $width: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: ${({ $width: width }) => width};
`;

export const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 14px;
`;

const StyledAsterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;

export const StyledInput = styled.input`
  padding: 10px 1.5%;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colours.notifDark};
  border-radius: 10px;
  margin-bottom: 5px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
`;

