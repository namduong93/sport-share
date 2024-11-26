import React, { FC } from "react";
import styled from "styled-components";

const StyledContainer = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  width: ${({ width }) => width};
`;

const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledAsterisk = styled.span`
  color: red;
  margin-left: 5px;
`;

const StyledDescriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const StyledOptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 5px;
  justify-content: space-between;
  width: 100%;
`;

const StyledRadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
  flex: 1;
  font-size: 16px;
  cursor: pointer;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledRadioInput = styled.input`
  margin-right: 10px;
  cursor: pointer;
`;

interface RadioButtonGroupProps {
  label?: string;
  options: string[];
  selectedOption: string;
  onOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  descriptor?: string | string[];
  width?: string;
}

/**
 * A React component to allow users to select a single option from a radio input.
 *
 * @param {RadioButtonGroupProps} props - React RadioButtonGroupProps specified above
 * @returns {JSX.Element} - Web page component that allows users to select a single option
 * from a radio input.
 */
const RadioButton: FC<RadioButtonGroupProps> = ({
  label,
  options,
  selectedOption,
  onOptionChange,
  required = false,
  descriptor,
  width,
}) => {
  return (
    <StyledContainer width={width} className="radio-button--StyledContainer-0">
      {label && (
        <StyledLabel className="radio-button--StyledLabel-0">
          {label}
          {required && <StyledAsterisk className="radio-button--StyledAsterisk-0">*</StyledAsterisk>}
        </StyledLabel>
      )}
      {descriptor && (
        <StyledDescriptor className="radio-button--StyledDescriptor-0">
          {Array.isArray(descriptor)
            ? descriptor.map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < descriptor.length - 1 && <br />}
                </React.Fragment>
              ))
            : descriptor}
        </StyledDescriptor>
      )}
      <StyledOptionsContainer className="radio-button--StyledOptionsContainer-0">
        {options.map((option) => (
          <StyledRadioButtonLabel key={option} className="radio-button--StyledRadioButtonLabel-0">
            <StyledRadioInput
              type="radio"
              id={option}
              name={label}
              value={option}
              checked={selectedOption === option}
              onChange={onOptionChange}
              className="radio-button--StyledRadioInput-0" />
            {option}
          </StyledRadioButtonLabel>
        ))}
      </StyledOptionsContainer>
    </StyledContainer>
  );
};

export default RadioButton;
