// ─────────────────────────────────────────────────────────────────────────────
// lib/rbac.ts
// CrimeVision AI v2.0 — Role-Based Access Control (RBAC) Configuration
// Central source of truth for portal types, route permissions, and role mapping.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Portal Types ────────────────────────────────────────────────────────────

export type PortalType = 'officer' | 'admin';

// ─── Role Definitions ────────────────────────────────────────────────────────

export type UserRole = 'DGP' | 'Commissioner' | 'Inspector' | 'SubInspector' | 'Constable';

// ─── Role → Portal Mapping ──────────────────────────────────────────────────

const ROLE_PORTAL_MAP: Record<UserRole, PortalType> = {
  DGP: 'admin',
  Commissioner: 'admin',
  Inspector: 'officer',
  SubInspector: 'officer',
  Constable: 'officer',
};

// ─── Route Access Configuration ─────────────────────────────────────────────
// Routes are matched by prefix. More specific prefixes take priority.
// 'all' means both portals can access; otherwise specify portal type(s).

interface RoutePermission {
  path: string;
  allowedPortals: PortalType[] | 'all';
  label?: string; // Human-readable label for audit/debug
}

const ROUTE_PERMISSIONS: RoutePermission[] = [
  // ── Public / Shared Routes ──────────────────────────────────────
  { path: '/login', allowedPortals: 'all', label: 'Login' },

  // ── Officer + Admin Routes (accessible to both portals) ─────────
  { path: '/', allowedPortals: 'all', label: 'Home / Dashboard' },
  { path: '/dashboard', allowedPortals: 'all', label: 'Dashboard Redirect' },
  { path: '/fir', allowedPortals: 'all', label: 'Cases / FIR Search' },
  { path: '/investigator', allowedPortals: 'all', label: 'AI Investigator' },
  { path: '/ai-investigator', allowedPortals: 'all', label: 'AI Investigator Alt' },
  { path: '/heatmap', allowedPortals: 'all', label: 'Crime Map' },
  { path: '/map', allowedPortals: 'all', label: 'Crime Map Alt' },
  { path: '/genome', allowedPortals: 'all', label: 'Crime Insights' },
  { path: '/insights', allowedPortals: 'all', label: 'Crime Insights Alt' },
  { path: '/network', allowedPortals: 'all', label: 'Suspect Network' },
  { path: '/criminal-network', allowedPortals: 'all', label: 'Criminal Network Alt' },
  { path: '/alerts', allowedPortals: 'all', label: 'Live Alerts' },
  { path: '/reports', allowedPortals: 'all', label: 'Reports' },
  { path: '/predictions', allowedPortals: 'all', label: 'Crime Forecast' },
  { path: '/timeline', allowedPortals: 'all', label: 'Crime Timeline' },
  { path: '/anomaly', allowedPortals: 'all', label: 'Anomaly Detection' },
  { path: '/social-risk', allowedPortals: 'all', label: 'Social Risk' },
  { path: '/detective', allowedPortals: 'all', label: 'AI Analysis' },
  { path: '/copilot', allowedPortals: 'all', label: 'Investigation Assistant' },
  { path: '/resources', allowedPortals: 'all', label: 'Officer Deployment' },
  { path: '/search', allowedPortals: 'all', label: 'Search' },
  { path: '/investigation-workflow', allowedPortals: 'all', label: 'Investigation Workflow' },

  // ── Admin-Only Routes ──────────────────────────────────────────
  { path: '/commissioner', allowedPortals: ['admin'], label: 'State Overview' },
  { path: '/commissioner-dashboard', allowedPortals: ['admin'], label: 'Commissioner Dashboard' },
  { path: '/admin/officers', allowedPortals: ['admin'], label: 'Officer Management' },
  { path: '/admin/database', allowedPortals: ['admin'], label: 'Database Management' },
  { path: '/admin/settings', allowedPortals: ['admin'], label: 'Platform Settings' },
  { path: '/admin/activity-logs', allowedPortals: ['admin'], label: 'Activity Logs' },
  { path: '/settings', allowedPortals: 'all', label: 'User Settings' },
];

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Get the portal type for a given user role.
 */
export function getPortalForRole(role: string): PortalType {
  return ROLE_PORTAL_MAP[role as UserRole] ?? 'officer';
}

/**
 * Check if a given role maps to an admin portal.
 */
export function isAdminRole(role: string): boolean {
  return getPortalForRole(role) === 'admin';
}

/**
 * Check if a user with a given role can access a specific route.
 * Uses longest-prefix matching to find the most specific permission rule.
 */
export function canAccessRoute(role: string, pathname: string): boolean {
  const portal = getPortalForRole(role);

  // Normalize: strip trailing slash (except root)
  const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  // Find the most specific matching route permission (longest prefix match)
  let bestMatch: RoutePermission | null = null;
  let bestMatchLength = 0;

  for (const route of ROUTE_PERMISSIONS) {
    const routePath = route.path === '/' ? '/' : route.path.replace(/\/+$/, '');

    // Exact match or prefix match (ensure prefix boundary at /)
    const isMatch =
      normalizedPath === routePath ||
      (normalizedPath.startsWith(routePath) &&
        (routePath === '/' || normalizedPath[routePath.length] === '/' || normalizedPath.length === routePath.length));

    if (isMatch && routePath.length > bestMatchLength) {
      bestMatch = route;
      bestMatchLength = routePath.length;
    }
  }

  // If no matching route found, default to allow (for unregistered routes)
  if (!bestMatch) return true;

  // Check if portal is in the allowed list
  if (bestMatch.allowedPortals === 'all') return true;
  return bestMatch.allowedPortals.includes(portal);
}

/**
 * Get the default redirect path for a given role after login.
 */
export function getRedirectForRole(role: string): string {
  // Both officer and admin go to Home
  return '/';
}

/**
 * Get admin-only navigation items for the sidebar.
 */
export function getAdminNavItems() {
  return [
    { href: '/admin/officers', label: 'Officer Management' },
    { href: '/admin/database', label: 'Database' },
    { href: '/admin/settings', label: 'Settings' },
    { href: '/admin/activity-logs', label: 'Activity Logs' },
  ];
}

/**
 * Get human-readable portal label.
 */
export function getPortalLabel(portal: PortalType): string {
  return portal === 'admin' ? 'Admin Portal' : 'Officer Portal';
}
