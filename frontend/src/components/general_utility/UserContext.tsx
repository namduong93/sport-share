import { FC, createContext, useContext, useState, ReactNode } from "react";
import { User } from "../../../shared_types/User/User";

const UserContext = createContext<{
  userData: User | null;
  setUserData: (data: User | null) => void;
}>({
  userData: null,
  setUserData: () => {}
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setUserDataAndStorage = (data: User | null) => {
    setUserData(data);
    if (data) {
      localStorage.setItem('userData', JSON.stringify(data));
    } else {
      localStorage.removeItem('userData');
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData: setUserDataAndStorage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);