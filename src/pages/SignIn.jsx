import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <AuthShell
      title="Sign in"
      footer={
        <>
          No account yet?{" "}
          <Link to="/signup" className="font-medium text-accent-dark underline">
            Create one
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/dashboard");
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            placeholder="you@example.com"
            className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="off"
            placeholder="Leave blank — nothing is checked"
            className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
          />
        </div>
        <button
          type="submit"
          className="mt-1 flex min-h-12 items-center justify-center rounded-md bg-accent px-4 font-medium text-white transition-colors hover:bg-accent-dark"
        >
          Continue
        </button>
      </form>
    </AuthShell>
  );
}
