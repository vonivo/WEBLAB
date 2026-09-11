import { NavigationItem, NavigationLinkAccessRole } from '../components/navigation/navigation.type';

export const PATHS: { [key: string]: NavigationItem } = {
  HOME: {
    path: 'home',
    label: 'navigation.home',
    accessRole: NavigationLinkAccessRole.PUBLIC,
  },
  GAMES: {
    path: 'games',
    label: 'navigation.games',
    accessRole: NavigationLinkAccessRole.PUBLIC,
  },
  TEAMS: {
    path: 'teams',
    label: 'navigation.teams',
    accessRole: NavigationLinkAccessRole.LOGGED_IN,
  },
  LOGIN: {
    path: 'login',
    label: 'navigation.login',
    accessRole: NavigationLinkAccessRole.ANONYMOUS,
  },
  LOGOUT: {
    path: 'logout',
    label: 'navigation.logout',
    accessRole: NavigationLinkAccessRole.LOGGED_IN,
  },
};
