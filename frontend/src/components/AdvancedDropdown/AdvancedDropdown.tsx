import Fuse, { FuseResult } from "fuse.js";
import React, { FC, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import styled from "styled-components";

const StyledDropdownContainerDiv = styled.div`
  height: 36px;
  border-radius: 10px;
  box-sizing: border-box;
  position: relative;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledDropdownTextInput = styled.input`
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  &:focus + div {
    border-color: ${({ theme }) => theme.fonts.colour};
  }
`;

const StyledDropdownIconDiv = styled.div`
  position: absolute;
  width: 36px;
  height: 100%;
  right: 0;
  top: 0;
  border-left: 1px solid ${({ theme }) => theme.colours.notifDark};
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const StyledDropdownOptionsDiv = styled.div`
  position: absolute;
  width: 100%;
  right: 0;
  min-height: 36px;
  min-width: 200px;
  background-color: ${({ theme }) => theme.background};
  top: calc(100% + 3px);
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  box-sizing: border-box;
  max-height: 150px;
  overflow: auto;
  z-index: 5;

  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    border-radius: 10px;
  }
`;

const StyledOptionContainerDiv = styled.button<{ $isLast: boolean }>`
  all: unset;
  width: 100%;
  height: 36px;
  display: flex;
  overflow: hidden;
  align-items: center;
  box-sizing: border-box;
  border-right: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  ${({ $isLast, theme }) =>
    $isLast
      ? ""
      : `border-bottom: 1px solid ${theme.colours.sidebarBackground}`};
  user-select: none;
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  &:hover {
    background-color: ${({ theme }) => theme.colours.primaryLight};
    cursor: pointer;
  }
`;

interface OptionsProps extends React.HTMLAttributes<HTMLDivElement> {
  options:
    | Array<FuseResult<{ value: string; label: string }>>
    | Array<{ item: { value: string; label: string } }>;
  searchTerm: string;
  display: boolean;
  handleSelectOption: (
    e: React.MouseEvent<HTMLButtonElement>,
    value: string,
    label: string
  ) => void;
  handleCreate: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isExtendable?: boolean;
}

const DropdownOptions: FC<OptionsProps> = ({
  options,
  display,
  searchTerm,
  isExtendable = true,
  handleSelectOption,
  handleCreate,
  style,
  ...props
}) => {
  return display && (
    <StyledDropdownOptionsDiv
      style={{ ...style }}
      {...props}
      className="advanced-dropdown--StyledDropdownOptionsDiv-0">
      {options.map(({ item: { value, label } }, index) => {
        return (
          <StyledOptionContainerDiv
            type="button"
            key={index}
            $isLast={false}
            onClick={(e) => handleSelectOption(e, value, label)}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            className="advanced-dropdown--StyledOptionContainerDiv-0">
            {label}
          </StyledOptionContainerDiv>
        );
      })}
      {searchTerm &&
        isExtendable &&
        !options.some(
          ({ item: {  label } }) => label === searchTerm
        ) && (
          <StyledOptionContainerDiv
            $isLast={true}
            onClick={handleCreate}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            className="advanced-dropdown--StyledOptionContainerDiv-1">Create "{searchTerm}"</StyledOptionContainerDiv>
        )}
    </StyledDropdownOptionsDiv>
  );
};

interface DropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  optionsState: [
    Array<{
      value: string;
      label: string;
    }>,
    React.Dispatch<
      React.SetStateAction<Array<{ value: string; label: string }>>
    >
  ];
  setCurrentSelected: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }>
  >;
  label?: string;
  isExtendable?: boolean;
  defaultSearchTerm?: string;
}

/**
 * A React component for creating a styled, searchable, and extendable dropdown menu.
 *
 * The `AdvancedDropdown` component allows users to select options from a list, perform fuzzy searches to filter
 * available options, and create new options dynamically if desired. The dropdown supports real-time updates
 * to the options list.
 *
 * @param {DropdownProps} props - React DropDownProps as specified above, where:
 * `optionsState` [ options -- state variable list of { value: string, label: string }, setOptions -- setSate for the options state variable ]
 * `setCurrentSelected` setState function that should track the currently selected option ({ value: string, label: string })
 * `isExtendable` determines if users can create new options not found in the list.
 * `defaultSearchTerm` {string} (optional), which is the initial value displayed in the search field.
 * - Additional props such as `style` or `props` which can be passed to customize the container.
 * @returns {JSX.Element} - A fully styled and functional dropdown component that supports searching, selecting, and extending options.
 */

// INSTRUCTIONS:
// To use the advanced dropdown create a state variable [<optionList>, set<OptionList>] of some kind that contains the list of options
// that can be chosen from in the dropdown, then create a state variable [currentSelected, setCurrentSelected] that should store
// the currently selected option (of type { value: string, label: string }). Then provide the optionsState prop containing the
// optionList and setOptionList, along with the setCurrentSelected setState as props to the advanced dropdown
// Then, the currentSelected state variable will have the currently selected option loaded into it, if the user creates their own
// option then the value of that new option will be an empty string '' but the label will be the name they inserted for their own option
export const AdvancedDropdown: FC<DropdownProps> = ({
  optionsState: [options, setOptions],
  setCurrentSelected,
  isExtendable = true,
  style,
  defaultSearchTerm,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Updates the 'searchTerm' whenever the 'defaultSearchTerm' changes,
  // ensuring that the search input is initialised
  useEffect(() => {
    setSearchTerm(defaultSearchTerm ?? "");
  }, [defaultSearchTerm]);
  const [displayDropdown, setDisplayDropdown] = useState(false);

  const fuse = new Fuse(options, {
    keys: ["label"],
    threshold: 1,
  });

  // Sorts the selection in the Dropdown depending on the user's input
  let filteredOptions:
    | Array<FuseResult<{ value: string; label: string }>>
    | Array<{ item: { value: string; label: string } }>;
  if (searchTerm) {
    filteredOptions = fuse.search(searchTerm);
  } else {
    filteredOptions = options.map((obj) => {
      return { item: obj };
    });
  }

  const remainingOptions = options.filter(
    (option) => !filteredOptions.some(({ item }) => item.value === option.value)
  );
  filteredOptions = [
    ...filteredOptions,
    ...remainingOptions.map((option) => ({ item: option })),
  ];

  // Updates the 'currentSelected' to the selected option's label
  const handleSelectOption = (
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>,
    value: string,
    label: string
  ) => {
    e.preventDefault();
    setCurrentSelected({ value, label });
    setSearchTerm(label);
    e.currentTarget.focus();
    e.currentTarget.blur();
  };

  // Manages the keyboard navigation within the drpdown, selecting the first
  // filtered option on Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSelectOption(
        e,
        filteredOptions[0].item.value,
        filteredOptions[0].item.label
      );
    }
  };

  // Handles the creation of a new option by adding to the 'options' state
  const handleCreate = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOptions((prevOptions) => [
      ...prevOptions,
      { value: "", label: searchTerm },
    ]);
    handleSelectOption(e, "", searchTerm);
  };
  return (
    <StyledDropdownContainerDiv
      style={{ ...style }}
      {...props}
      className="advanced-dropdown--StyledDropdownContainerDiv-0">
      <StyledDropdownTextInput
        style={{ ...style }}
        type="text"
        onFocus={() => setDisplayDropdown(true)}
        onBlur={() => setDisplayDropdown(false)}
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        onKeyDown={handleKeyPress}
        className="advanced-dropdown--StyledDropdownTextInput-0"></StyledDropdownTextInput>
      <StyledDropdownIconDiv className="advanced-dropdown--StyledDropdownIconDiv-0">
        <IoIosArrowDown style={{ height: "50%", width: "50%" }} />
      </StyledDropdownIconDiv>
      <DropdownOptions
        onMouseDown={(e) => e.preventDefault()}
        isExtendable={isExtendable}
        handleCreate={handleCreate}
        handleSelectOption={handleSelectOption}
        display={displayDropdown}
        searchTerm={searchTerm}
        options={filteredOptions}
      />
    </StyledDropdownContainerDiv>
  );
};
