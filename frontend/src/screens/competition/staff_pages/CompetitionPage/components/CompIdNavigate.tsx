import { FC } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

/**
 * `CompIdNavigate` is a React functional component that redirects the user to a new route while
 * preserving the current `compId` from the URL parameters.
 *
 * @param {string} route - The base route to which the `compId` will be appended for navigation.
 * @returns {JSX.Element} A `Navigate` component that redirects the user to the new route.
 */
export const CompIdNavigate: FC<{ route: string }> = ({ route }) => {
  const { compId } = useParams();
  const location = useLocation();
  return <Navigate to={`${route}/${compId}`} state={location.state} />;
};
