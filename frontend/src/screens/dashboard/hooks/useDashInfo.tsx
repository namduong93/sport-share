import React, { useEffect, useState } from "react";
import { sendRequest } from "../../../utility/request";

export interface DashInfo {
  preferredName: string;
  affiliation: string;
  profilePic: string;
};

/**
 * A custom hook that fetches and manages the dashboard information for the user.
 * It returns the current dashboard information (preferred name, affiliation, and profile picture)
 * and a function to update this information.
 *
 * @returns {Array} - An array containing the dashboard info and the setter function for updating it:
 * `dashInfo`: An object containing the user's preferred name, affiliation, and profile picture.
 * `setDashInfo`: A function that allows updating the dashboard info.
 */
export const useDashInfo = (): [
  { preferredName: string; affiliation: string; profilePic: string },
  React.Dispatch<
    React.SetStateAction<{
      preferredName: string;
      affiliation: string;
      profilePic: string;
    }>
  >
] => {
  const [dashInfo, setDashInfo] = useState({
    preferredName: "",
    affiliation: "",
    profilePic: "",
  });

  // The hook fetches the dashboard info when the component mounts and stores it in the state.
  useEffect(() => {
    (async () => {
      try {
        const infoResponse = await sendRequest.get<{
          preferredName: string;
          affiliation: string;
          profilePic: string;
        }>(`/user/dash_info`);
        setDashInfo(infoResponse.data);
      } catch (error: unknown) {
        console.log("Error fetching dashboard info:", error);
      }
    })();
  }, []);

  return [dashInfo, setDashInfo];
};
