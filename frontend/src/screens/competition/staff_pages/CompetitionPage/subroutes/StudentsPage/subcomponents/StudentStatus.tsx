import { FC } from "react";

interface StudentStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  isMatched: boolean;
};

/**
 * A React component for displaying the status of a student.
 *
 * The `StudentStatus` component renders a div element that indicates whether the student is "Matched" or not
 * by changing the background color, text color, and border style based on the `isMatched` prop. If the student
 * is matched, the status is displayed with a green color scheme; otherwise, it is displayed with a red color scheme.
 *
 * @param {StudentStatusProps} props - React StudentStatusProps as specified above
 * @returns {JSX.Element} - A JSX element representing a student status indicator.
 */
export const StudentStatus: FC<StudentStatusProps> = ({
  children,
  isMatched = false,
  style,
  ...props
}) => {
  return (
    <div
      style={{
        width: "80%",
        height: "50%",
        minHeight: "25px",
        maxWidth: "160px",
        lineHeight: "1",
        backgroundColor: isMatched
          ? "rgba(139, 223, 165, 54%)"
          : "rgba(255, 29, 32, 28%)",
        color: isMatched ? "#63A577" : "#ED1E21",
        border: `1px solid ${isMatched ? "#63A577" : "#FF1D20"}`,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
