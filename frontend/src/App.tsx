/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./themes/defaultTheme";
import { darkTheme } from "./themes/darkTheme";
import { christmasTheme } from "./themes/christmasTheme";
import { colourblindTheme } from "./themes/colourblindTheme";
import { Settings } from "./screens/settings/Settings";
import { TeamProfile } from "./screens/student/TeamProfile";
import { useDashInfo } from "./screens/dashboard/hooks/useDashInfo";
import { Login } from "./screens/auth/Login/Login";
import { RegisterFormProvider } from "./screens/auth/RegisterForm/RegisterFormProvider";
import { RoleSelect } from "./screens/auth/RegisterForm/subroutes/RoleSelect/RoleSelect";
import { AccountDataInput } from "./screens/auth/RegisterForm/subroutes/AccountDataInput/AccountDataInput";
// import { SiteDataInput } from "./screens/auth/RegisterForm/subroutes/SiteDataInput/SiteDataInput";
// import { InstitutionDataInput } from "./screens/auth/RegisterForm/subroutes/InstitutionDataInput/InstitutionDataInput";
import {
  PasswordCodeRecoverForm,
  PasswordRecovery,
} from "./screens/auth/PasswordRecovery/PasswordRecovery";
import { EmailForm } from "./screens/auth/PasswordRecovery/subroutes/EmailForm/EmailForm";
import { EmailSuccess } from "./screens/auth/PasswordRecovery/subroutes/EmailSuccess/EmailSuccess";
import { SidebarLayout } from "./screens/SidebarLayout";
import { CompIdNavigate } from "./screens/competition/staff_pages/CompetitionPage/components/CompIdNavigate";
import { CompetitionPage } from "./screens/competition/staff_pages/CompetitionPage/CompetitionPage";
import { TeamPage } from "./screens/competition/staff_pages/CompetitionPage/subroutes/TeamPage/TeamPage";
import { StudentPage } from "./screens/competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentPage";
import { StaffPage } from "./screens/competition/staff_pages/CompetitionPage/subroutes/StaffPage/StaffPage";
import { AttendeesDisplay } from "./screens/competition/staff_pages/CompetitionPage/subroutes/AttendeesPage/AttendeesPage";
import { ManagePage } from "./screens/competition/staff_pages/CompetitionPage/subroutes/ManagePage/ManagePage";

import { Dashboard } from "./screens/dashboard/Dashboard";
import { Account } from "./screens/Account/Account";
import { CompDataInput } from "./screens/competition/staff_pages/creation/CompDataInput/CompDataInput";
import { CompDataConfirmation } from "./screens/competition/staff_pages/creation/CompDataConfirmation/CompDataConfirmation";
import { CompRegisterFormProvider } from "./screens/competition/register/RegisterForm/CompRegisterFormProvider";
import { CompetitionInformation } from "./screens/competition/register/RegisterForm/subroutes/CompInformation/CompInformation";
import { CompIndividualInput } from "./screens/competition/register/RegisterForm/subroutes/CompIndividualInput/CompIndividualInput";
import { CompExperienceInput } from "./screens/competition/register/RegisterForm/subroutes/CompExperienceInput/CompExperienceInput";
import { StaffRegisterForm } from "./screens/competition/register/StaffRegisterForm/StaffRegisterForm";
import { TeamDetails } from "./screens/student/subroutes/TeamDetails/TeamDetails";
import { TeamManage } from "./screens/student/subroutes/TeamManage/TeamManage";
import { UserProvider } from "./components/general_utility/UserContext";
import { ClubAccessPage } from "./screens/StaffAccess/ClubAccessPage";

const themeMap = {
  default: defaultTheme,
  dark: darkTheme,
  christmas: christmasTheme,
  colourblind: colourblindTheme,
} as const;

/**
 * The main entry point of the application, responsible for routing and theme management.
 *
 * This component uses React Router for routing between different pages and implements
 * theme management using styled-components' ThemeProvider.
 *
 * @returns {JSX.Element} - The app's UI, including routing and theme switching functionality.
 */
function App() {
  const [theme, setTheme] = useState<keyof typeof themeMap>("default");
  const currentTheme = themeMap[theme];

  // use local storage for theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && savedTheme in themeMap) {
      setTheme(savedTheme as keyof typeof themeMap);
    } else {
      setTheme("default"); // Fallback to default if not found
    }

    // Add event listener for storage changes
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme && savedTheme in themeMap) {
        setTheme(savedTheme as keyof typeof themeMap);
      } else {
        setTheme("default"); // Fallback to default if not found
      }
    };

    // Attach event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [dashInfo, setDashInfo] = useDashInfo();

  return (
    <ThemeProvider theme={currentTheme}>
      <UserProvider>
        <Router>
          <div style={{ background: currentTheme.background }}></div>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/roleregistration"
              element={
                <RegisterFormProvider>
                  <RoleSelect />
                </RegisterFormProvider>
              }
            />
            <Route
              path="/accountinformation"
              element={
                <RegisterFormProvider>
                  <AccountDataInput />
                </RegisterFormProvider>
              }
            />
            {/* <Route
              path="/siteinformation"
              element={
                <RegisterFormProvider>
                  <SiteDataInput />
                </RegisterFormProvider>
              }
            /> */}
            {/* <Route
              path="/institutioninformation"
              element={
                <RegisterFormProvider>
                  <InstitutionDataInput />
                </RegisterFormProvider>
              }
            /> */}
            {/* coach page should be split up subrouted TeamsView and StudentsView in the future */}
            <Route path="/password/recovery" element={<PasswordRecovery />}>
              <Route path="email" element={<EmailForm />} />
              <Route path="email/success" element={<EmailSuccess />} />
              <Route path="reset/:code" element={<PasswordCodeRecoverForm />} />
            </Route>

            <Route
              element={<SidebarLayout cropState={false} sidebarInfo={dashInfo} />}
            >
              <Route
                path="/game/page/:gameId"
                element={<CompIdNavigate route="/game/page/teams" />}
              />
              <Route
                path="/game/page"
                element={<Navigate to="/dashboard" />}
              />
              <Route path="/game/page/" element={<CompetitionPage />}>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="teams/:gameId" element={<TeamPage />} />
                <Route path="students/:gameId" element={<StudentPage />} />
                <Route path="staff/:gameId" element={<StaffPage />} />
                <Route path="site/:gameId" element={<AttendeesDisplay />} />
                <Route path="manage/:gameId" element={<ManagePage />} />
              </Route>

              <Route
                path="/game/participant/:gameId/"
                element={<TeamProfile />}
              >
                <Route index element={<TeamDetails />} />
                <Route path="details" element={<TeamDetails />} />
                <Route path="manage" element={<TeamManage />} />
              </Route>

              <Route
                path="/dashboard"
                element={<Dashboard dashInfo={dashInfo} />}
              />
              <Route path="/club" element={<ClubAccessPage />} />
              <Route
                path="/account"
                element={<Account setDashInfo={setDashInfo} />}
              />
              <Route path="/settings" element={<Settings />} />
            </Route>

            <Route path="/game/create" element={<CompDataInput />} />
            <Route
              path="/game/confirmation"
              element={<CompDataConfirmation />}
            />

            <Route
              path="/game/register/:gameId?"
              element={
                <CompRegisterFormProvider>
                  <CompetitionInformation />
                </CompRegisterFormProvider>
              }
            />
            <Route
              path="/game/individual/:code?"
              element={
                <CompRegisterFormProvider>
                  <CompIndividualInput />
                </CompRegisterFormProvider>
              }
            />
            <Route
              path="/game/experience/:code?"
              element={
                <CompRegisterFormProvider>
                  <CompExperienceInput />
                </CompRegisterFormProvider>
              }
            />

            <Route
              path="/game/staff/register/:code?"
              element={<StaffRegisterForm />}
            />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
