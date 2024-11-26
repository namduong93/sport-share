import React, { FC, SetStateAction, useState } from "react";
import { FaSort } from "react-icons/fa";
import styled from "styled-components";
import {
  SortSelect,
  SortOption,
} from "./components/SortSelect";
import { FilterIcon, FilterSelect } from "./components/FilterSelect";
import { NotificationButton } from "./components/NotificationButton";
import { ResponsiveButton } from "../responsive_fields/ResponsiveButton";
import { SearchBar } from "../../screens/competition/staff_pages/CompetitionPage/components/PageUtils";

type Filters = Record<string, Array<string>>;

export const PageHeaderContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  min-height: 117px;
  width: 100%;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const PageTitle = styled.h1`
  margin-bottom: 0;
  font-size: 2em;
  box-sizing: border-box;
`;

export const PageDescriptionSpan = styled.span`
  color: ${({ theme }) => theme.fonts.descriptor};
  font-size: 1em;
`;

export const MenuOptionsContainerDiv = styled.div`
  margin-right: min(20px, 2%);
  flex: 1;
  max-width: 500px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  box-sizing: border-box;
`;

export const ButtonContainer = styled.div`
  width: 19%;
  height: 33px;
  position: relative;
  min-width: 29px;
`;

export const SortFilterSearchContainerDiv = styled.div`
  width: 100%;
  height: 66px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  column-gap: 4px;
  min-width: 62px;
`;

export const SortIcon = styled(FaSort)`
  height: 50%;
  flex: 0 0 auto;
`;

const AdditionalElementsDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 4px;
  flex-direction: row-reverse;
  flex-wrap: wrap;
`;

interface HeaderAttributes extends React.HTMLAttributes<HTMLDivElement> {
  pageTitle: string;
  pageDescription: string;
  sortOptions?: Array<SortOption>;
  filterOptions?: Record<string, Array<string>>;
  sortOptionState?: {
    sortOption: string | null;
    setSortOption: React.Dispatch<SetStateAction<string | null>>;
  };
  filtersState?: {
    filters: Filters;
    setFilters: React.Dispatch<SetStateAction<Filters>>;
  };
  searchTermState?: {
    searchTerm: string;
    setSearchTerm: React.Dispatch<SetStateAction<string>>;
  };
}

/**
 * A React component that renders a customizable page header with the following elements:
 * - A page title and description
 * - Sort and filter options (if provided)
 * - A search bar (if provided)
 * - Additional custom buttons or elements
 *
 * @param {HeaderAttributes} props - React HeaderAttributes specified above
 * @returns {JSX.Element} - Web page header component with title, description, and interactive controls
 * (sort, filter, search)
 */

// ACCEPTS PROPS:
// - pageTitle --- The large header to appear at the top of the page
// - pageDescription --- The subheading
// - filterOptions --- The different filters that can be chosen for the page
// - sortOptions --- The different sorting methods that can be chosen for the page
// - sortOptionState --- sortOption: state variable representing current selected option, setSortOption: the setState function for sortOption
// - filtersState --- filters: state variable of current filters, setFilters: setState function for filters
// - searchTermState --- searchTerm: state variable of current search query, setSearchTerm: setState for searchTerm
// - children --- IMPORTANT, contains any extra page-specific buttons to appear in the top-right
// - style --- extra styling for the outermost container of PageHeader if needed
// - props --- extra props for the outermost container of PageHeader if needed
export const PageHeader: FC<HeaderAttributes> = ({
  pageTitle,
  pageDescription,
  filterOptions,
  sortOptions,
  sortOptionState,
  filtersState,
  searchTermState,
  children,
  style,
  ...props
}) => {
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  return (
    <PageHeaderContainerDiv
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        ...style,
      }}
      {...props}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-around",
        }}
      >
        <PageTitle>{pageTitle}</PageTitle>
        <PageDescriptionSpan>{pageDescription}</PageDescriptionSpan>
      </div>

      <MenuOptionsContainerDiv>
        {/* Display sort, filter, search and their respective pop-ups */}
        <SortFilterSearchContainerDiv>
          {sortOptions && sortOptionState && (
            <ButtonContainer>
              <ResponsiveButton
                icon={<SortIcon />}
                label="Sort"
                isOpen={isSortOpen}
                onClick={() => setIsSortOpen((prev) => !prev)}
              />

              {isSortOpen && (
                <SortSelect
                  isOpen={isSortOpen}
                  onSortChange={(sortOption) =>
                    sortOptionState.setSortOption(sortOption)
                  }
                  options={sortOptions}
                />
              )}
            </ButtonContainer>
          )}

          {filterOptions && filtersState && (
            <ButtonContainer>
              <ResponsiveButton
                icon={<FilterIcon />}
                label="Filter"
                isOpen={isFilterOpen}
                onClick={() => setIsFilterOpen((prev) => !prev)}
              />

              {isFilterOpen && (
                <FilterSelect
                  options={filterOptions}
                  isOpen={isFilterOpen}
                  onFilterChange={(selectedFilters) =>
                    filtersState.setFilters(selectedFilters)
                  }
                  currentFilters={filtersState.filters}
                />
              )}
            </ButtonContainer>
          )}

          {searchTermState && (
            <ButtonContainer style={{ flex: "1 1 58px" }}>
              <SearchBar
                value={searchTermState.searchTerm}
                onChange={(e) => searchTermState.setSearchTerm(e.target.value)}
              />
            </ButtonContainer>
          )}
        </SortFilterSearchContainerDiv>
        <AdditionalElementsDiv>
          <NotificationButton />
          {children}
        </AdditionalElementsDiv>
      </MenuOptionsContainerDiv>
    </PageHeaderContainerDiv>
  );
};
