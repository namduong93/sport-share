import { FC, ReactNode } from "react";
import { StyledSortButton } from "../../../../../components/responsive_fields/ResponsiveButton";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

interface ResponsiveSortButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  icon: ReactNode;
  label: string;
};

/**
 * `ResponsiveButton` is a flexible button component used to display a button with a custom icon and label.
 *
 * @returns {JSX.Element} The rendered button element with the specified icon and label.
 */
export const ResponsiveButton: FC<ResponsiveSortButtonProps> = ({
  onClick,
  icon,
  label,
  style,
  isOpen,
  ...props
}) => {
  return (
    <StyledSortButton
      onClick={onClick}
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        padding: '0',
        display: 'flex',
        flexWrap: 'wrap',
        ...style
      }}
      $isSortOpen={isOpen}
      {...props}
      className="page-utils--StyledSortButton-0">
      <div style={{ display: 'flex', alignContent: 'start', flexWrap: 'wrap', height: '50%', width: '100%', justifyContent: 'center' }}>
        <div style={{ height: '200%' }}>
          {icon}
        </div>
        <span>{label}</span>
      </div>
    </StyledSortButton>
  );
}

const StyledSearchContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colours.filterText};
`;

const StyledSearchInput = styled.input`
  height: 100%;
  width: 100%;
  min-width: 29px;
  border: 1px solid ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  padding: 0;
  grid-row: 1 / 2;
  grid-column: 1 / 3;
  box-sizing: border-box;
  padding-left: 5px;
  &:focus + div {
    display: none;
  }
`;

const StyledSearchIcon = styled(FaSearch)`
  min-width: 29px;
  pointer-events: none;
`;

const StyledSearchCell = styled.div`
  min-width: 29px;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  flex-wrap: wrap;
  pointer-events: none;
  overflow: hidden;
  left: 0;
  z-index: 1;
`;

/**
 * `SearchBar` is a component that provides a stylized search input field with a search icon and label.
 *
 * @returns {JSX.Element} The rendered search bar with an input field and a dynamic search icon.
 */
export const SearchBar: FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <StyledSearchContainer className="page-utils--StyledSearchContainer-0">
      <StyledSearchInput
        type="text"
        value={value}
        onChange={onChange}
        {...props}
        className="page-utils--StyledSearchInput-0" />
      {!value && <StyledSearchCell className="page-utils--StyledSearchCell-0">
        <div style={{ display: 'flex', alignContent: 'start', flexWrap: 'wrap', height: '50%', width: '100%', justifyContent: 'center' }}>
          <div style={{ height: '200%' }}>
            <StyledSearchIcon className="page-utils--StyledSearchIcon-0" />
          </div>
            <span>Search</span>
        </div>
      </StyledSearchCell>}
    </StyledSearchContainer>
  );
}
