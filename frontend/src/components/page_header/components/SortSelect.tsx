import { FC, useState } from "react";
import { FaSort } from "react-icons/fa";
import styled from "styled-components";

export const StyledSortContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 33px;
  right: 0;
  z-index: 1000;
  background-color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  width: fit-content;
  height: fit-content;
  padding: 10px;
  max-height: 400px;
  overflow-y: auto;
`;

export const StyledSortOption = styled.div<{ $isSelected: boolean }>`
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;
  background-color: ${({ $isSelected: isSelected, theme }) =>
    isSelected ? theme.colours.primaryLight : "transparent"};
  color: ${({ theme }) => theme.fonts.colour};
  margin: 5px;
  &:hover {
    background-color: ${({ theme }) => theme.colours.primaryLight};
  }
`;

export const SortIcon = styled(FaSort)`
  height: 50%;
  flex: 0 0 auto;
`;

export interface SortOption {
  label: string;
  value: string;
}

interface SortSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  options: SortOption[];
  onSortChange: (sortOption: string) => void;
  isOpen: boolean;
}

/**
 * A React component for a sorting options
 *
 * @param {SortSelectProps} props - React SortSelectProps specified above
 * @returns {JSX.Element} - Web page styled dropdown container with selectable
 * sort options
 */
export const SortSelect: FC<SortSelectProps> = ({
  options,
  onSortChange,
  isOpen,
}) => {
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    onSortChange(value);
  };

  if (!isOpen) return null;

  return (
    <StyledSortContainer $isOpen={isOpen} className="sort-select--StyledSortContainer-0">
      {options.map((option) => (
        <StyledSortOption
          key={option.value}
          $isSelected={selectedSort === option.value}
          onClick={() => handleSortChange(option.value)}
          className="sort-select--StyledSortOption-0">
          {option.label}
        </StyledSortOption>
      ))}
    </StyledSortContainer>
  );
};
