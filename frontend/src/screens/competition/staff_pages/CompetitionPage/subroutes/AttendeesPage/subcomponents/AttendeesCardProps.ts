import { AttendeesDetails } from "../../../../../../../../shared_types/Competition/staff/AttendeesDetails";

export interface AttendeesCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  attendeesDetails: AttendeesDetails;
}
