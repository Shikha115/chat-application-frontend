declare module "react-notification-badge" {
  import * as React from "react";
  export interface NotificationBadgeProps {
    count: number;
    effect?: any;
    className?: string;
    style?: React.CSSProperties;
  }
  export default class NotificationBadge extends React.Component<NotificationBadgeProps> {}
  export const Effect: any;
}
