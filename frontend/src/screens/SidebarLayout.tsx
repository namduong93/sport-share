import { Outlet } from "react-router-dom";
import {
  DashboardSidebar,
  DashboardSidebarProps,
} from "../components/general_utility/DashboardSidebar";
import styled from "styled-components";

const StyledSharedBackground = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.background};
  transition: background-color 0.5s ease;
  & * {
    transition: background-color 0.5s ease;
  }
`;

/**
 * The SidebarLayout component is a layout wrapper that includes a sidebar and a dynamic content area.
 * It renders the `DashboardSidebar` component, with a sidebar on the left and the content area on the right,
 * and an `Outlet` to display nested route content.
 *
 * @param {DashboardSidebarProps} props - The props passed to the `DashboardSidebar` component.
 *
 * @returns {JSX.Element} - The rendered SidebarLayout component, which includes the sidebar and nested route
 * content.
 */
export const SidebarLayout = ({ ...props }: DashboardSidebarProps) => {
  return (
    <StyledSharedBackground className="sidebar-layout--StyledSharedBackground-0">
      <DashboardSidebar {...props} />
      <Outlet />
    </StyledSharedBackground>
  );
};
