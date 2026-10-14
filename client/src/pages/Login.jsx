import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_NAME, APP_NAME_PARTS, ROLES } from "../constants/app.js";
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

function ScalesIcon() {
  return (
    <svg
      aria-hidden="true"
      className="mb-3 h-[76px] w-[76px] stroke-[#123762] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.5]"
      viewBox="0 0 72 72"
      fill="none"
    >
      <path d="M36 10v48M24 58h24M17 23h38M36 10v-3" />
      <path d="m17 23-10 18h20L17 23ZM55 23 45 41h20L55 23Z" />
      <path d="M10 41c3 3 11 3 14 0M48 41c3 3 11 3 14 0" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[35px] w-[35px] stroke-[#123762] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.2]"
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
      className="mr-2.5 h-4 w-4 shrink-0 stroke-[#91a1af] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
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
      className="mr-2.5 h-4 w-4 shrink-0 stroke-[#91a1af] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect x="5.5" y="10" width="13" height="10" rx="2" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10M12 14v2" />
    </svg>
  );
}

function EyeIcon({ hidden }) {
  return hidden ? (
    <svg
      aria-hidden="true"
      className="h-4 w-4 stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="m4 4 16 16M10.6 10.7a2 2 0 0 0 2.7 2.7M6.2 6.3C4.7 7.4 3.6 9 3 12c1.5 4.2 4.5 6 9 6 1.7 0 3.2-.3 4.5-.9M9.8 5.1C10.8 4.8 11.8 4.7 12 4.7c4.5 0 7.5 1.8 9 6-.4 1.2-.9 2.1-1.5 2.9" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      className="h-4 w-4 stroke-current [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.6]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.5" />
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
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="grid min-h-screen overflow-hidden bg-[linear-gradient(115deg,#f5fbff_0%,#f8fcff_54%,#edf7fd_100%)] text-[#123762] max-[900px]:grid-cols-1 max-[900px]:overflow-visible md:grid-cols-2">
      <section className="relative grid min-h-screen place-items-center overflow-hidden max-[900px]:min-h-[390px] max-[520px]:min-h-[330px]" aria-label={`${APP_NAME} branding`}>
        <div className="z-1 flex flex-col items-center text-center -mt-8 max-[520px]:-mt-4">
          <ScalesIcon />
          <h1 className="m-0 text-[clamp(3rem,4.2vw,4.1rem)] font-extrabold leading-none tracking-[-0.08em] max-[520px]:text-5xl">
            <span>{APP_NAME_PARTS[0]}</span>
            <strong className="font-extrabold text-[#258bd4]">{APP_NAME_PARTS[1]}</strong>
          </h1>
          <p className="my-5 text-[1.1rem] font-semibold leading-[1.42] max-[520px]:mt-3 max-[520px]:text-[0.95rem]">
            AI-Powered Judicial
            <br />
            Case Intelligence Platform
          </p>
          <span className="h-1.5 w-[152px] rounded-full bg-[#258bd4] shadow-[0_2px_8px_rgb(37_139_212_/_20%)]" />
        </div>
        <div className="pointer-events-none absolute -left-[17%] top-[2%] h-[38%] w-[62%] rotate-[-14deg] rounded-full border-[18px] border-[#d2ebfb]/[28%]" />
        <div className="pointer-events-none absolute -bottom-[12%] -right-[15%] h-[34%] w-[42%] rounded-full border-[24px] border-[#d2ebfb]/[28%]" />
        <footer className="absolute bottom-6 left-9 grid gap-1 text-[0.58rem] text-[#7c8b98] max-[520px]:left-5">
          <strong className="font-extrabold text-[#123762]">{APP_NAME} © 2026</strong>
          <span>Judicial Case Intelligence &amp; Support Platform</span>
        </footer>
      </section>

      <section className="relative flex min-h-screen flex-col items-center justify-center px-20 pb-[4.7rem] pt-12 max-[900px]:min-h-0 max-[900px]:px-5 max-[900px]:pb-20 max-[900px]:pt-8">
        <form className="w-full max-w-[490px] rounded-2xl border border-[#dce7ee] bg-white p-8 shadow-[0_16px_38px_rgb(18_55_98_/_10%)] max-[520px]:p-5" onSubmit={handleSubmit} noValidate>
          <header className="mb-8 flex items-center gap-4">
            <span className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full bg-[#d9effe]">
              <PeopleIcon />
            </span>
            <div>
              <h2 className="m-0 mb-1 text-[1.35rem] font-bold text-[#123762] max-[520px]:text-lg">Court Staff Login</h2>
              <p className="max-w-[280px] text-[0.72rem] leading-[1.5] text-[#75869a]">
                Access case records, manage hearings and support the judicial
                process.
              </p>
            </div>
          </header>

          {error && (
            <div className="mb-4 rounded-md border border-[#f1b8b8] bg-[#fff5f5] px-3 py-3 text-[0.78rem] text-[#9e2929]" role="alert">
              {error}
            </div>
          )}

          <div className="grid gap-4">
            <label className="grid gap-2 text-[0.72rem] font-bold text-[#123762]">
              <span>Role</span>
              <select
                value={role}
                onChange={(event) => {
                  setRole(event.target.value);
                  clearError();
                }}
                required
              >
                <option value="" disabled>
                  Select user
                </option>
                <option value={ROLES.CLERK}>Clerk</option>
                <option value={ROLES.JUDGE}>Judge</option>
                <option value={ROLES.STENOGRAPHER}>Stenographer</option>
              </select>
            </label>

            <label className="grid gap-2 text-[0.72rem] font-bold text-[#123762]">
              <span>{roleLabel}</span>
              <span className="flex min-h-[42px] items-center rounded-md border border-[#d4dfe7] bg-white px-3 focus-within:border-[#258bd4] focus-within:outline focus-within:outline-2 focus-within:outline-[#258bd4]/[18%]">
                <UserIcon />
                <input
                  type="text"
                  value={roleId}
                  onChange={(event) => {
                    setRoleId(event.target.value);
                    clearError();
                  }}
                  placeholder={rolePlaceholder}
                  autoComplete="username"
                  required
                  className="min-w-0 flex-1 border-0 bg-transparent text-[#123762] outline-none placeholder:text-[#a5b0bb]"
                />
              </span>
            </label>

            <label className="grid gap-2 text-[0.72rem] font-bold text-[#123762]">
              <span>Password</span>
              <span className="flex min-h-[42px] items-center rounded-md border border-[#d4dfe7] bg-white px-3 focus-within:border-[#258bd4] focus-within:outline focus-within:outline-2 focus-within:outline-[#258bd4]/[18%]">
                <LockIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    clearError();
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="min-w-0 flex-1 border-0 bg-transparent text-[#123762] outline-none placeholder:text-[#a5b0bb]"
                />
                <button
                  className="grid place-items-center border-0 bg-transparent p-0 text-[#8b9aa7]"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon hidden={showPassword} />
                </button>
              </span>
            </label>
          </div>

          <div className="my-4 flex items-center justify-between gap-4 text-[0.68rem] text-[#5e7082]">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-[15px] w-[15px] accent-[#258bd4]"
                checked={remember}
                onChange={(event) => {
                  setRemember(event.target.checked);
                  clearError();
                }}
              />
              <span>Remember this device</span>
            </label>
            <button
              className="border-0 bg-transparent p-0 text-[#258bd4]"
              type="button"
              onClick={(event) => event.preventDefault()}
            >
              Forgot Password?
            </button>
          </div>

          <button className="flex min-h-11 w-full items-center justify-center gap-3 rounded-md border-0 bg-[#258bd4] font-bold text-white transition hover:bg-[#187cbe] disabled:cursor-wait disabled:opacity-70" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
            {!submitting && <ArrowIcon />}
          </button>
        </form>
        <footer className="absolute bottom-6 right-9 flex gap-2 text-[0.58rem] text-[#7c8b98] max-[520px]:left-5 max-[520px]:right-5 max-[520px]:flex-wrap max-[520px]:justify-center">
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
