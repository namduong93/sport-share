import React from "react";
import { StaffInfo } from "../../../../shared_types/Competition/staff/StaffInfo";
import { sendRequest } from "../../../utility/request";

/**
 * Fetches the list of staff requests from the server and updates the state with the retrieved data.
 *
 * This function makes a GET request to the `/user/staff_requests` endpoint to retrieve a list of staff requests
 * and updates the state with the data received.
 *
 * @param {React.Dispatch<React.SetStateAction<StaffInfo[]>>} setStaffList - The state setter function for updating
 * the staff list state with the fetched data.
 * @returns {Promise<void>} - A promise that resolves when the request is completed.
 */
export const fetchStaffRequests = async (
  setStaffList: React.Dispatch<React.SetStateAction<StaffInfo[]>>
) => {
  try {
    const response = await sendRequest.get<{ staffRequests: Array<StaffInfo> }>(
      "/user/staff_requests"
    );
    const staffList = response.data.staffRequests;
    setStaffList(staffList);
  } catch (error) {
    console.error("Error fetching staff requests list: ", error);
  }
};
