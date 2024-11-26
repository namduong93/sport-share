import { FC, useState } from "react";
import { StyledApproveDiv, StyledRadioCircleDiv } from "../../TeamCard.styles";

/**
 * A React component that renders a clickable radio-style button.
 *
 * `ApprovedRadio` toggles between selected and unselected states when clicked.
 *
 * @param {Function} [onClick] - A callback function triggered on click.
 * @param {React.ReactNode} children - Child elements to be displayed inside the radio button.
 * @returns {JSX.Element} - A styled radio button component.
 */
export const ApproveRadio: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  onClick = () => {},
  children,
  ...props
}) => {
  const [selected, setSelected] = useState<boolean>(false);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelected((prev) => !prev);
    onClick(e);
  };
  return (
    <StyledApproveDiv
      onClick={handleClick}
      {...props}
      className="approve-radio--StyledApproveDiv-0">
      <StyledRadioCircleDiv $selected={selected} className="approve-radio--StyledRadioCircleDiv-0" />
      {children}
    </StyledApproveDiv>
  );
};
