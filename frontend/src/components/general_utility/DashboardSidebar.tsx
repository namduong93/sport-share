import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaIdBadge } from "react-icons/fa";
import styled from "styled-components";
import { sendRequest } from "../../utility/request";
import { backendURL } from "../../../config/backendURLConfig";
import { StyledProfilePic } from "../../screens/Account/Account.styles";
import { useUserContext } from "./UserContext";

const StyledSidebarContainer = styled.div<{ $cropState: boolean }>`
  min-width: ${({ $cropState: cropState }) => (cropState ? "40px" : "200px")};
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 20px;
  margin: 15px;
  height: calc(100vh - 50px);
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;

  @media (max-width: 600px) {
    min-width: 35px;
    width: 35px;
  }

  @media (max-width: 335px) {
    margin-right: 2px;
    margin-left: 0;
  }
`;

const StyledSidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow-y: auto;
  margin-bottom: 10px;
  box-sizing: border-box;
  max-width: 200px;
`;

const StyledProfileSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ theme }) => theme.fonts.colour};
  flex-shrink: 1;

  @media (max-width: 600px) {
    display: none;
  }
`;

const StyledName = styled.div`
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
`;

const StyledNavLinks = styled.nav`
  margin-top: 20px;
  margin-bottom: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const StyledNavButton = styled.button<{ $active: boolean }>`
  background-color: ${({ theme, $active: active }) =>
    active ? theme.background : "transparent"};
  border: none;
  color: ${({ theme }) => theme.fonts.colour};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  padding: 0px;
  width: 95%;
  text-align: left;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  transition: background-color 0.3s;
  border-radius: 40px;
  flex-grow: 1;
  margin: 5px;
  justify-content: center;
  box-sizing: border-box;

  &:hover {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.fonts.colour};
  }

  svg {
    min-width: 16px;
  }

  @media (max-width: 600px) {
    justify-content: center;
    padding: 10px;
    gap: 0;
    box-sizing: border-box;

    span {
      display: none;
    }
  }
`;

const StyledLogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colours.cancel};
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  cursor: pointer;
  width: 95%;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  border-radius: 40px;
  transition: background-color 0.3s;
  align-items: center;
  display: flex;
  gap: 20px;
  padding: 20px;
  margin: 5px;
  border-radius: 40px;
  flex-shrink: 1;
  letter-spacing: ${({ theme }) => theme.fonts.spacing.normal};
  box-sizing: border-box;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colours.cancelDark};
    color: ${({ theme }) => theme.background};
    font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  }

  @media (max-width: 600px) {
    justify-content: center;
    gap: 0;

    span {
      display: none;
    }

    svg {
      width: 24px;
      min-width: 16px;
      height: 24px;
    }
  }
`;

/**
 * @param {boolean} cropState - Determines if the screen dimensions are too narrow so sidebar only displays the icons.
 * @param {JSX.Element} sidebarInfo - The relevant information displayed on the sidebar.
 * @param {string} preferredName - The user's name they prefer to be called.
 * @param {string} affiliation - The university or site the user is registered under.
 * @param {string} profile - The profile picture of the user.
 */
export interface DashboardSidebarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  cropState: boolean;
  sidebarInfo: { preferredName: string | null; profilePic?: string | null };
}

/**
 * A React component displaying the allowable side bar operations for all users.
 *
 * @param {DashboardSidebarProps} props - React DashboardSidebarProps specified above
 * @returns {JSX.Element} - Web page component displaying the allowable side bar operations
 * for all users.
 */
export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  cropState,
  sidebarInfo,
  style,
  ...props
}) => {
  const [isSysAdmin, setIsSysAdmin] = useState(false);
  const navigate = useNavigate();
  const { setUserData } = useUserContext();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await sendRequest.post("/users/logout");
    setUserData(null);
    handleNavigation("/");
  };

  // Fetches the user type to determine if the user is a system administrator.
  useEffect(() => {
    (async () => {
      try {
        // const typeResponse = await sendRequest.get<{ type: string }>(
        //   "/user/type"
        // );
        const typeResponse = {
          data: {
            type: "user"
          }
        }
        setIsSysAdmin(typeResponse.data.type === "system_admin");
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          navigate("/");
          console.log("Authentication Error: ", error);
        });
      }
    })();
  }, []);

  return (
    <StyledSidebarContainer className="dashboard-sidebar--StyledSidebarContainer-0" $cropState={cropState} style={style} {...props}>
      <StyledSidebarContent className="dashboard-sidebar--StyledSidebarContent-0">
        {/* If the screen dimensions are too narrow, remove the text and only display the icons */}
        {!cropState && (
          <StyledProfileSection className="dashboard-sidebar--StyledProfileSection-0">
            <StyledProfilePic className="dashboard-sidebar--StyledProfilePic-0"
              $imageUrl={
                sidebarInfo.profilePic ||
                `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`
              }
            />
            <div>Hello</div>
            <StyledName className="dashboard-sidebar--StyledName-0">{sidebarInfo.preferredName}</StyledName>
          </StyledProfileSection>
        )}

        {/* Clicking on each section should redirect the user to the relevant page */}
        <StyledNavLinks className="dashboard-sidebar--StyledNavLinks-0">
          <StyledNavButton className="dashboard-sidebar--StyledNavButton-0"
            $active={location.pathname === "/dashboard"}
            onClick={() => handleNavigation("/dashboard")}
          >
            <FaHome /> {!cropState && <span>Dashboard</span>}
          </StyledNavButton>
          {isSysAdmin && (
            <StyledNavButton className="dashboard-sidebar--StyledNavButton-1"
              $active={location.pathname === "/staffAccounts"}
              onClick={() => handleNavigation("/staffAccounts")}
            >
              <FaIdBadge /> {!cropState && <span>Staff Accounts</span>}
            </StyledNavButton>
          )}
          <StyledNavButton className="dashboard-sidebar--StyledNavButton-2"
            $active={location.pathname === "/account"}
            onClick={() => handleNavigation("/account")}
          >
            <FaUser /> {!cropState && <span>Account</span>}
          </StyledNavButton>
          <StyledNavButton
            $active={location.pathname === "/settings"}
            onClick={() => handleNavigation('/settings')}
            className="dashboard-sidebar--StyledNavButton-3">
            <FaCog /> {!cropState && <span>Settings</span>}
          </StyledNavButton>
        </StyledNavLinks>
      </StyledSidebarContent>
      <StyledLogoutButton
        onClick={handleLogout}
        className="dashboard-sidebar--StyledLogoutButton-0">
        <FaSignOutAlt /> <span>Logout</span>
      </StyledLogoutButton>
    </StyledSidebarContainer>
  );
};
