import { ROLES } from "./app.js";

export const ROLE_LABELS = {
  [ROLES.CLERK]: "Clerk",
  [ROLES.STENOGRAPHER]: "Stenographer",
  [ROLES.JUDGE]: "Judge",
};

// TODO: Replace this temporary value with the user's court name.
export const COURT_NAME = "District Court";

export const NAV_CONFIG = {
  [ROLES.CLERK]: [
    { label: "Dashboard", path: "/clerk", icon: "dashboard", ready: true },
    { label: "Cases", path: "/clerk/cases", icon: "cases", ready: false },
  ],
  [ROLES.STENOGRAPHER]: [
    { label: "Dashboard", path: "/steno", icon: "dashboard", ready: true },
    {
      label: "Clerk Remarks",
      path: "/steno/remarks",
      icon: "remarks",
      ready: false,
    },
  ],
  [ROLES.JUDGE]: [
    { label: "Dashboard", path: "/judge", icon: "dashboard", ready: true },
  ],
};
