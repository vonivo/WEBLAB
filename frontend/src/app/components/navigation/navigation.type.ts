export interface NavigationItem {
  path: string;
  label: string;
  accessRole: NavigationLinkAccessRole;
}

export enum NavigationLinkAccessRole {
  LOGGED_IN = 'LOGGED_IN',
  PUBLIC = 'PUBLIC',
  ANONYMOUS = 'ANONYMOUS',
}
