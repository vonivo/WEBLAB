import { NavigationItem } from '../components/navigation/navigation.type';

export const PATHS: { [key: string]: NavigationItem } = {
  HOME: {
    path: 'home',
    label: 'navigation.home',
  },
  GAMES: {
    path: 'games',
    label: 'navigation.games',
  },
  TEAMS: {
    path: 'teams',
    label: 'navigation.teams',
  },
  LOGIN: {
    path: 'login',
    label: 'navigation.login',
  },
};
