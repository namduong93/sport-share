
export type ActionType =
  | "code"
  | "competition"
  | "registration"
  | "seat"
  | "contact"
  | "capacity";

export interface ActionCardProps {
  $actionType: ActionType;
}