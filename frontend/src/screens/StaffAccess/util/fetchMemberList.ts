import React from "react";
import { sendRequest } from "../../../utility/request";
import { TeamMember } from "../../../../shared_types/TeamMember/TeamMember";

/**
 * Fetches the list of staff requests from the server and updates the state with the retrieved data.
 *
 * This function makes a GET request to the `/user/staff_requests` endpoint to retrieve a list of staff requests
 * and updates the state with the data received.
 *
 * @param {React.Dispatch<React.SetStateAction<TeamMember[]>>} setStaffList - The state setter function for updating
 * the staff list state with the fetched data.
 * @returns {Promise<void>} - A promise that resolves when the request is completed.
 */
export const fetchMemberList = async (
  setMemberList: React.Dispatch<React.SetStateAction<TeamMember[]>>
) => {
  try {
    const response = await sendRequest.get<{ memberRequests: Array<TeamMember> }>(
      "/user/staff_requests"
    );
    const memberList = response.data.memberRequests;
    setMemberList(memberList);
  } catch (error) {
    console.error("Error fetching staff requests list: ", error);
  }
};
