import React, { FC, useEffect, useRef } from "react";
import styled from "styled-components";

const StyledInfoBarContainerDiv = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  border-radius: 10px;
  overflow: auto;
  right: 0;
  bottom: 1.25%;
  z-index: 50;
  transition: width 0.25s ease, min-width 0.25s ease,
    background-color 0.25s ease !important;
  width: ${({ $isOpen }) => ($isOpen ? "40%" : "0")};
  height: 98%;
  max-width: 380px;
  min-width: ${({ $isOpen }) => ($isOpen ? "320px" : "0")};
  background-color: ${({ theme }) => theme.colours.cardBackground};
  color: ${({ theme }) => theme.fonts.colour};
  border: ${({ $isOpen }) => ($isOpen ? "1px" : "0")} solid
    ${({ theme }) => theme.colours.sidebarBackground};
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.25);

  &:focus {
    outline: none;
  }

  & * {
    font-size: ${({ $isOpen }) => ($isOpen ? "1em" : "0")};
    ${({ $isOpen }) => !$isOpen && "width: 0"};
    transition: width 0.25s ease !important;
  }
`;

const StyledInfoContainer = styled.div`
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  box-sizing: border-box;
  margin: 10px 10px 10px 10px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export interface InfoBarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

/**
 *  A React component for toggling the applicable information sidebar.
 *
 * `InfoBar` is a component that displays a sidebar-like container that can be toggled open or closed.
 * When open, it shows the relevant information related to it's focus group
 *
 * @param {InfoBarProps} props - React InfoBarProps as specified above.
 * @returns {JSX.Element} - A UI side-bar component.
 */
export const InfoBar: FC<InfoBarProps> = ({
  isOpenState: [isOpen, setIsOpen],
  children,
  ...props
}) => {
  const containerRef = useRef(null);

  // A mouse clikc event listener detecting when a user clicks outside the `InfoBar` container,
  // closing the sidebar if the click is detected outside
  useEffect(() => {
    // Checks if the click is inside the `InfoBar` container by comparing the mouse click's
    // coordinates with the container's bounding rectangle. If the click is outside, the
    // InfoBar is closed.
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }
      const bounds = (
        containerRef.current as HTMLElement
      ).getBoundingClientRect();

      if (
        e.clientX >= bounds.left &&
        e.clientX <= bounds.right &&
        e.clientY >= bounds.top &&
        e.clientY <= bounds.bottom
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <StyledInfoBarContainerDiv
      ref={containerRef}
      tabIndex={9999}
      $isOpen={isOpen}
      {...props}
      onClick={(e) => e.stopPropagation()}
      className="info-bar--StyledInfoBarContainerDiv-0">
      <StyledInfoContainer className="info-bar--StyledInfoContainer-0">
        {children}
      </StyledInfoContainer>
    </StyledInfoBarContainerDiv>
  );
}
