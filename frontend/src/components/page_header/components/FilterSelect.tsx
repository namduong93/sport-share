import { FC, useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import styled from "styled-components";

const StyledFilterContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 33px;
  right: 0;
  z-index: 1000;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  padding: 10px;
  max-width: 300px;
  width: 200px;

  height: fit-content;
  overflow-y: auto;
  overflow-x: hidden;
`;

const StyledFilterField = styled.div`
  margin-bottom: 20px;
  width: 100%;
`;

const StyledFieldTitle = styled.h3`
  font-size: 16px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledOptionButton = styled.button<{ selected: boolean }>`
  background-color: ${({ selected, theme }) =>
    selected ? theme.colours.optionSelected : theme.colours.optionUnselected};
  color: ${({ selected, theme }) =>
    selected ? theme.background : theme.fonts.colour};
  margin: 5px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colours.optionSelected};
    color: ${({ theme }) => theme.background};
  }
`;

interface FilterSelectProps {
  options: { [key: string]: string[] };
  onFilterChange: (selectedFilters: { [key: string]: string[] }) => void;
  isOpen: boolean;
  currentFilters: { [field: string]: string[] };
}

/**
 * A React component for a filter dropdown
 *
 * @param {FilterSelectProps} props - React FilterSelectProps specified above
 * @returns {JSX.Element} - Web page styled filter dropdown with options
 */
export const FilterSelect: FC<FilterSelectProps> = ({
  options,
  onFilterChange,
  isOpen,
  currentFilters,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<{
    [field: string]: string[];
  }>({});

  // update the current filters selected when prompted from filter tags in dashboard
  useEffect(() => {
    setSelectedFilters(currentFilters);
  }, [currentFilters]);

  const handleOptionChange = (field: string, option: string) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev };
      if (!updated[field]) {
        updated[field] = [option];
      } else if (updated[field].includes(option)) {
        updated[field] = updated[field].filter((item) => item !== option);
        // if empty, remove
        if (updated[field].length === 0) {
          delete updated[field];
        }
      } else {
        updated[field].push(option);
      }
      onFilterChange(updated);
      return updated;
    });
  };

  return (
    <StyledFilterContainer $isOpen={isOpen} className="filter-select--StyledFilterContainer-0">
      {Object.entries(options).map(([field, values]) => (
        <StyledFilterField key={field} className="filter-select--StyledFilterField-0">
          <StyledFieldTitle className="filter-select--StyledFieldTitle-0">{field}</StyledFieldTitle>
          {values.map((value) => (
            <StyledOptionButton
              key={value}
              selected={selectedFilters[field]?.includes(value) || false}
              onClick={() => handleOptionChange(field, value)}
              className="filter-select--StyledOptionButton-0">
              {value}
            </StyledOptionButton>
          ))}
        </StyledFilterField>
      ))}
    </StyledFilterContainer>
  );
};

export const FilterIcon = styled(FaFilter)`
  height: 50%;
  flex: 0 0 auto;
`;
