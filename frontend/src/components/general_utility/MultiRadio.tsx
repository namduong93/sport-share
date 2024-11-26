import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CompetitionRole } from "../../../shared_types/Competition/CompetitionRole";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
`;

const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
`;

const StyledDescriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const StyledCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const StyledCheckboxInput = styled.input`
  margin-right: 0.5rem;
`;

const StyledCheckboxLabel = styled.label`
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
`;

const OtherInput = styled.input`
  width: 100%;
  margin-left: 0.5rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  flex-grow: 1;
`;

interface CheckboxOption {
  value: string;
  label: string;
}

interface MultiSelectCheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[] | CompetitionRole[]) => void;
  label: string | React.ReactNode;
  descriptor?: string;
  showOther?: boolean; // New prop to control "Other" visibility
}

/**
 * A React component to allow users to select multiple radio options.
 *
 * @param {MultiSelectCheckboxGroupProps} props - React MultiSelectCheckboxGroupProps specified above
 * @returns {JSX.Element} - Web page component that allows users to select multiple radio options
 */
const MultiRadio: React.FC<MultiSelectCheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
  label,
  descriptor,
  showOther = true,
}) => {
  const [otherValue, setOtherValue] = useState("");

  // Effect hook to update the selected values if the "Other" option is cleared
  useEffect(() => {
    if (!otherValue && selectedValues.includes("other")) {
      onChange(selectedValues.filter((val) => val !== "other"));
    }
  }, [otherValue, selectedValues, onChange]);

  const handleCheckboxChange = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((val) => val !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleOtherBlur = () => {
    if (otherValue && !selectedValues.includes(otherValue)) {
      onChange([
        ...selectedValues.filter((val) => val !== "other"),
        otherValue,
      ]);
    }
  };

  const handleOtherCheckboxChange = () => {
    if (selectedValues.includes("other")) {
      setOtherValue("");
      onChange(selectedValues.filter((val) => val !== "other"));
    } else {
      onChange([...selectedValues, "other"]);
    }
  };

  return (
    <StyledContainer className="multi-radio--StyledContainer-0">
      {label && <StyledLabel className="multi-radio--StyledLabel-0">{label}</StyledLabel>}
      {descriptor && <StyledDescriptor className="multi-radio--StyledDescriptor-0">{descriptor}</StyledDescriptor>}
      {options.map((option) => (
        <StyledCheckboxContainer key={option.value} className="multi-radio--StyledCheckboxContainer-0">
          <StyledCheckboxInput
            type="checkbox"
            id={option.value}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
            className="multi-radio--StyledCheckboxInput-0"
          />
          <StyledCheckboxLabel className="multi-radio--StyledCheckboxLabel-0" htmlFor={option.value}>
            {option.label}
          </StyledCheckboxLabel>
        </StyledCheckboxContainer>
      ))}
      {showOther && (
        <StyledCheckboxContainer className="multi-radio--StyledCheckboxContainer-1">
          <StyledCheckboxInput
            type="checkbox"
            id="other"
            value="other"
            checked={selectedValues.includes("other")}
            onChange={handleOtherCheckboxChange}
            className="multi-radio--StyledCheckboxInput-1" />
          <StyledCheckboxLabel htmlFor="other" className="multi-radio--StyledCheckboxLabel-1">Other:</StyledCheckboxLabel>
          <OtherInput
            type="text"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
            onBlur={handleOtherBlur}
          />
        </StyledCheckboxContainer>
      )}
    </StyledContainer>
  );
};

export default MultiRadio;
