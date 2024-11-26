import { StaffInfo } from "../../../../../../../../shared_types/Competition/staff/StaffInfo";

export interface StaffCardProps extends React.HTMLAttributes<HTMLDivElement> {
  staffDetails: StaffInfo;
  staffListState: [Array<StaffInfo>, React.Dispatch<React.SetStateAction<Array<StaffInfo>>>];
}
