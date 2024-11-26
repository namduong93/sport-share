import styled from "styled-components";
import { StyledFlexBackground } from "../../components/general_utility/Background";
import { ThemeButtonProps } from "./Settings";
import { SearchBar } from "../competition/staff_pages/CompetitionPage/components/PageUtils";
import React from "react";

export const StyledBackground = styled(StyledFlexBackground)`
  background-color: ${({ theme }) => theme.background};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const StyledThemeButton = styled.button<
  ThemeButtonProps & { $isSelected: boolean; $isLight: boolean }
>`
  background-color: ${({ theme, $newTheme: newTheme }) =>
    theme.themes[newTheme]};
  color: ${({ $isLight: isLight }) => (isLight ? "black" : "white")};
  padding: 10px 15px;
  margin: 5px;
  border: ${({ theme, $isSelected: isSelected }) =>
    isSelected ? `3px solid ${theme.colours.cancel}` : "3px solid transparent"};
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover {
    transform: translate(2px, 2px);
  }
`;

export const StyledTitle = styled.h2`
  margin-bottom: 20px;
`;

export const StyledSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.fonts.colour};
  width: 98%;
  height: 100%;
  overflow-y: auto;
  max-height: 95%;
`;

export const StyledDropdownContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
`;

export const StyledDropdownHeader = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  background-color: ${({ $isOpen, theme }) =>
    $isOpen ? theme.colours.secondaryLight : theme.colours.primaryLight};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;

  svg {
    transition: transform 0.3s ease;
    transform: ${({ $isOpen }) =>
      $isOpen ? "rotate(180deg)" : "rotate(0deg)"};
  }
`;

export const StyledDropdownContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "100%" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease !important;
  margin: 10px 0;
  width: 100%;
`;

export const StyledFAQSearchBar = (props: React.InputHTMLAttributes<HTMLInputElement>) => <SearchBar style={{ height: '40px' }} {...props} />
