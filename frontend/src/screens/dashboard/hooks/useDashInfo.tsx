import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../components/general_utility/UserContext";

export interface DashInfo {
  preferredName: string | null;
  image: string | null;
}

export const useDashInfo = (): [
  DashInfo,
  React.Dispatch<React.SetStateAction<DashInfo>>
] => {
  const { userData } = useUserContext();
  
  // Try to load initial state from the same userData in localStorage
  const [dashInfo, setDashInfo] = useState<DashInfo>(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      return {
        preferredName: parsedUser.preferredName || 
          (parsedUser.firstName && parsedUser.lastName ? 
            `${parsedUser.firstName} ${parsedUser.lastName}` : 
            null),
        image: parsedUser.image || null,
      };
    }
    return {
      preferredName: null,
      image: null
    };
  });

  useEffect(() => {
    if (userData) {
      setDashInfo({
        preferredName: userData.preferredName || 
          (userData.firstName && userData.lastName ? 
            `${userData.firstName} ${userData.lastName}` : 
            null),
        image: userData.image || null,
      });
    }
  }, [userData]);

  return [dashInfo, setDashInfo];
};