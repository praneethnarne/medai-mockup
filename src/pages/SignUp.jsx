import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <AuthShell
      title="Create account"
      footer={
        <>
          Already registered?{" "}
          <Link to="/signin" className="font-medium text-accent-dark underline">
            Sign in
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
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="off"
            className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            className="min-h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <input
            id="new-password"
            name="new-password"
            type="password"
            autoComplete="off"
            placeholder="Leave blank — nothing is stored"
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
