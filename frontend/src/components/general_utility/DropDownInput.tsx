import React from "react";
import { IoIosArrowDown } from "react-icons/io";
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
  font-weight: bold;
  font-size: 18px;
`;

const StyledAsterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;

const StyledDescriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.fonts.descriptor};
`;

const StyledRelativeSelectGrid = styled.div`
  width: 100%;
  height: 38px;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 1fr 38px;
`;

const StyledRelativeSelectElement = styled.select`
  appearance: none;
  border: 1px solid ${({ theme }) => theme.colours.notifDark};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  height: 100%;
  width: 100%;
  padding: 10px 1.5%;
  padding-right: 30px;
  border-radius: 10px;
  box-sizing: border-box;
  grid-row: 1 / 2;
  grid-column: 1 / 3;
`;

const StyledSelectDownArrow = styled(IoIosArrowDown)`
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  margin: auto 6px auto auto;
  pointer-events: none;
  height: 40%;
  width: 40%;
  color: ${({ theme }) => theme.fonts.colour};
`;

interface RelativeSelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  value: string;
  required: boolean;
}

const RelativeSelect: React.FC<RelativeSelectProps> = ({
  children,
  value,
  onChange,
  required,
  ...props
}) => (
  <StyledRelativeSelectGrid className="drop-down-input--StyledRelativeSelectGrid-0">
    <StyledRelativeSelectElement
      value={value}
      onChange={onChange}
      required={required}
      {...props}
      className="drop-down-input--StyledRelativeSelectElement-0"
    >
      {children}
    </StyledRelativeSelectElement>
    <StyledSelectDownArrow className="drop-down-input--StyledSelectDownArrow-0" />
  </StyledRelativeSelectGrid>
);

interface DropdownInputProps extends React.HTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  width?: string;
  descriptor?: string;
}

/**
 * A React component to allow users to select an option from a dropdown.
 *
 * @param {DropdownInputProps} props - React DropdownInputProps specified above
 * @returns {JSX.Element} - Web page component that allows users to select an
 * option from a selection
 */
const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  options,
  required = false,
  value,
  onChange,
  width = "300px",
  descriptor,
}) => {
  return (
    <StyledContainer $width={width} className="drop-down-input--StyledContainer-0">
      <StyledLabel className="drop-down-input--StyledLabel-0">
        {label}
        {required && <StyledAsterisk className="drop-down-input--StyledAsterisk-0">*</StyledAsterisk>}
      </StyledLabel>
      {descriptor && <StyledDescriptor className="drop-down-input--StyledDescriptor-0">{descriptor}</StyledDescriptor>}
      <RelativeSelect value={value} onChange={onChange} required={required}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="drop-down-input--option-0">
            {option.label}
          </option>
        ))}
      </RelativeSelect>
    </StyledContainer>
  );
};

export default DropdownInput;
