import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_NAME, ROLES } from "../constants/app.js";
import Logo from "../components/common/Logo.jsx";
import {
  Alert,
  Button,
  Card,
  Input,
  PasswordInput,
  Select,
} from "../components/ui/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { ROLE_HOME } from "../utils/roleRoutes.js";

const roleDetails = {
  [ROLES.CLERK]: {
    label: "Court Clerk Login ID",
    placeholder: "Enter your official Clerk ID",
  },
  [ROLES.JUDGE]: {
    label: "Court Judge Login ID",
    placeholder: "Enter your official Judge ID",
  },
  [ROLES.STENOGRAPHER]: {
    label: "Court Stenographer Login ID",
    placeholder: "Enter your official Stenographer ID",
  },
};

function PeopleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[35px] w-[35px] stroke-brand-navy [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.2]"
      viewBox="0 0 48 48"
      fill="none"
    >
      <circle cx="24" cy="16" r="6" />
      <circle cx="11" cy="20" r="4" />
      <circle cx="37" cy="20" r="4" />
      <path d="M13 34c0-6 4.7-10 11-10s11 4 11 10v2H13v-2Z" />
      <path d="M5 35c.3-4.7 2.5-7 6-7 2.2 0 3.8.7 5 2M43 35c-.3-4.7-2.5-7-6-7-2.2 0-3.8.7-5 2" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mr-2.5 h-4 w-4 shrink-0 stroke-brand-icon [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c.6-3.4 2.7-5.2 6.5-5.2s5.9 1.8 6.5 5.2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mr-2.5 h-4 w-4 shrink-0 stroke-brand-icon [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect x="5.5" y="10" width="13" height="10" rx="2" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10M12 14v2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[18px] w-[18px] stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M5 12h13M13 7l5 5-5 5" />
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedRole = roleDetails[role];
  const roleLabel = selectedRole?.label || "Login ID";
  const rolePlaceholder = selectedRole?.placeholder || "Enter your official ID";

  const clearError = () => {
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!role || !roleId.trim() || !password) {
      setError("Please select your role and enter your ID and password.");
      return;
    }

    setSubmitting(true);

    try {
      const loggedInUser = await login({
        role,
        roleId: roleId.trim(),
        password,
        remember,
      });
      navigate(ROLE_HOME[loggedInUser.role] || "/login", { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen overflow-hidden bg-[linear-gradient(115deg,var(--color-brand-light)_0%,var(--color-brand-background)_54%,#edf7fd_100%)] text-brand-navy max-[900px]:grid-cols-1 max-[900px]:overflow-visible md:grid-cols-2">
      <section
        className="relative grid min-h-screen place-items-center overflow-hidden max-[900px]:min-h-[390px] max-[520px]:min-h-[330px]"
        aria-label={`${APP_NAME} branding`}
      >
        <div className="z-1 -mt-8 flex flex-col items-center text-center max-[520px]:-mt-4">
          <Logo size="lg" subtitle />
        </div>
        <div className="pointer-events-none absolute -left-[17%] top-[2%] h-[38%] w-[62%] rotate-[-14deg] rounded-full border-[18px] border-brand-decoration/[28%]" />
        <div className="pointer-events-none absolute -bottom-[12%] -right-[15%] h-[34%] w-[42%] rounded-full border-[24px] border-brand-decoration/[28%]" />
        <footer className="absolute bottom-6 left-9 grid gap-1 text-[0.58rem] text-brand-footer max-[520px]:left-5">
          <strong className="font-extrabold text-brand-navy">
            {APP_NAME} © {new Date().getFullYear()}
          </strong>
          <span>Judicial Case Intelligence &amp; Support Platform</span>
        </footer>
      </section>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-20 pb-[4.7rem] pt-12 max-[900px]:min-h-0 max-[900px]:px-5 max-[900px]:pb-20 max-[900px]:pt-8">
        <Card className="w-full max-w-[490px] p-8 max-[520px]:p-5">
          <form onSubmit={handleSubmit} noValidate>
            <header className="mb-8 flex items-center gap-4">
              <span className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full bg-brand-sky">
                <PeopleIcon />
              </span>
              <div>
                <h2 className="m-0 mb-1 text-[1.35rem] font-bold text-brand-navy max-[520px]:text-lg">
                  Court Staff Login
                </h2>
                <p className="max-w-[280px] text-[0.72rem] leading-[1.5] text-brand-muted">
                  Access case records, manage hearings and support the judicial
                  process.
                </p>
              </div>
            </header>

            {error && <Alert variant="error">{error}</Alert>}

            <div className="grid gap-4">
              <Select
                label="Role"
                id="role"
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  clearError();
                }}
                placeholder="Select user"
                options={[
                  { value: ROLES.CLERK, label: "Clerk" },
                  { value: ROLES.JUDGE, label: "Judge" },
                  { value: ROLES.STENOGRAPHER, label: "Stenographer" },
                ]}
                required
              />
              <Input
                label={roleLabel}
                id="roleId"
                icon={<UserIcon />}
                type="text"
                value={roleId}
                onChange={(event) => {
                  setRoleId(event.target.value);
                  clearError();
                }}
                placeholder={rolePlaceholder}
                autoComplete="username"
                required
              />
              <PasswordInput
                label="Password"
                id="password"
                icon={<LockIcon />}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearError();
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="my-4 flex items-center justify-between gap-4 text-[0.68rem] text-brand-gray">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-[15px] w-[15px] accent-brand-blue"
                  checked={remember}
                  onChange={(event) => {
                    setRemember(event.target.checked);
                    clearError();
                  }}
                />
                <span>Remember this device</span>
              </label>
              <button
                className="border-0 bg-transparent p-0 text-brand-blue"
                type="button"
                onClick={(event) => event.preventDefault()}
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={submitting}
              loadingText="Signing in..."
              rightIcon={<ArrowIcon />}
            >
              Sign In
            </Button>
          </form>
        </Card>
        <footer className="absolute bottom-6 right-9 flex gap-2 text-[0.58rem] text-brand-footer max-[520px]:left-5 max-[520px]:right-5 max-[520px]:flex-wrap max-[520px]:justify-center">
          <span>Secure</span>
          <i>•</i>
          <span>Transparent</span>
          <i>•</i>
          <span>Efficient</span>
          <i>•</i>
          <span>Supporting the Indian Judiciary</span>
        </footer>
      </section>
    </main>
  );
}

export default Login;
