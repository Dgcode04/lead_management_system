export const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'Dashboard',
    roles: ['Admin'],
  },
  {
    id: 'all-leads',
    label: 'All Leads',
    path: '/leads',
    icon: 'Description',
    roles: ['Admin'],
  },
  {
    id: 'user-management',
    label: 'User Management',
    path: '/users',
    icon: 'Person',
    roles: ['Admin'],
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart',
    roles: ['Admin'],
  },
  {
    id: 'telecaller-dashboard',
    label: 'My Dashboard',
    path: '/',
    icon: 'Dashboard',
    roles: ['Telecaller'],
  },
  {
    id: 'telecaller-leads',
    label: 'My Leads',
    path: '/leads',
    icon: 'Description',
    roles: ['Telecaller'],
  },
  {
    id: 'reminder',
    label: 'Reminder',
    path: '/reminder',
    icon: 'Notifications',
    roles: ['Telecaller'],
  },
];

