import styled from "styled-components";
import { UserAccess } from "../../../../shared_types/User/User";
import { FC, useEffect, useState } from "react";
import { sendRequest } from "../../../utility/request";

const StyledDropdown = styled.select<{ $access: UserAccess }>`
  width: 80%;
  height: 50%;
  min-height: 25px;
  max-width: 160px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: ${({ theme, $access }) =>
    $access === UserAccess.Accepted
      ? theme.access.acceptedBackground
      : $access === UserAccess.Pending
      ? theme.access.pendingBackground
      : theme.access.rejectedBackground};

  border: 1px solid
    ${({ theme, $access }) =>
      $access === UserAccess.Accepted
        ? theme.access.acceptedText
        : $access === UserAccess.Pending
        ? theme.access.pendingText
        : theme.access.rejectedText};

  color: ${({ theme, $access }) =>
    $access === UserAccess.Accepted
      ? theme.access.acceptedText
      : $access === UserAccess.Pending
      ? theme.access.pendingText
      : theme.access.rejectedText};

  cursor: pointer;
  padding: 5px;
  outline: none;

  option {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
`;

const StyledOption = styled.option<{ $access: UserAccess }>`
  color: ${({ theme, $access }) =>
    $access === UserAccess.Accepted
      ? theme.access.acceptedText
      : $access === UserAccess.Pending
      ? theme.access.pendingText
      : theme.access.rejectedText};
`;

interface AccessDropdownProps {
  staffId: number | undefined;
  currentAccess: UserAccess;
  onChange: (newAccess: UserAccess) => void;
}

/**
 * A React dropdown component for selecting and updating the access status of staff members.
 *
 * The `AccessDropdown` allows the user to change the access level (Accepted, Pending, Rejected) of a staff member.
 *
 * @param {AccessDropdownProps} props - React AccessDropdownProps as specified above
 * @returns {JSX.Element} - The rendered dropdown component for selecting the staff member's access level.
 */
export const AccessDropdown: FC<AccessDropdownProps> = ({
  staffId,
  currentAccess,
  onChange,
}) => {
  const [selectedAccess, setSelectedAccess] =
    useState<UserAccess>(currentAccess);

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAccess = event.target.value as UserAccess;
    setSelectedAccess(newAccess);
    onChange(newAccess);
    try {
      await sendRequest.post("/user/staff_requests", {
        staffRequests: [{ userId: staffId, access: newAccess }],
      });
    } catch (error) {
      console.error("Error updating staff access: ", error);
    }
  };

  useEffect(() => {
    setSelectedAccess(currentAccess);
  }, [currentAccess]);

  return (
    <StyledDropdown
      $access={selectedAccess}
      value={selectedAccess}
      onChange={handleChange}
      className="access-dropdown--StyledDropdown-0">
      <StyledOption
        $access={UserAccess.Accepted}
        value={UserAccess.Accepted}
        className="access-dropdown--StyledOption-0">Accepted</StyledOption>
      <StyledOption
        $access={UserAccess.Pending}
        value={UserAccess.Pending}
        className="access-dropdown--StyledOption-1">Pending</StyledOption>
      <StyledOption
        $access={UserAccess.Rejected}
        value={UserAccess.Rejected}
        className="access-dropdown--StyledOption-2">Rejected</StyledOption>
    </StyledDropdown>
  );
};
