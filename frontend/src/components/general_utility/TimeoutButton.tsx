import React, { FC, useState } from "react";
import { useTheme } from "styled-components";
import { StyledButton } from "../../screens/auth/RegisterForm/subroutes/AccountDataInput/AccountDataInput.styles";

interface TimeoutButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  seconds?: number;
  bgColor?: string;
}

/**
 * A React button component with a built-in timer
 *
 * @param {TimeoutButtonProps} props - React TimeoutButtonProps specified above
 * @returns {JSX.Element} - Web page component button that resets after a
 * timer
 */
export const TimeoutButton: FC<TimeoutButtonProps> = ({
  seconds = 5,
  bgColor,
  onClick = () => {},
  style,
  children,
  ...props
}) => {
  const theme = useTheme();
  const [timeoutSeconds, setTimeoutSeconds] = useState(0);

  // Starts a countdown timer, updating the `timeoutSeconds` state every second,
  // disabling the button while the timer is active.
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    function countdown(timeoutSeconds: number) {
      const newTimeout = timeoutSeconds - 1;
      setTimeoutSeconds(newTimeout);
      if (newTimeout !== 0) {
        setTimeout(countdown, 1000, timeoutSeconds - 1);
      }
    }

    setTimeoutSeconds(seconds);
    setTimeout(countdown, 1000, seconds);

    onClick(e);
  };

  return (
    <StyledButton
      $bgColor={bgColor || theme.colours.primaryLight}
      type="button"
      style={style}
      $disabled={!!timeoutSeconds}
      onClick={handleClick}
      {...props}
      className="timeout-button--StyledButton-0">
      {timeoutSeconds > 0 ? timeoutSeconds : children}
    </StyledButton>
  );
}
