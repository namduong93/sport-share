import React from "react";
import styled from "styled-components";

const Container = styled.div<{ $width: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: ${({ $width: width }) => width};
`;

export const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 14px;
`;

const Asterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;

export const Input = styled.input`
  padding: 10px 1.5%;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  border-radius: 10px;
  margin-bottom: 5px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
`;

interface TextInputLightProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  name?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
}

/**
 * A React component to allow users to enter textual input without heading.
 *
 * @param {TextInputProps} props - React TextInputProps specified above
 * @returns {JSX.Element} - Web page component to allow users to enter
 * textual input without heading
 */
export const TextInputLight: React.FC<TextInputLightProps> = ({
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
  width = "300px",
  style,
}) => {
  return (
    <Container $width={width} style={style}>
      <Label>
        {label}
        {required && <Asterisk>*</Asterisk>}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </Container>
  );
};

export default TextInputLight;
